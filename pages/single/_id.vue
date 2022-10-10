<template>
  <div>
    <v-layout v-if="!loading" class="ma-1">
      <v-row no-gutters>
        <v-col xs="6">
          <v-row no-gutters>
            <v-col cols="12" xs="12">
              <v-card
                class="pa-4"
                outlined
                tile
              >
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
                      {{ getLabelBySystemClass({c: item.features[0].systemClass, l: 'en'}) }}
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
                          item.features[0].when.timespans[0].start.earliest ? item.features[0].when.timespans[0].start.earliest : item.features[0].when.timespans[0].start.latest
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
                          item.features[0].when.timespans[0].end.latest ? item.features[0].when.timespans[0].end.latest : item.features[0].when.timespans[0].end.earliest
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
              </v-card>
            </v-col>
            <v-col cols="12" xs="12">
              <v-card
                class="pa-4"
                outlined
                tile
              >
                <v-row align="center" class="pl-4">
                  <v-icon class="pr-2">
                    mdi-comment
                  </v-icon>
                  <div class="text-overline">
                    Relations
                  </div>
                </v-row>
                <v-row class="pl-4">
                  <v-data-table
                    :headers="$store.state.app.tableheaders.relations"
                    :items="item.features[0].relations"
                    :expanded.sync="expanded"
                    item-key="label"
                    group-by="relationType"
                    :items-per-page="-1"
                    class="elevation-0"
                    style="width:100%"
                  >
                    <template v-slot:group.header="{ group, headers, toggle, isOpen }">
                      <td :colspan="headers.length">
                        <v-btn :ref="group" small icon :data-open="isOpen" @click="toggle">
                          <v-icon v-if="isOpen">
                            mdi-chevron-up
                          </v-icon>
                          <v-icon v-else>
                            mdi-chevron-down
                          </v-icon>
                        </v-btn>
                        {{ group }}
                      </td>
                    </template>
                    <template v-slot:item.label="{ item }">
                      <nuxt-link :to="`/single/${item.relationTo.split('/').splice(-1)[0]}`">
                        {{ item.label }}
                      </nuxt-link>
                    </template>
                  </v-data-table>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs="6">
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
                <qmap v-if="!this.loading" :geojsonitems="[item].concat(related)" style="height: calc(100vh - 154px)" />
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
    await this.fetchRelated('object_location');
    this.loading = false;
  },
  data() {
    return {
      item: {},
      related: [],
      expanded: [],
      loading: false,
      isClamped: true,
    };
  },
  methods: {
    async fetchRelated(type) {
      // eslint-disable-next-line no-restricted-syntax,max-len
      for (const id of this.item.features[0].relations.filter((r) => r.relationSystemClass === type)) {
        // eslint-disable-next-line no-await-in-loop,no-underscore-dangle
        const ri = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: id.relationTo.split('/').splice(-1, 1),
        });
        this.related.push(ri.body);
      }
    },
    closeAll() {
      Object.keys(this.$refs).forEach((k) => {
        if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
          this.$refs[k].$el.click();
        }
      });
    },
    openAll() {
      Object.keys(this.$refs).forEach((k) => {
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
    relationTypes() {
      // eslint-disable-next-line max-len
      if (Array.isArray(this.item.features[0].relations)) return [...new Set(this.item.features[0].relations.map((item) => item.relationType))];
      return [];
    },
    genderFromClass() {
      if (Array.isArray(this.item.features[0].relations)) {
        if (this.item.features[0].relations.filter((r) => r.label === 'Male').length > 0) return 'Male';
        if (this.item.features[0].relations.filter((r) => r.label === 'Female').length > 0) return 'Female';
      }
      return 'n/a';
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
