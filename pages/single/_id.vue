<template>
  <div>
    <v-layout v-if="!loading">
      <v-row no-gutters class="pa-1" style="height: calc(100vh - 64px); max-width: 100%">
        <v-col cols="12" sm="5" style="max-height: 100%">
          <v-card class="pa-4 overflow-auto" outlined tile max-width="100%" max-height="100%">
            <span class="text-overline"><v-icon v-if="!!caseStudy" small>mdi-book-multiple</v-icon> {{caseStudy}}</span>
            <v-card-text>
              <!-- icon and title -->
              <v-row no-gutters align="center">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      v-bind="attrs"
                      style="font-size:75px"
                      v-on="on"
                    >{{ getIconBySystemClass(item.features[0].systemClass) }}
                    </v-icon>
                  </template>
                  <span>
                    {{ getCRMClassBySystemClass(item.features[0].systemClass) }}
                    -
                    {{
                      getLabelBySystemClass({
                        c: item.features[0].systemClass,
                        l: 'en'
                      })
                    }}
                  </span>
                </v-tooltip>
                <div class="text-h5">{{ item.features[0].properties.title }}</div>
              </v-row>
              <!-- begin, end and sex -->
              <v-row no-gutters>
                <v-col cols="4" v-if="!!begin && begin != 'None'">
                  <v-row no-gutters class="d-flex flex-column align-start">
                    <div class="text-overline">Begin / From</div>
                    <div class="text-body-2 pl-2">
                      {{ begin }}
                    </div>
                  </v-row>
                </v-col>
                <v-spacer v-if="!!begin && begin != 'None'"></v-spacer>
                <v-col xs="4" v-if="!!end && end != 'None'">
                  <v-row no-gutters align="center" class="d-flex flex-column">
                    <div class="text-overline">End / To</div>
                    <div class="text-body-2 pl-2">
                      {{ end }}
                    </div>
                  </v-row>
                </v-col>
                <v-spacer v-if="!!end && end != 'None'"></v-spacer>

                <v-col v-if="hasSex(item.features[0].systemClass)" xs="4">
                  <v-row no-gutters align="center" class="d-flex flex-column align-start">
                    <div class="text-overline">Sex</div>
                    <div class="text-body-2 pl-2">{{ genderFromClass }}</div>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="item.features[0].names">
                <v-col cols="12" >
                  <div>
                    <p class="text-overline mb-1 mt-2">Alias</p>
                    <div v-for="name in item.features[0].names" :key="name.alias">
                      <p class="ml-2 my-1"><span>{{ name.alias }}</span>
                      </p>
                    </div>
                  </div>
                </v-col>

              </v-row>
              <!-- description -->
              <v-row no-gutters>
                <div
                  v-if="item.features[0].descriptions"
                  class="text-body-2 pt-2"
                  :class="{ lineclamp: isClamped }"
                  @click="isClamped = !isClamped"
                >
                  {{
                    item.features[0].descriptions[0].value
                  }}
                </div>

              </v-row>
              <!-- event dialogs -->
              <!--referred to by -->
              <div class="d-flex py-5">
                <events-dialog class="mr-2" v-if="!!participatedIn && participatedIn.length !== 0" :items="participatedIn"
                               label="Events" title="Events"
                ></events-dialog>
                <events-dialog
                  v-if="!!destinationEvents && destinationEvents.length !== 0 && ['place','object_location'].includes(item.features[0].systemClass)"
                  :items="destinationEvents"
                  :label="`Destination Of`" title="destination of Events"
                ></events-dialog>
                <events-dialog
                  v-if="!!originEvents && originEvents.length !== 0 &&['place','object_location'].includes(item.features[0].systemClass)"
                  :items="participatedIn"
                  label="origin of"
                  title="Origin of Events"
                ></events-dialog>
                <referred-to-dialog v-if="!!referredToBy && referredToBy.length !== 0" :items="referredToBy"
                                    label="Show Referred By" title="Referred to by"
                ></referred-to-dialog>


              </div>
              <v-row v-if="false" no-gutters>
                <v-col cols="12">
                  <v-list v-if="!!destinationEvents && destinationEvents.length !== 0">
                    <v-list-group :value="false">
                      <template v-slot:activator>
                        <v-list-item-title>Destination of</v-list-item-title>
                      </template>
                      <v-virtual-scroll
                        :items="destinationEvents"
                        :bench="4"
                        height="250px"
                        item-height="50px"
                      >
                        <template v-slot:default="{ item }">
                          <event-dialog :event="item"/>
                        </template>
                      </v-virtual-scroll>
                    </v-list-group>
                  </v-list>
                  <v-list v-if="!!originEvents && originEvents.length !== 0">
                    <v-list-group :value="false">
                      <template v-slot:activator>
                        <v-list-item-title>Origin of</v-list-item-title>
                      </template>
                      <v-virtual-scroll
                        :items="originEvents"
                        :bench="4"
                        height="250px"
                        item-height="60px"
                      >
                        <template v-slot:default="{ item }">
                          <event-dialog :event="item"/>
                        </template>
                      </v-virtual-scroll>
                    </v-list-group>
                  </v-list>
                </v-col>
              </v-row>
              <!-- relations --->
              <v-row no-gutters>
                <v-col cols="12" v-for="relation in relations" :key="relation.id">
                  <div>
                    <p class="text-overline mb-1">{{ relation[0].relation }}</p>
                    <div v-for="r in relation" :key="r.id">
                      <p class="ml-2 my-1"><span>{{ r.type }}</span>
                        <nuxt-link :to="`/single/${r.id}`">{{ r.label }}</nuxt-link>
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>


              <!-- citation -->
              <v-sheet outlined class="pa-1 mx-n1 mt-5">
                <v-icon large>mdi-format-quote-close</v-icon>
                <p class="text-caption">Licensed under a <a target="_blank"
                                                            href="https://creativecommons.org/licenses/by/4.0/"
                >Creative Commons Attribution 4.0 International License</a></p>
                <p class="text-caption">{{ citation }}</p>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm>
          <v-card class="pa-4" outlined tile>
            <v-tabs right>
              <v-tab>Map</v-tab>
              <v-tab>Graph</v-tab>
              <v-tab>JSON</v-tab>
              <v-tab-item>
                <qmap :events="events" style="height: calc(100vh - 154px); z-index:0" :animate="true"/>
              </v-tab-item>
              <v-tab-item>
                <treegraph
                  v-if="!this.loading"
                  style="height: calc(100vh - 154px)"
                  :treeobject="item"
                />
              </v-tab-item>
              <v-tab-item>
                <json-viewer
                  style="height: calc(100vh - 154px); overflow-y: auto;"
                  :value="item"
                  :expand-depth="5"
                  copyable
                  sort
                />
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import JsonViewer from 'vue-json-viewer';
import qmap from '~/components/map.vue';
import treegraph from '~/components/treegraph.vue';
import ReferredToDialog from '../../components/ReferredToDialog';
import EventsDialog from '../../components/EventsDialog';

