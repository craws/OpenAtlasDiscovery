<template>
  <div class="bgmap" style="position:relative">
    <v-overlay :value="!getEventsLoaded" absolute z-index="9999">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12">
        <v-card outlined class="full-height relative" tile>
          <qmap style="z-index:0" :events="events" :persons="persons" :filter="filter" :animate="animate"/>
          <div class="map-controls flex-column   d-flex justify-end">
            <map-control-expand id="caseStudy" @activated="handleControl" v-model="controlGroup.caseStudy" class="mb-2"
                                label="Case Studies"
            >
              <template v-slot:icon>mdi-book-multiple</template>

              <filter-case-studies v-model="caseStudies"></filter-case-studies>
            </map-control-expand>
            <map-control-expand id="types" @activated="handleControl" v-model="controlGroup.types" class="mb-2"
                                label="Event Types"
            >
              <template v-slot:icon>mdi-email-multiple</template>

              <v-autocomplete
                class="mb-n5"
                v-model="eventTypes"
                label="Event Types"
                :items="eventTypesOrdered"
                item-text="name"
                item-value="id"
                multiple
                outlined
                clearable
                deletable-chips
                small-chips
              />
            </map-control-expand>

            <map-control-expand id="actors" @activated="handleControl" v-model="controlGroup.actors" class="mb-2"
                                label="Actors"
            >
              <template v-slot:icon>mdi-account-switch</template>
              <div v-if="getPersonsLoaded">
              <v-row no-gutters>
                <v-col cols="6" class="px-2">
                  <v-autocomplete
                    v-model="sender.id"
                    label="Sender"
                    dense
                    :items="Object.values(getPersons)"
                    item-text="label"
                    item-value="id"
                    :disabled="!!sender.sex"
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="6">
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
                <v-col cols="6" class="px-2">
                  <v-autocomplete
                    v-model="recipient.id"
                    dense
                    label="Recipient"
                    :items="Object.values(getPersons)"
                    item-text="label"
                    item-value="id"
                    :disabled="!!recipient.sex"
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="6">
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
                <v-col cols="6" class="px-2">
                  <v-autocomplete
                    v-model="bearer.id"
                    dense
                    :items="Object.values(getPersons)"
                    item-text="label"
                    item-value="id"
                    :disabled="!!bearer.sex"
                    outlined
                    label="Bearer"
                    clearable
                  />
                </v-col>
                <v-col cols="6">
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
              </div>
              <v-row v-else>
              <v-progress-circular class="ma-auto" indeterminate size="64"/>
              </v-row>
            </map-control-expand>

            <map-control v-model="animate" label="animate">mdi-transition</map-control>

          </div>
          <div class="timeline white mx-5 px-5 pt-1 text-center">
            {{ timeLabels[time[0]] }} AD - {{ timeLabels[time[1]] }} AD
            <v-range-slider color="black" v-model="time" :max="5" step="1" ticks="always" tick-size="3"/>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';
import MapControlExpand from '../components/MapControlExpand';
import MapControl from '../components/MapControl';
import { loadAllFromCidocClass } from '../plugins/api';

export default {
  name: 'EventMap',
  components: {
    MapControl,
    MapControlExpand,
    Logo,
    qmap,
  },
  data() {
    return {
      animate: false,
      caseStudies: [],
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
        caseStudies: this.caseStudies,
        from: `0${this.timeLabels[this.time[0]]}-01-01`,
        to: `0${this.timeLabels[this.time[1]]}-01-01`,
        eventTypes: this.eventTypes,
        sender: this.sender,
        bearer: this.bearer,
        recipient: this.recipient,
      };
    },
    eventTypesOrdered() {
      const firstItems = [639, 939, 8185];
      console.log(this.getEventTypes.filter(x => firstItems.includes(x.name)), 'eventTypes');
      return [...this.getEventTypes].sort((x, y) => firstItems.includes(x.id) ? -1 : firstItems.includes(y.id) ? 1 : 0);
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
            const eventId = x.relationTo.split('/')
              .pop();
            copyOfEvents[eventId] = {
              ...copyOfEvents[eventId],
              [x.type]: {
                id,
                sex
              }
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
