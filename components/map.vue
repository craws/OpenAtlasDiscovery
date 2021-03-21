<template>
  <client-only>
    <div class="mapcontainer">
      <l-map ref="map" :zoom="13" :center="center" :options="options">
        <l-tile-layer :url="url" />
        <l-feature-group ref="features">
          <l-geo-json
            v-for="item in geojsonitems"
            :key="item.features[0]['@id']"
            :geojson="item"
          />
        </l-feature-group>
      </l-map>
    </div>
  </client-only>
</template>

<script>

export default {
  props: {
    options: {
      type: Object,
      default: () => {},
    },
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
  watch: {
    geojsonitems: {
      handler() { this.setBounds(); },
      deep: true,
      immediate: true,
    },
  },
  beforeDestroy() {
    this.$nextTick(() => {
      // this.$refs.map.mapObject.remove();
    });
  },
  methods: {
    setBounds() {
      this.$nextTick(() => {
        if (this.$refs.features) {
          const bounds = this.$refs.features.mapObject.getBounds();
          // eslint-disable-next-line no-underscore-dangle
          if (bounds._northEast) this.$refs.map.mapObject.fitBounds(bounds);
        }
      });
    },
  },
};
</script>

<style>
.mapcontainer {
  width: 100%;
  height: 100%;
}

 #vizTreeV circle {
   fill: #fff;
   stroke: #54a8ff;
   stroke-width: 3px;
 }
#vizTreeV .node text {
  font: 12px sans-serif;
}
#vizTreeV .link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

</style>
