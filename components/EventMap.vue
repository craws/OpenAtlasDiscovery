<template>
  <div class="bgmap" style="position:relative">
    <v-overlay :value="!getEventsLoaded" absolute z-index="9999">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" >
        <v-card outlined class="full-height relative" tile>
          <qmap style="z-index:0" :events="getEvents" :filter="filter" :animate="animate" />
          <div class="map-controls flex-column   d-flex justify-end">
            <map-control-expand id="caseStudy" @activated="handleControl" v-model="controlGroup.caseStudy" class="mb-2" label="Case Studies">
              <template v-slot:icon>mdi-book-multiple</template>

              <filter-case-studies v-model="caseStudies"></filter-case-studies>
            </map-control-expand>
            <map-control-expand id="types"  @activated="handleControl" v-model="controlGroup.types" class="mb-2" label="Event Types">
              <template v-slot:icon>mdi-email-multiple</template>

              <v-autocomplete
                class="mb-n5"
                v-model="eventTypes"
                label="Event Types"
                :items="getEventTypes"
                item-text="name"
                item-value="id"
                multiple
                outlined
                chips
              />
            </map-control-expand>

            <map-control-expand id="actors" @activated="handleControl" v-model="controlGroup.actors" class="mb-2" label="Actors">
              <template v-slot:icon>mdi-account-switch</template>
              <v-row no-gutters>
                <v-col cols="3">
                  Sender
                </v-col>
                <v-col cols="5" class="px-2">
                  <v-autocomplete
                    v-model="sender.id"
                    dense
                    :items="Object.values(getPersons)"
                    item-text="label"
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
                    :items="Object.values(getPersons)"
                    item-text="label"
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
                    :items="Object.values(getPersons)"
                    item-text="label"
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
            </map-control-expand>

            <map-control v-model="animate"  label="animate">mdi-transition</map-control>

          </div>
          <div class="timeline white mx-5 px-5 pt-1 text-center">
            {{ timeLabels[time[0]] }} AD - {{ timeLabels[time[1]] }} AD
            <v-range-slider color="black" v-model="time" :max="5" step="1" ticks="always" tick-size="3" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';
import MapControlExpand from '../components/MapControlExpand';
import MapControl from '../components/MapControl';

export default {
  name:'EventMap',
  components: {
    MapControl,
    MapControlExpand,
    Logo,
    qmap,
  },
  data() {
    return {
      animate: false,
      caseStudies:[],
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
      content: {
        contact: '',
        intro: 'loading...',
        legalNotice: '',
        siteName: '',
      },
      loading: true,
      reveal: false,
      eventTypes: [],
      controlGroup:{
        caseStudy:false,
        types:false,
        actors:false
      }
    };
  },
  async mounted() {
    if (!this.getEventsLoaded) {
      console.time('loadAll')
      await  this.loadGeoItems();
      await Promise.all([
        this.loadTypeTree(),
        this.loadEvents(),
      ]);
      console.timeEnd('loadAll')
      this.loadPersons()
    }

  },

  computed: {
    ...mapGetters('data', ['getEvents', 'getCaseStudies', 'getEventTypes', 'getPersons', 'getEventsLoaded', 'getPersonsLoaded']),
    filter() {
      return {
        caseStudies: this.caseStudies,
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
    handleControl(activated){
      Object.keys(this.controlGroup).forEach(key => {
        if(key !== activated)
          this.controlGroup[key] = false;
      });
    }

  }

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

.map-controls{
  position:absolute;
  top: 10px;
  right: 10px;
}
.timeline{
  position:absolute;
  bottom:20px;
  left:0;
  right:0;
  outline: 2px solid rgba(0,0,0,0.2);
  border-radius: 4px !important;
}
</style>
