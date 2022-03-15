<template>
  <v-container class="bgmap">
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" sm="6" md="8">
        <v-card outlined class="full-height"tile>
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
              <v-col cols="12" v-for="item in caseStudyCheckboxes" :key="item.id">
                <div class="d-flex justify-space-between align-center">
                  <v-checkbox v-model="item.selected" :label="item.name"></v-checkbox>
                  <v-btn
                    icon
                    @click="item.expanded = !item.expanded"
                    class="expand-button"
                    :class="{ clicked: item.expanded }"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>

                <v-expand-transition>
                  <v-row no-gutters class="ml-5" v-if="item.expanded">
                    <v-col cols="12" v-for="subitem in item.subtypes" :key="subitem.id">
                      <v-checkbox
                        :disabled="!item.selected"
                        class="mt-0"
                        v-model="subitem.selected"
                        :label="subitem.name"
                      ></v-checkbox>
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
                  label="Event Types"
                  v-model="eventTypes"
                  :items="getEventTypes"
                  item-text="name"
                  item-value="id"
                  multiple
                  outlined
                  chips
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="3">Sender</v-col>
              <v-col cols="5" class="px-2">
                <v-autocomplete
                dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  v-model="sender.id"
                  :disabled="!!sender.sex"
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                dense
                  v-model="sender.sex"
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3" >Recipient</v-col>
              <v-col cols="5" class="px-2" >
                <v-autocomplete
                  dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  v-model="recipient.id"
                  :disabled="!!recipient.sex"
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  dense

                  v-model="recipient.sex"
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">Bearer</v-col>
              <v-col cols="5" class="px-2">
                <v-autocomplete
                dense
                  :items="getPersons"
                  item-text="properties.title"
                  item-value="id"
                  v-model="bearer.id"
                  :disabled="!!bearer.sex"
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                dense
                  v-model="bearer.sex"
                  label="Sex"
                  outlined
                  clearable
                  :items="['Male', 'Female']"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
                  <v-checkbox v-model="animate" label="animate"></v-checkbox>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';

export default {
  components: {
    Logo,
    qmap,
  },
  data() {
    return {
      animate:false,
      sender: { id: undefined, sex: undefined },
      recipient: { id: undefined, sex: undefined },
      bearer: { id: undefined, sex: undefined },
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

    this.caseStudyCheckboxes = this.getCaseStudies.map(x => ({ ...x, subtypes: x.subtypes.map(y => ({ ...y, selected: true })), selected: true, expanded: false }))

  },

  computed: {
    ...mapGetters('app', [
      'getGeoItemsAsFeatureCollection',
    ]),
    ...mapGetters('data', ['getEvents', 'getCaseStudies', 'getEventTypes', 'getPersons']),
    filter() {
      return {
        caseStudies: this.caseStudyCheckboxes.filter(x => x.selected).flatMap(x => [x.id, ...x.subtypes.filter(y => y.selected).map(y => y.id)]),
        from: `0${this.timeLabels[this.time[0]]}-01-01`,
        to: `0${this.timeLabels[this.time[1]]}-01-01`,
        eventTypes: this.eventTypes,
        sender: this.sender,
        bearer: this.bearer,
        recipient: this.recipient,
      }
    },
  },
  methods: {
    clickOnCaseStudie(item) {
      if (this.filterCaseStudies.includes(item.id)) {
        this.filterCaseStudies = this.filterCaseStudies.filter(x => ![item.id, ...item.subtypes.map(x => x.id)].includes(x));
      } else {
        this.filterCaseStudies = [...this.filterCaseStudies, item.id, ...item.subtypes.map(x => x.id)];
      }
    }
  }
};
</script>
<style scoped>
.full-height{
  height: calc(100vh - 64px);
}
.bgmap {
  height: calc(100vh - 64px);
  max-width: 100% !important;
  position: absolute;
  top: 0px;
  padding: 0px;
}

.expand-button {
  transition: all ease-in-out 100ms;
}

.expand-button.clicked {
  transform: rotate(90deg);
}
</style>
