<template>
  <client-only>
    <div id="mapcontainer" ref="mapElement"></div>
  </client-only>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { mapGetters } from 'vuex';
import L from 'leaflet';
import '@elfalem/leaflet-curve';

export default {
  props: {
    animate: {
      type: Boolean,
      default: () => false,
    },
    events: {
      type: Object,
      default: () => {
      },
    },
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
      default: () => [{
        from: '3482',
        to: '5437'
      }],
    },
    persons: {
      type: Object,
      default: () => {
      },
    },
    filter: {
      type: Object,
      default: () => ({
        from: undefined,
        to: undefined,
        caseStudies: [],
        eventTypes: [],
        sender: {
          sex: undefined,
          id: undefined
        },
        bearer: {
          sex: undefined,
          id: undefined
        },
        recipient: {
          sex: undefined,
          id: undefined
        }
      }),
    }
  },
  data() {
    return {
      map: null,
      myCircleStyle: {
        'color': '#000000',
        'weight': 1,
        'fillOpacity': 0.8,
        'fillColor': '#007bd9',
        'radius': 10,

      },
      pointLayer: null,
      lineLayer: [],
      lineLayers: {},

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.map = L.map(this.$refs['mapElement'])
        .setView([45, 11], 5);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
        .addTo(this.map);

      this.fillMap();

    });
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  computed: {
    ...mapGetters('data', ['getGeoItems', 'getCaseStudies', 'getCaseStudyColor', 'getEventToPerson']),
    locations() {
      return Object.values(this.getGeoItems);
    }
  },
  watch: {
    animate() {
      this.fillMap();
    },
    events: {
      handler() {
        this.fillMap();

      },

      deep: true,
      immediate: true
    },
    filter: {
      handler() {
        this.applyFilter();
      },
      deep: true,
      immediate: true,
    },
    locations: {
      handler() {

      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    applyFilter() {
      let places = [];

      Object.values(this.lineLayers)
        .forEach((layer) => {
          this.map?.removeLayer(layer);
        });

      Object.values(this.events)
        .forEach(e => {
            if (!this.lineLayers[e.id]) return;
            let show = true;
            //casestudies
            const typeId = e.types?.find(y => y.hierarchy?.toLowerCase()
              .startsWith('case study'))
              ?.identifier
              .split('/')
              .pop();
            show = show && this.filter.caseStudies.includes(parseInt(typeId, 10));

            //time
            show = show && (!this.filter.from || new Date(e.when.timespans[0].start.earliest) >= new Date(this.filter.from))
              && (!this.filter.to || new Date(e.when.timespans[0].end.earliest) <= new Date(this.filter.to));

            //event types
            show = show && (this.filter.eventTypes.length === 0 || this.filter.eventTypes.some(x => e.types.find(x => x.hierarchy === 'Event')
              ?.identifier
              .split('/')
              .pop() === x.toString()));


            const senderId = this.events[e.id]?.['Sender']?.id;
            const bearerId = this.events[e.id]?.['Bearer']?.id;
            const recipientId = this.events[e.id]?.['Recipient']?.id;

            //sex
            show = show && (!this.filter.sender.sex || this.persons[senderId]?.sex === this.filter.sender.sex);
            show = show && (!this.filter.bearer.sex || this.persons[bearerId]?.sex === this.filter.bearer.sex);
            show = show && (!this.filter.recipient.sex || this.persons[recipientId]?.sex === this.filter.recipient.sex);
            //actor
            show = show && (!!this.filter.sender.sex || !this.filter.sender.id || senderId === this.filter.sender.id);
            show = show && (!!this.filter.bearer.sex || !this.filter.bearer.id || bearerId === this.filter.bearer.id);
            show = show && (!!this.filter.recipient.sex || !this.filter.recipient.id || recipientId === this.filter.recipient.id);

            if (show) {
              this.map?.addLayer(this.lineLayers[e.id]);
              places = [...places, e.toPlace, e.fromPlace];
            }
          }
        );
      places = [...new Set(places)];
      this.map?.removeLayer(this.pointLayer);
      this.addPlacesToMap(places);

    },
    addPlacesToMap(placeIds) {
      const routeToPage = (id) => {
        this.$router.push(`/single/${id}`);
      };
      const popup = (f, l) => {
        let myPopup = L.DomUtil.create('div', 'infoWindow');
        myPopup.innerHTML = `<p>${f.properties.name}</p><input id="detailButton" type="button" value="Details">`;
        myPopup.lastChild.addEventListener('click', () => routeToPage(f.properties.id), false);
        l.bindPopup(myPopup);
      };
      const places = placeIds.map(x => this.getGeoItems[x])
        .filter(Boolean);
      this.pointLayer = new L.GeoJSON(places, {
        filter: (feature) => feature?.geometry?.type === 'Point',
        onEachFeature: (f, l) => popup(f, l),
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            'color': '#000000',
            'weight': 1,
            'fillOpacity': 0.3,
            'fillColor': '#00c7d9',
            'radius': 5,

          });
        }
      });
      this.polyLayer = new L.GeoJSON(places, {
        filter: (feature) => feature?.geometry?.type !== 'Point',
        onEachFeature: (f, l) => popup(f, l),
      });
      this.map?.addLayer(this.polyLayer);

      this.map?.addLayer(this.pointLayer);

    },
    fillMap() {
      Object.values(this.lineLayers)
        .forEach((layer) => {
          this.map.removeLayer(layer);
        });
      this.lineLayers = {};

      let places = [];
      Object.values(this.events)
        .forEach(element => {
          const toPlace = this.getGeoItems[element.toPlace];
          const fromPlace = this.getGeoItems[element.fromPlace];
          if (toPlace && fromPlace) {
            places = [...places, element.toPlace, element.fromPlace];

            const caseStudy = element?.types?.find(x => x.hierarchy === 'Case study')
              ?.identifier
              .split('/')
              .pop();
            const getLatLng = (place) => {
              if (place.geometry.type === 'Point') return [...toPlace.geometry.coordinates].reverse();
              const {
                lat,
                lng
              } = new L.GeoJSON(place).getBounds()
                .getCenter();
              return [lat, lng];
            };
            const toLatLng = getLatLng(toPlace);
            const fromLatLng = fromPlace.geometry.type === 'Point' ? [...fromPlace.geometry.coordinates].reverse() : [0, 0];
            const {
              midPointLatLng,
              animationDuration
            } = this.calculateMidLatLng(fromLatLng, toLatLng);
            const animate = {
              duration: animationDuration,
              iterations: Infinity,
              easing: 'ease-in-out',
            };
            const curvedPath = L.curve(
              [
                'M', fromLatLng,
                'Q', midPointLatLng,
                toLatLng
              ], {
                color: this.getCaseStudyColor(parseInt(caseStudy, 10)) || 'rgba(255,255,255,0.5)',
                weight: 4,
                animate: this.animate && animate

              });
            this.map?.addLayer(curvedPath);

            this.lineLayers[element.id] = curvedPath;

          }
        });
      places = [...new Set(places)];
      this.map?.removeLayer(this.pointLayer);
      this.addPlacesToMap(places);
      this.applyFilter();

    },
    calculateMidLatLng(latlng1, latlng2) {
      const offsetX = latlng2[1] - latlng1[1],
        offsetY = latlng2[0] - latlng1[0];

      const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
        theta = Math.atan2(offsetY, offsetX);

      const thetaOffset = (3.14 / 10);

      const r2 = (r / 2) / (Math.cos(thetaOffset)),
        theta2 = theta + thetaOffset;

      const midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
        midpointY = (r2 * Math.sin(theta2)) + latlng1[0];
      return {
        midPointLatLng: [midpointY, midpointX],
        animationDuration: Math.sqrt(Math.abs(Math.log(r))) * 2000
      };

    }
  }
};
</script>

<style>
#mapcontainer {
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
