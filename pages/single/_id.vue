<template>
  <div>
    <v-layout v-if="!loading">
      <v-row no-gutters class="pa-1" style="height: calc(100vh - 64px); max-width: 100%">
        <v-col cols="12" sm="5" style="max-height: 100%">
          <v-card
            class="pa-4 overflow-auto"
            outlined
            tile
            max-width="100%"
            max-height="100%"
          >
            <v-card-text>
              <!-- icon and title -->
              <v-row align="center">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      v-bind="attrs"
                      style="font-size:75px"
                      v-on="on"
                    >
                      {{ getIconBySystemClass(item.features[0].systemClass) }}
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
                <div class="text-h5">
                  {{ item.features[0].properties.title }}
                </div>
              </v-row>
              <!-- begin, end and sex -->
              <v-row v-if="hasTime(item.features[0].systemClass)" class="pl-2">
                <v-col xs="4">
                  <v-row align="center">
                    <v-icon class="pr-2">
                      mdi-logout
                    </v-icon>
                    <div class="text-overline">
                      Begin / From
                    </div>
                    <div class="text-body-2 pl-2">
                      {{
                        item.features[0].when.timespans[0].start.earliest ?
                          item.features[0].when.timespans[0].start.earliest :
                          item.features[0].when.timespans[0].start.latest
                      }}
                    </div>
                  </v-row>
                </v-col>
                <v-col xs="4">
                  <v-row align="center">
                    <v-icon class="pr-2">
                      mdi-login
                    </v-icon>
                    <div class="text-overline">
                      End / To
                    </div>
                    <div class="text-body-2 pl-2">
                      {{
                        item.features[0].when.timespans[0].end.latest ?
                          item.features[0].when.timespans[0].end.latest :
                          item.features[0].when.timespans[0].end.earliest
                      }}
                    </div>
                  </v-row>
                </v-col>
                <v-col v-if="hasSex(item.features[0].systemClass)" xs="4">
                  <v-row align="center">
                    <v-icon class="pr-2">
                      mdi-sex
                    </v-icon>
                    <div class="text-overline">
                      Sex
                    </div>
                    <div class="text-body-2 pl-2">
                      {{ genderFromClass }}
                    </div>
                  </v-row>
                </v-col>
              </v-row>
              <!-- description -->
              <v-row class="pl-2">
                <div
                  v-if="item.features[0].description"
                  class="text-body-2 pt-2"
                  :class="{ lineclamp: isClamped }"
                  @click="isClamped = !isClamped"
                >
                  {{
                    item.features[0].description[0].value
                  }}
                </div>
                <v-col cols="12">
                  <v-list v-if="!!destinationEvents && destinationEvents.length !== 0">
                    <v-list-group
                      :value="false"
                    >
                      <template v-slot:activator>
                        <v-list-item-title>Destination of</v-list-item-title>
                      </template>
                      <v-virtual-scroll
                        :items="destinationEvents"
                        :bench="4"
                        height="250px"
                        item-height="50px"
                      >
                        <template v-slot:default="{item}">
                          <event-dialog :event="item" />
                        </template>
                      </v-virtual-scroll>
                    </v-list-group>
                  </v-list>
                  <v-list v-if="!!originEvents && originEvents.length !== 0">
                    <v-list-group
                      :value="false"
                    >
                      <template v-slot:activator>
                        <v-list-item-title>Origin of</v-list-item-title>
                      </template>
                      <v-virtual-scroll
                        :items="originEvents"
                        :bench="4"
                        height="250px"
                        item-height="60px"
                      >
                        <template v-slot:default="{item}">
                          <event-dialog :event="item" />
                        </template>
                      </v-virtual-scroll>
                    </v-list-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="">
          <v-card
            class="pa-4"
            outlined
            tile
          >
            <v-tabs right>
              <v-tab>Map</v-tab>
              <v-tab>Graph</v-tab>
              <v-tab>JSON</v-tab>
              <v-tab-item>
                <qmap :events="events" style="height: calc(100vh - 154px)" :animate="true" />
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

export default {
  components: {
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
    if (this.item.features[0].systemClass === 'object_location') this.related = [this.item];
    else this.related = await this.fetchRelated(this.item.features[0].relations, 'object_location');

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
      return this.getEvents.filter((e) => e.toPlace === parseInt(this.$route.params.id, 10)+1
        || e.fromPlace === parseInt(this.$route.params.id, 10)+1);
    },
    genderFromClass() {
      if (Array.isArray(this.item.features[0].relations)) {
        if (this.item.features[0].relations.filter((r) => r.label === 'Male').length > 0) return 'Male';
        if (this.item.features[0].relations.filter((r) => r.label === 'Female').length > 0) return 'Female';
      }
      return 'n/a';
    },
    destinationEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P26i was destination of' && y.relationSystemClass === 'move'));
    },
    originEvents() {
      return this.related.flatMap((x) => x?.features[0]?.relations
        ?.filter((y) => y.relationType === 'crm:P27i was origin of' && y.relationSystemClass === 'move'));
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
