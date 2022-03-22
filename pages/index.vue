<template>
  <v-container class="bgmap">
    <v-overlay :value="!getEventsLoaded" z-index="9999">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" sm="6" md="8">
        <v-card outlined class="full-height" tile>
          <qmap :events="getEvents" :filter="filter" :animate="animate" />
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="full-height pa-2 overflow-auto" tile outlined>
          <v-card-title>Filter Settings</v-card-title>
          <v-card-subtitle>Timeline</v-card-subtitle>
          <v-card-text>
            {{ timeLabels[time[0]] }} AD - {{ timeLabels[time[1]] }} AD
            <v-range-slider v-model="time" :max="5" step="1" ticks="always" tick-size="3" />
          </v-card-text>

          <v-card-subtitle>CaseStudies</v-card-subtitle>
          <v-card-text>
            <v-row no-gutters>
              <v-col v-for="item in caseStudyCheckboxes" :key="item.id" cols="12">
                <div class="d-flex justify-space-between align-center">
                  <v-checkbox v-model="item.selected" :label="item.name" />
                  <v-btn
                    icon
                    class="expand-button"
                    :class="{ clicked: item.expanded }"
                    @click="item.expanded = !item.expanded"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>

                <v-expand-transition>
                  <v-row v-if="item.expanded" no-gutters class="ml-5">
                    <v-col v-for="subitem in item.subtypes" :key="subitem.id" cols="12">
                      <v-checkbox
                        v-model="subitem.selected"
                        :disabled="!item.selected"
                        class="mt-0"
                        :label="subitem.name"
                      />
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-subtitle>Event Type</v-card-subtitle>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                <v-autocomplete
                  v-model="eventTypes"
                  label="Event Types"
                  :items="getEventTypes"
                  item-text="name"
                  item-value="id"
                  multiple
                  outlined
                  chips
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-if="getPersonsLoaded">
            <v-row no-gutters>
              <v-col cols="3">
                Sender
              </v-col>
              <v-col cols="5" class="px-2">
                <v-autocomplete
                  v-model="sender.id"
                  dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  :disabled="!!sender.sex"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="sender.sex"
                  dense
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                Recipient
              </v-col>
              <v-col cols="5" class="px-2">
                <v-autocomplete
                  v-model="recipient.id"
                  dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  :disabled="!!recipient.sex"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="recipient.sex"

                  dense
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                Bearer
              </v-col>
              <v-col cols="5" class="px-2">
                <v-autocomplete
                  v-model="bearer.id"
                  dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  :disabled="!!bearer.sex"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="bearer.sex"
                  dense
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-checkbox v-model="animate" label="animate" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';

export default {
  components: {
    Logo,
    qmap,
  },
  data() {
    return {
      animate: false,
      sender: {
        id: undefined,
        sex: undefined,
      },
      recipient: {
        id: undefined,
        sex: undefined,
      },
      bearer: {
        id: undefined,
        sex: undefined,
      },
      timeLabels: [350, 400, 450, 500, 600, 650],
      time: [0, 5],
      items: [],
      filterCaseStudies: [],
      casestudies: [633, 13064, 9362, 1420],
      content: {
        contact: '',
        intro: 'loading...',
        legalNotice: '',
        siteName: '',
      },
      loading: true,
      reveal: false,
      eventTypes: [],
      caseStudyCheckboxes: [],
    };
  },
  async mounted() {
    await Promise.all([this.loadTypeTree(),
      this.loadTypeTree(), this.loadPersons(), this.loadGeoItems(), this.loadEvents()]);
    this.caseStudyCheckboxes = this.getCaseStudies.map((x) => ({
      ...x,
      subtypes: x.subtypes.map((y) => ({
        ...y,
        selected: true,
      })),
      selected: true,
      expanded: false,
    }));
  },

  computed: {
    ...mapGetters('app', [
      'getGeoItemsAsFeatureCollection',
    ]),
    ...mapGetters('data', ['getEvents', 'getCaseStudies', 'getEventTypes', 'getPersons', 'getEventsLoaded', 'getPersonsLoaded']),
    filter() {
      return {
        caseStudies: this.caseStudyCheckboxes.filter((x) => x.selected)
          .flatMap((x) => [x.id, ...x.subtypes.filter((y) => y.selected)
            .map((y) => y.id)]),
        from: `0${this.timeLabels[this.time[0]]}-01-01`,
        to: `0${this.timeLabels[this.time[1]]}-01-01`,
        eventTypes: this.eventTypes,
        sender: this.sender,
        bearer: this.bearer,
        recipient: this.recipient,
      };
    },
  },
  methods: {
    ...mapActions('data', ['loadGeoItems', 'loadEvents', 'loadTypeTree', 'loadPersons']),
    clickOnCaseStudy(item) {
      if (this.filterCaseStudies.includes(item.id)) {
        this.filterCaseStudies = this.filterCaseStudies.filter((x) => ![item.id,
          ...item.subtypes.map((y) => y.id)].includes(x));
      } else {
        this.filterCaseStudies = [...this.filterCaseStudies,
          item.id, ...item.subtypes.map((x) => x.id)];
      }
    },
  },
};
</script>
<style scoped>
.full-height {
  height: calc(100vh - 64px);
}

.bgmap {
  height: calc(100vh - 64px);
  max-width: 100% !important;
  top: 0;
  padding: 0;
}

.expand-button {
  transition: all ease-in-out 100ms;
}

.expand-button.clicked {
  transform: rotate(90deg);
}
</style>
