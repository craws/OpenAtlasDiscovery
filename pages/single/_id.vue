<template>
  <div>
    <v-layout v-if="!loading" class="mt-3">
      <v-row>
        <v-col
          xs="6"
        >
          <v-row no-gutters wrap>
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
                        v-on="on"
                        style="font-size:75px"
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
                  <div class="text-h5">{{ item.features[0].properties.title }}</div>
                </v-row>
              </v-card>
            </v-col>
            <v-col
              xs="12"
            >
              <v-card
                class="pa-4"
                outlined
                tile
              >
                <div class="text-body-2" v-if="item.features[0].description">{{
                    item.features[0].description[0].value
                  }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          xs="6"
        >
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  components: {},
  data() {
    return {
      item: {},
      loading: false,
    };
  },
  async fetch() {
    this.loading = true;
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_2_entity__id__({
      id_: this.$route.params.id,
    });
    // eslint-disable-next-line prefer-destructuring
    this.item = p.body;
    this.loading = false;
  },
  watch: {
    '$route.params': {
      handler(s) {
        console.log(s.id);
        this.$fetch();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
    ]),
  },
};
</script>
