<template>
  <div>
    <v-layout v-if="!loading">
      <v-row no-gutters class="pa-1" style="height: calc(100vh - 64px); max-width: 100%">
        <v-col cols="12" sm="5" style="max-height: 100%">
          <v-card class="pa-4 overflow-auto" outlined tile max-width="100%" max-height="100%">
            <nuxt-link v-if="!!caseStudies" v-for="caseStudy in caseStudies" :key="caseStudy.identifier"
                       :to="`/casestudy/${caseStudy.identifier.split('/').pop()}`"
                       class="text-overline text--darken-2 grey--text d-block "
            >
              <v-icon small>mdi-book-multiple</v-icon>
              {{ caseStudy.label }}
            </nuxt-link>
            <v-card-text>
              <!-- icon and title -->
              <v-row no-gutters align="center">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" style="font-size:75px" v-on="on">{{
                        getIconBySystemClass(item.features[0].systemClass)
                      }}
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
                <div class="d-flex flex-column">
                  <span class="text-h5 mb-n1">{{ item.features[0].properties.title }}</span>
                  <span v-if="!!subtitle" class="text-overline pl-1">{{ subtitle }}</span>
                </div>
              </v-row>
              <!-- begin, end and sex -->
              <v-row no-gutters>
                <v-col cols="4" v-if="!!begin && begin !== 'None'">
                  <v-row no-gutters class="d-flex flex-column align-start">
                    <div class="text-overline">Begin / From</div>
                    <div class="text-body-2 pl-2">
                      {{ begin }}
                    </div>
                  </v-row>
                </v-col>
                <v-spacer v-if="!!begin && begin !== 'None'"></v-spacer>
                <v-col xs="4" v-if="!!end && end !== 'None'">
                  <v-row no-gutters align="center" class="d-flex flex-column">
                    <div class="text-overline">End / To</div>
                    <div class="text-body-2 pl-2">
                      {{ end }}
                    </div>
                  </v-row>
                </v-col>
                <v-spacer v-if="!!end && end !== 'None'"></v-spacer>

                <v-col v-if="hasSex(item.features[0].systemClass)" xs="4">
                  <v-row no-gutters align="center" class="d-flex flex-column align-start">
                    <div class="text-overline">Sex</div>
                    <div class="text-body-2 pl-2">{{ genderFromClass }}</div>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="item.features[0].names">
                <v-col cols="12">
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
                  v-if="!!item.features[0].descriptions && !!item.features[0].descriptions[0] && !!item.features[0].descriptions[0].value"
                  class="text-body-2 pt-2" @click="isClamped = !isClamped"
                  ref="descriptionField"
                >
                  <p :class="{ lineclamp: isClamped }">{{
                      item.features[0].descriptions[0].value
                    }}</p>
                  <p v-if="isClamped" style="cursor:pointer">read more</p>
                </div>

              </v-row>
              <!-- event dialogs -->
              <!--referred to by -->
              <div class="d-flex py-5 flex-wrap">
                <events-dialog v-if="!!participatedIn && participatedIn.length !== 0" :items="participatedIn"
                               label="Events" title="Events"
                ></events-dialog>
                <events-dialog
                  v-if="!!originEvents && originEvents.length !== 0 && ['place', 'object_location'].includes(item.features[0].systemClass)"
                  :items="originEvents" label="origin of" title="Origin of Events"
                ></events-dialog>
                <events-dialog
                  v-if="!!destinationEvents && destinationEvents.length !== 0 && ['place', 'object_location'].includes(item.features[0].systemClass)"
                  :items="destinationEvents" :label="`Destination Of`" title="Destination of Events"
                ></events-dialog>


              </div>
              <v-row v-if="false" no-gutters>
                <v-col cols="12">
                  <v-list v-if="!!destinationEvents && destinationEvents.length !== 0">
                    <v-list-group :value="false">
                      <template v-slot:activator>
                        <v-list-item-title>Destination of</v-list-item-title>
                      </template>
                      <v-virtual-scroll :items="destinationEvents" :bench="4" height="250px" item-height="50px">
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
                      <v-virtual-scroll :items="originEvents" :bench="4" height="250px" item-height="60px">
                        <template v-slot:default="{ item }">
                          <event-dialog :event="item"/>
                        </template>
                      </v-virtual-scroll>
                    </v-list-group>
                  </v-list>
                </v-col>
              </v-row>
              <!-- relations --->
              <v-expansion-panels
                multiple
                flat
                :hover="true"
                v-model="panel"
              >
                <v-expansion-panel v-if="!!ghostLetters && ghostLetters.length !== 0">
                  <v-expansion-panel-header> refers to ghost events</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-for="(g,index) in ghostLetters" :key="`ghost events - ${g.id} - ${index}`">
                      <p class="ml-2 my-1">
                        <nuxt-link :to="`/single/${g.features[0]['@id'].split('/').pop()}`">
                          {{ g.features[0].properties.title }}
                        </nuxt-link>
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-for="(relation,key) in relations" :key="relation.id">
                  <v-expansion-panel-header>{{ key }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-for="(r,index) in relation" :key="`${relation[0].relation} - ${r.id} - ${index}`">
                      <p class="ml-2 my-1"><span>{{ r.type }}</span>
                        <nuxt-link v-if="!r.externalLink" :to="`/single/${r.id}`">{{ r.label }}</nuxt-link>
                        <a v-else target="_blank" :href="r.externalLink">{{ r.label }} - ID :
                          {{ r.relationDescription }}</a>
                      </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>


              <!-- citation -->
              <v-sheet outlined class="pa-1 mx-n1 mt-5">
                <v-icon large>mdi-format-quote-close</v-icon>
                <p class="text-caption">Licensed under a <a target="_blank"
                                                            href="https://creativecommons.org/licenses/by/4.0/"
                >Creative Commons Attribution 4.0 International
                  License</a></p>
                <p class="text-caption">{{ citation }}</p>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm>
          <v-card class="pa-4" outlined tile>
            <v-tabs right>
              <v-tab>Map</v-tab>

              <v-tab>JSON</v-tab>
              <v-tab-item>
                <event-map height="calc(100vh - 154px)" id="eventMap" :options="mapOptions"></event-map>
              </v-tab-item>
              <v-tab-item>
                <json-viewer style="height: calc(100vh - 154px); overflow-y: auto;" :value="item" :expand-depth="5"
                             copyable sort
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
import relations from '../../mixins/relations';

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
    switch (this.getCRMClassBySystemClass(this.item.features[0].systemClass)) {
      case 'E21':
      case 'E74':
        this.mapOptions = {
          ...this.mapOptions,
          currentActor: this.$route.params.id
        };
        break;
      case 'E18':
        this.mapOptions = {
          ...this.mapOptions,
          currentPlace: parseInt(this.item?.features[0].relations.find(r => r.relationSystemClass === 'object_location')
            ?.relationTo
            .split('/')
            .pop(), 10)
        };
        break;
      case 'E53':
        this.mapOptions = {
          ...this.mapOptions,
          currentPlace: parseInt(this.$route.params.id, 10)
        };
        break;
      case 'E7':
      case 'E8':
      case 'E9':
      case 'E12':
        this.mapOptions = {
          ...this.mapOptions,
          currentEvent: this.$route.params.id
        };
        break;
    }
    if (this.item.features[0]?.systemClass === 'object_location') {
      this.related = [this.item];
    } else {
      this.related = await this.fetchRelated(this.item.features[0]?.relations, 'object_location');
    }

    this.loading = false;
  },
  mixins: [relations],
  data() {
    return {
      item: {},
      related: [],
      expanded: [],
      loading: false,
      isClamped: true,
      destinationOf: [],
      originOf: [],
      panel: [],
      ghostLetters: [],
      mapOptions: { caseStudies: [] }
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
      'getDefaultAuthor',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
      'hasTime',
      'hasSex',
    ]),
    ...mapGetters('data', ['getEvents']),

    subtitle() {
      return this.item.features[0]?.types?.find(x => x.hierarchy.startsWith('Source'))?.label;
    },
    relationTypes() {
      // eslint-disable-next-line max-len
      if (Array.isArray(this.item.features[0]?.relations)) return [...new Set(this.item.features[0]?.relations?.map((item) => item.relationType))];
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
      if (Array.isArray(this.item.features[0]?.relations)) {
        if (this.item.features[0]?.relations?.filter((r) => r.label === 'Male').length > 0) return 'Male';
        if (this.item.features[0]?.relations?.filter((r) => r.label === 'Female').length > 0) return 'Female';
      }
      return 'n/a';
    },
    begin() {
      return (this.item.features[0]?.when?.timespans?.[0]?.start?.earliest ||
        this.item.features[0]?.when?.timespans?.[0]?.start?.latest)?.split('T')?.[0];
      ;
    },
    end() {
      return (this.item.features[0]?.when?.timespans?.[0]?.end?.earliest ||
        this.item.features[0]?.when?.timespans?.[0]?.end?.latest)?.split('T')?.[0];
      ;
    },
    destinationEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P26i was destination of'))
        .map(x => ({ ...x,
          id: x.relationTo.split('/')
            .pop(),
        }));
    },
    originEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P27i was origin of'))
        .map(x => ({ ...x,
          id: x.relationTo.split('/')
            .pop(),
        }));
    },
    citation() {
      const id = this.item.features[0]['@id'].split('/')
        .pop();

      const author = this.item.features[0]?.types?.find(x => x.hierarchy === 'Entry author')?.label || this.getDefaultAuthor || '';
      const caseStudy = this.caseStudies?.map(x => x.label)
        .join(',') || '';
      return `${author}, ${this.item.features[0]?.properties.title} - ${caseStudy}, CONNEC, ID: ${id} - ${location.href} ${new Date().toLocaleDateString()}`;
    },
    relations() {

      return this.item.features?.[0]?.relations?.reduce((dict, x) => {
        const id = x.relationTo.split('/')
          .pop();
        const relation = x.relationType.split(' ')
          .slice(1)
          .join(' ');
        if (relation === 'has type' || relation === 'participated in') return dict;

        let key = relation;
        if (relation === 'is referred to by' && x?.relationSystemClass === 'reference_system') key = 'mentioned elsewhere';
        if (relation === 'is referred to by' && x?.relationSystemClass === 'bibliography') key = 'references';
        dict[key] = [...(dict[key] || []), {
          ...x,
          id,
          relation,
          externalLink: this.item.features?.[0]?.links?.find(l => l?.referenceSystem === x?.label)?.identifier
        }];
        return dict;
      }, {});

    },
    referredToBy() {
      return this.item.features[0]?.relations?.filter(x => x.relationType.startsWith('crm:P67i'));
    },
    participatedIn() {
      return this.item.features[0]?.relations?.filter(x => x.relationType.startsWith('crm:P11i'))
        .map(x => ({ ...x,
          id: x.relationTo.split('/')
            .pop(),
        }));
    },
    caseStudies() {
      return this.item.features[0]?.types?.filter(x => x.hierarchy === 'Case study');
    },
  },
  watch: {
    '$route.params': {
      handler() {
        this.$fetch();
      },
      immediate: true,
      deep: true,
    },
    relations: {
      handler() {
        this.panel = Object.values(this.relations)
          .flatMap((x, index) => x.length <= 5 ? [index] : []);
      },
      deep: true,
    },
    ghostLetters: {
      handler() {
        if (this.ghostLetters?.length !== 0 && this.ghostLetters?.length <= 5) {
          this.panel.push(Object.values(this.relations).length);
        }
      },
      deep: true,
    },
    item: {
      async handler() {
        this.ghostLetters = await this.getGhostLetters(this.item);
      },
      deep: true,
    }
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

.v-expansion-panel-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
  -webkit-transition: background-color 100ms ease-in-out;
  -ms-transition: background-color 100ms ease-in-out;
  transition: background-color 100ms ease-in-out;

}
</style>