export default {
  components: {
    EventsDialog,
    ReferredToDialog,
    qmap,
    JsonViewer,
    treegraph,
  },
  async fetch() {
    this.loading = true;
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_3_entity__id__({
      id_: this.$route.params.id,
    });
    // eslint-disable-next-line prefer-destructuring
    this.item = p.body;
    if (this.item.features[0].systemClass === 'object_location') {
      this.related = [this.item];
    } else {
      this.related = await this.fetchRelated(this.item.features[0].relations, 'object_location');
    }

    this.loading = false;
  },
  data() {
    return {
      item: {},
      related: [],
      expanded: [],
      loading: false,
      isClamped: true,
      destinationOf: [],
      originOf: [],
    };
  },
  methods: {
    async fetchRelated(relations, type) {
      return Promise.all(relations.filter((r) => r.relationSystemClass === type)
        .map(async (element) => {
          const ri = await this.$api.Entities.get_api_0_3_entity__id__({
            id_: element.relationTo.split('/')
              .pop(),
          });
          return ri.body;
        }));
    },

    closeAll() {
      Object.keys(this.$refs)
        .forEach((k) => {
          if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
            this.$refs[k].$el.click();
          }
        });
    },
    openAll() {
      Object.keys(this.$refs)
        .forEach((k) => {
          if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
            this.$refs[k].$el.click();
          }
        });
    },
  },
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
      'hasTime',
      'hasSex',
    ]),
    ...mapGetters('data', ['getEvents']),
    relationTypes() {
      // eslint-disable-next-line max-len
      if (Array.isArray(this.item.features[0].relations)) return [...new Set(this.item.features[0].relations.map((item) => item.relationType))];
      return [];
    },
    events() {
      return Object.keys(this.getEvents)
        .reduce((filtered, key, sd) => {
          if (this.getEvents[key]?.toPlace == parseInt(this.$route.params.id, 10) + 1 || this.getEvents[key]?.fromPlace == parseInt(this.$route.params.id, 10) + 1) filtered[key] = this.getEvents[key];
          return filtered;
        }, {});
    },
    genderFromClass() {
      if (Array.isArray(this.item.features[0].relations)) {
        if (this.item.features[0].relations.filter((r) => r.label === 'Male').length > 0) return 'Male';
        if (this.item.features[0].relations.filter((r) => r.label === 'Female').length > 0) return 'Female';
      }
      return 'n/a';
    },
    begin() {
      return this.item.features[0]?.when?.timespans?.[0]?.start?.earliest ?
        this.item.features[0]?.when?.timespans?.[0]?.start?.earliest :
        this.item.features[0]?.when?.timespans?.[0]?.start?.latest;
    },
    end() {
      return this.item.features[0]?.when?.timespans?.[0]?.end?.earliest ?
        this.item.features[0]?.when?.timespans?.[0]?.end?.earliest :
        this.item.features[0]?.when?.timespans?.[0]?.end?.latest;
    },
    destinationEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P26i was destination of'));
    },
    originEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P27i was origin of'));
    },
    citation() {
      const id = this.item.features[0]['@id'].split('/')
        .pop();
      const author = this.item.features[0].types?.find(x => x.identifier.endsWith('9424'))?.label || '';
      const caseStudy = this.item.features[0].types?.find(x => x.identifier.endsWith('13087'))?.label || '';
      return `${author}, ${this.item.features[0].properties.title} - ${caseStudy}, The Database, ${id} - ${location.href} ${new Date().toLocaleDateString()}`;
    },
    relations() {
      return this.item.features[0]?.relations.reduce((dict, x) => {
        const id = x.relationTo.split('/')
          .pop();
        const relation = x.relationType.split(' ')
          .slice(1)
          .join(' ');
        if (relation === 'has type' || relation === 'is referred to by' || relation === 'participated in') return dict;
        dict[relation] = [...(dict[relation] || []), {
          ...x,
          id,
          relation
        }];
        return dict;
      }, {});

    },
    referredToBy() {
      return this.item.features[0]?.relations.filter(x => x.relationType.startsWith('crm:P67i'));
    },
    participatedIn() {
      return this.item.features[0]?.relations.filter(x => x.relationType.startsWith('crm:P11i'));
    },
    caseStudy(){
      return this.item.features[0]?.types.find(x => x.identifier.endsWith('1420'))?.label || '';
    }

  },
  watch: {
    '$route.params': {
      handler() {
        this.$fetch();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.closeAll();
  },
};
</script>
<style>
.lineclamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
