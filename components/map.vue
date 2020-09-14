<template>
  <no-ssr>
    <div class="mapcontainer">
      <l-map ref="map" :zoom="13" :center="center">
        <l-tile-layer :url="url" />
        <l-feature-group ref="features">
          <l-geo-json
            v-for="item in geojsonitems"
            :key="item.features[0]['@id']"
            :geojson="item"></l-geo-json>
        </l-feature-group>
      </l-map>
    </div>
  </no-ssr>
</template>

<script>

export default {
  props: {
    geojsonitems: {
      type: Array,
      default: () => [],
    },
    markeritems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      show: true,
      enableTooltip: true,
      zoom: 6,
      center: [48.2082, 16.3738],
      url: 'https://tile.jawg.io/jawg-light/{z}/{x}/{y}.png?access-token=TUhizWedCN04NDjuRQtXfgE0HSuYwHzro3NRUDa3LMUlLbymREaTyUW2lpuoNnMz',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
  methods: {
    setBounds() {
      this.$nextTick(() => {
        if (this.$refs.features) {
          const bounds = this.$refs.features.mapObject.getBounds();
          if (bounds._northEast) this.$refs.map.mapObject.fitBounds(bounds);
        }
      });
    },
  },
  watch: {
    geojsonitems: {
      handler() { this.setBounds(); },
      deep: true,
      immediate: true,
    },
  },
  beforeDestroy() {
    this.$nextTick(() => {
      //this.$refs.map.mapObject.remove();
    });
  },
};
</script>

<style>
.mapcontainer {
  width: 100%;
  height: 100%;
}
</style>
