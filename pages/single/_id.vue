<template>
  <div>
    <v-layout v-if="!loading" class="ma-1">
      <v-row no-gutters>
        <v-col xs="6">
          <v-row no-gutters class="pr-1">
            <v-col cols="12" xs="12">
              <v-card
                class="pa-4"
                outlined
                tile
              >
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
                        {{ getIconBySystemClass(item.features[0].system_class) }}
                      </v-icon>
                    </template>
                    <span>
                      {{ getCRMClassBySystemClass(item.features[0].system_class) }}
                      -
                      {{ getLabelBySystemClass({c: item.features[0].system_class, l: 'en'}) }}
                    </span>
                  </v-tooltip>
                  <div class="text-h5">
                    {{ item.features[0].properties.title }}
                  </div>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" xs="12" v-if="item.features[0].description">
              <v-card
                class="pa-4"
                outlined
                tile
              >
                <v-row align="center" class="pl-4 pb-4" >
                  <v-icon class="pr-2">mdi-comment</v-icon>
                  <div class="text-overline">Description</div>
                </v-row>
                <div class="text-body-2">
                  {{
                    item.features[0].description[0].value
                  }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" xs="12">
              <v-card
                class="pa-4"
                outlined
                tile
              >
                <v-row align="center" class="pl-4" >
                  <v-icon class="pr-2">mdi-comment</v-icon>
                  <div class="text-overline">Relations</div>
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
                        <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                          <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                          <v-icon v-else>mdi-chevron-down</v-icon>
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
        <v-col xs="6" >
          <div style="height: calc(100vh - 72px)">
            <qmap v-if="!this.loading" :geojsonitems="geojsonitems"/>
          </div>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import qmap from '~/components/map.vue';

export default {
  components: {
    qmap,
  },
  async fetch() {
    this.loading = true;
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_2_entity__id__({
      id_: this.$route.params.id,
    });
    // eslint-disable-next-line prefer-destructuring
    this.item = p.body;
    // await this.fetchRelated();
    this.loading = false;
  },
  data() {
    return {
      item: {},
      related: [],
      expanded: [],
      loading: false,
    };
  },
  methods: {
    async fetchRelated() {
      // eslint-disable-next-line no-restricted-syntax
      for (const id of this.item.features[0].relations) {
        // eslint-disable-next-line no-await-in-loop,no-underscore-dangle
        const ri = await this.$api.Entities.get_api_0_2_entity__id__({
          id_: id.relationTo.split('/').splice(-1, 1),
        });
        this.related.push(ri.body);
      }
    },
    closeAll() {
      Object.keys(this.$refs).forEach((k) => {
        if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
          this.$refs[k].$el.click()
        }
      })
    },
    openAll() {
      Object.keys(this.$refs).forEach((k) => {
        if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
          this.$refs[k].$el.click()
        }
      })
    }
  },
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
    ]),
    geojsonitems() {
      return [this.item, ...this.related];
    },
    relationTypes() {
      if (Array.isArray(this.item.features[0].relations)) return [...new Set(this.item.features[0].relations.map((item) => item.relationType))];
      return [];
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
