<template>
  <v-container class="bgmap">
    <v-row
      no-gutters
      style="height: 80%"
    >
      <v-col
        cols="12"
        sm="6"
        md="8"
      >
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <qmap v-if="!loading" :geojsonitems="getGeoItemsAsFeatureCollection" :options="{ zoomControl: false }" />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="fill-height pa-2"
          tile
          outlined
        >
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h2">
                {{ items.length }} entities on map
              </v-list-item-title>
              <v-list-item-subtitle />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      style="height: 20%"
    >
      <v-col
        cols="12"
      >
        <HistogramSlider
          v-if="!loading"
          :bar-height="150"
          :width="width"
          :data="slideritems"
          :prettify="prettify"
          :drag-interval="true"
          :force-edges="false"
          :colors="['#0D47A1', '#0D47A1']"
          :min="new Date(300, 1, 1).valueOf()"
          :max="new Date(700, 12, 31).valueOf()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HistogramSlider from 'vue-histogram-slider';
import 'vue-histogram-slider/dist/histogram-slider.css';

import { mapGetters } from 'vuex';
import qmap from '~/components/map.vue';
import queries from '~/mixins/queries';

export default {
  components: {
    qmap,
    HistogramSlider,
  },
  mixins: [queries],
  data() {
    return {
      items: [],
      geoitems: [],
      loading: true,
      prettify(ts) {
        return new Date(ts).toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
      width: window.innerWidth,
    };
  },
  computed: {
    ...mapGetters('app', [
      'getTempItemsAsTimeStamps',
      'getGeoItemsAsFeatureCollection',
    ]),
    slideritems() {
      return this.getTempItemsAsTimeStamps
        .map((d) => new Date(d));
    },
  },
  watch: {
  },
  async fetch() {
    const p = await this.$api.Entities.get_api_0_2_code__code_({
      limit: 2000,
      code: 'event',
      show: 'when',
    });
    this.items = p.body.results;
    console.log(this.getGeoItems);
    this.loading = false;
  },
  methods: {
  },
};
</script>
