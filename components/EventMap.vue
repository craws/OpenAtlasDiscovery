<template>
  <div class="bgmap mb-1" :style="`position:relative; --map-height:${styleHeight}`">
    <v-overlay :value="!getEventsLoaded" absolute z-index="9999">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12">
        <v-card outlined class="mapheight relative" tile>
          <qmap style="z-index:0" :events="events" :persons="persons" :filter="filter" :animate="animate"
                :currentActor="options.currentActor" :currentPlace="options.currentPlace" :currentEvent="options.currentEvent"
          />
          <div class="map-controls flex-column   d-flex justify-end">
            <map-control-expand id="caseStudy" @activated="handleControl" v-model="controlGroup.caseStudy" class="mb-2"
                                label="Case Studies"
            >
              <template v-slot:icon>mdi-book-multiple</template>

              <filter-case-studies v-model="options.caseStudies"></filter-case-studies>
            </map-control-expand>
            <map-control-expand id="types" @activated="handleControl" v-model="controlGroup.types" class="mb-2"
                                label="Event Types"
            >
              <template v-slot:icon>mdi-email-multiple</template>
              <filter-types v-model="options.eventTypes"></filter-types>

            </map-control-expand>

            <map-control-expand id="actors" @activated="handleControl" v-model="controlGroup.actors" class="mb-2"
                                label="Actors"
            >
              <template v-slot:icon>mdi-account-switch</template>
              <filter-actors v-if="getPersonsLoaded" v-model="options.actorFilter"></filter-actors>
              <v-row v-else>
                <v-progress-circular class="ma-auto" indeterminate size="64"/>
              </v-row>
            </map-control-expand>

            <map-control v-model="animate" label="animate">mdi-transition</map-control>

          </div>
          <div class="timeline white mx-5 px-5 pt-1 text-center">
            {{ timeLabels[time[0]] }} AD - {{ timeLabels[time[1]] }} AD
            <v-range-slider color="black" v-model="time" :max="6" step="1" ticks="always" tick-size="3"/>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <span class="license-tag">Licensed under a <a target="_blank"
                                                  href="https://creativecommons.org/licenses/by/4.0/"
    >Creative Commons Attribution 4.0 International License</a></span>
  </div>
</template>


<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';
import MapControlExpand from '../components/MapControlExpand';
import MapControl from '../components/MapControl';
import { loadAllFromCidocClass } from '../plugins/api';
import FilterTypes from './FilterTypes';
import FilterActors from './FilterActors';

