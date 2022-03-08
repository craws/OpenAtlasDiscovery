<template>
  <client-only>
    <div class="mapcontainer">
      <l-map ref="map" :zoom="13" :center="center" :options="options">
        <l-tile-layer :url="url" />
        <l-feature-group ref="features">
          <l-marker
            v-for="item in pointsFromGeoJSON"
            :key="item.features[0]['@id']"
            :lat-lng="item.features[0].geometry.coordinates.slice().reverse()"
          />
          <l-popup
            v-for="item in pointsFromGeoJSON"
            :key="item.features[0]['@id']"
          >
            {{ item.features[0].geometry.title }}
          </l-popup>
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
      default: () => {
      },
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
  computed: {
    pointsFromGeoJSON() {
      return this.geojsonitems.filter((f) => {
        if (f.features[0].geometry && f.features[0].geometry.type === 'Point') return true;
        return false;
      });
    },
  },
  watch: {
    geojsonitems: {
      handler() {
        this.delayedHandler();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    delayedHandler() {
      this.$nextTick(() => {
        if (this.$refs.features) {
          this.setBounds();
        }
      });
    },
    setBounds() {
      const bounds = this.$refs.features.mapObject.getBounds();
      // eslint-disable-next-line no-underscore-dangle
      if (bounds._northEast) this.$refs.map.mapObject.fitBounds(bounds);
    },
    reverseCoordinates(c) {
      return c.reverse();
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