export default {
  name: 'EventMap',
  props: {
    'selectedCaseStudies': [],
    'height': undefined,
    options: {
      type: Object,
      default: () => ({

        caseStudies: [],

      })
    }

  },

  components: {
    FilterActors,
    FilterTypes,
    MapControl,
    MapControlExpand,
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
      timeLabels: [350, 400, 450, 500, 550, 600, 650],
      time: [0, 6],
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
      controlGroup: {
        caseStudy: false,
        types: false,
        actors: false
      },
      events: {},
      persons: {},
    };
  },
  async mounted() {
    await this.loadGeoItems();
    await this.loadEvents();
    await this.loadPersons();

  },

  computed: {
    ...mapGetters('data', ['getEvents', 'getCaseStudies', 'getEventTypes', 'getPersons', 'getEventsLoaded', 'getPersonsLoaded']),
    filter() {
      return {
        caseStudies: this.caseStudies || [],
        from: this.time[0] === 0 ? undefined : `0${this.timeLabels[this.time[0]]}-01-01`,
        to: this.time[1] === this.timeLabels.length - 1 ? undefined : `0${this.timeLabels[this.time[1]]}-01-01`,
        eventTypes: this.eventTypes.flat(),
        sender: this.actorFilter.sender,
        bearer: this.actorFilter.bearer,
        recipient: this.actorFilter.recipient,
        traveller: this.actorFilter.traveller,
        others: this.actorFilter.others,
      };
    },
    caseStudies() {
      return this.options.caseStudies || [];
    },
    eventTypes() {
      return this.options.eventTypes || [];
    },
    styleHeight() {
      return this.height || 'calc(100vh - 64px)';
    },
    actorFilter() {
      const defaultValue = {
        sender: {
          id: undefined,
          sex: undefined
        },
        bearer: {
          id: undefined,
          sex: undefined
        },
        recipient: {
          id: undefined,
          sex: undefined
        },
        traveller: {
          id: undefined,
          sex: undefined
        },
        others: {
          id: undefined,
          sex: undefined
        }
      };
      return this.options.actorFilter || defaultValue;
    }
  },
  methods: {
    ...mapMutations('data', ['SET_EVENTS', 'SET_EVENTS_LOADED', 'SET_PERSONS', 'SET_PERSONS_LOADED']),
    ...mapActions('data', ['loadGeoItems', 'loadEvents', 'loadTypeTree', 'loadPersons']),
    handleControl(activated) {
      Object.keys(this.controlGroup)
        .forEach(key => {
          if (key !== activated) {
            this.controlGroup[key] = false;
          }
        });
    },
    async loadEvents() {
      if (this.getEventsLoaded) {
        this.events = this.getEvents;
      } else {
        const events = await loadAllFromCidocClass('event', ['when', 'relations', 'types'], 100, ['P27', 'P26', 'P11']);
        const eventDict = events.reduce((dict, event) => {
          const eventId = event.features[0]['@id'].split('/')
            .pop();
          const fromPlace = event.features[0]?.relations?.find(y => y.relationType === 'crm:P27 moved from')
            ?.relationTo
            .split('/')
            .pop();
          const toPlace = event.features[0]?.relations?.find(y => y.relationType === 'crm:P26 moved to')
            ?.relationTo
            .split('/')
            .pop();
          let sender = event.features[0]?.relations?.find(y => y.relationType === 'crm:P11 had participant' && y.type === 'Sender');
          if (sender) {
            sender.id = sender?.relationTo.split('/')
              .pop();
          }
          let recipient = event.features[0]?.relations?.find(y => y.relationType === 'crm:P11 had participant' && y.type === 'Recipient');
          if (recipient) {
            recipient.id = recipient?.relationTo.split('/')
              .pop();
          }
          let bearer = event.features[0]?.relations?.find(y => y.relationType === 'crm:P11 had participant' && y.type === 'Bearer');
          if (bearer) {
            bearer.id = bearer?.relationTo.split('/')
              .pop();
          }
          return {
            ...dict,
            [eventId]: {
              ...event.features[0],
              fromPlace: parseInt(fromPlace),
              toPlace: parseInt(toPlace),
              id: eventId,
              sender,
              bearer,
              recipient
            }
          };
        }, {});
        const personDict = [...Object.values(eventDict)
          .map(x => x.sender),
          Object.values(eventDict)
            .map(x => x.recipient),
          Object.values(eventDict)
            .map(x => x.bearer)].filter(Boolean)
          .reduce((dict, person) => ({
            ...dict,
            [person.id]: person
          }), {});
        this.events = eventDict;

        this.SET_EVENTS_LOADED(true);

        this.SET_EVENTS(eventDict);
        this.SET_PERSONS(personDict);
      }
    },
    async loadPersons() {
      if (this.getPersonsLoaded) {
        this.persons = this.getPersons;
      } else {
        const localItems = await loadAllFromCidocClass('actor', ['types', 'relations'], 100, ['P11']);

        let copyOfEvents = JSON.parse(JSON.stringify(this.events));
        const persons = localItems.reduce((dict, person) => {
          const id = person.features[0]['@id'].split('/')
            .pop();
          const sex = person.features[0].types?.find(y => y.hierarchy === 'Sex')?.label;
          const label = person.features[0].properties.title;
          const participatedIn = person.features[0].relations?.filter(x => x.relationType === 'crm:P11i participated in');
          participatedIn?.forEach(x => {
            const typeName = ['Sender', 'Bearer', 'Recipient', 'Traveller'].includes(x.type) ? x.type : 'Others';
            const eventId = x.relationTo.split('/')
              .pop();
            copyOfEvents[eventId] = {
              ...copyOfEvents[eventId],
              [typeName]: [...(copyOfEvents[eventId][typeName] || []), {
                id,
                sex
              }]
            };
          });

          return {
            ...dict,
            [id]: {
              id,
              sex,
              label
            }
          };
        }, {});
        this.persons = persons;
        this.events = copyOfEvents;
        this.SET_PERSONS_LOADED(true);
        this.SET_PERSONS(persons);
        this.SET_EVENTS(copyOfEvents);
      }
    }

  },
  watch: {
    selectedCaseStudies: {
      handler() {
        this.options.caseStudies = this.selectedCaseStudies;
      },
      immediate: true,
    },
  }

};
</script>
<style>
.license-tag {
  position: absolute;
  bottom: 1px;
  left: 1px;
  font-size: 11px;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.7);
}
</style>
<style scoped>
.mapheight {
  height: var(--map-height);
}

.bgmap {
  height: var(--map-height);
  max-width: 100% !important;
  top: 0;
  padding: 0;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
}

.timeline {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  outline: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px !important;
}
</style>
