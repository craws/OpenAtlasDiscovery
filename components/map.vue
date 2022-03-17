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
import 'leaflet-textpath';

export default {
  props: {
    animate: {
      type: Boolean,
      default: () => false,
    },
    events: {
      type: Array,
      default: () => [],
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
      default: () => [],
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
      caseStudy: {
        '633': 'rgba(33,33,200,0.5)',
        '6934': 'rgba(33,33,200,0.5)',
        '8184': 'rgba(33,33,200,0.5)',
        '938': 'rgba(33,33,200,0.5)',
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
    ...mapGetters('data', ['getEvents', 'getGeoItems', 'getCaseStudies', 'getCaseStudyColor', 'getEventToPerson']),
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
        let places = [];

        Object.values(this.lineLayers)
          .forEach((layer) => {
            this.map?.removeLayer(layer);
          });

        this.events.forEach(e => {
            if (!this.lineLayers[e.id]) return;
            let show = true;
            //casestudies
            const typeIds = e.relations.filter(y => y.relationType === 'crm:P2 has type')
              .map(y => y.relationTo.split('/')
                .pop());
            show = show && this.filter.caseStudies.some(y => typeIds.includes(y));

            //time
            show = show && (!this.filter.from || new Date(e.when.timespans[0].start.earliest) >= new Date(this.filter.from))
              && (!this.filter.to || new Date(e.when.timespans[0].end.earliest) <= new Date(this.filter.to));

            //event types
            show = show && (this.filter.eventTypes.length == 0 || this.filter.eventTypes.some(x => e.types.find(x => x.hierarchy === 'Event')
              ?.identifier
              .split('/')
              .pop() === x.toString()));

            //sex
            show = show && (!this.filter.sender.sex || this.getEventToPerson[`Sender ${e.id}`]?.sex === this.filter.sender.sex);
            show = show && (!this.filter.bearer.sex || this.getEventToPerson[`Bearer ${e.id}`]?.sex === this.filter.bearer.sex);
            show = show && (!this.filter.recipient.sex || this.getEventToPerson[`Recipient ${e.id}`]?.sex === this.filter.recipient.sex);

            //actor
            show = show && (!!this.filter.sender.sex || !this.filter.sender.id || this.getEventToPerson[`Sender ${e.id}`]?.id === this.filter.sender.id);
            show = show && (!!this.filter.bearer.sex || !this.filter.bearer.id || this.getEventToPerson[`Bearer ${e.id}`]?.id === this.filter.bearer.id);
            show = show && (!!this.filter.recipient.sex || !this.filter.recipient.id || this.getEventToPerson[`Recipient ${e.id}`]?.id === this.filter.recipient.id);

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
    addPlacesToMap(placeIds) {
      const routeToPage = (id) => {
        console.log(id);
        this.$router.push(`/single/${id}`);
      };
      const places = placeIds.map(x => this.getGeoItems[x])
        .filter(Boolean);
      this.pointLayer = new L.GeoJSON(places, {
        onEachFeature: function (f, l) {
          let myPopup = L.DomUtil.create('div', 'infoWindow');
          myPopup.innerHTML = `<p>${f.properties.name}</p><input id="detailButton" type="button" value="Details">`;
          console.log(f);
          myPopup.lastChild.addEventListener('click', () => routeToPage(f.properties.objectId), false);
          l.bindPopup(myPopup);
        },
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
      this.map?.addLayer(this.pointLayer);

    },
    fillMap() {
      Object.values(this.lineLayers)
        .forEach((layer) => {
          this.map.removeLayer(layer);
        });
      this.lineLayers = {};

      let places = [];
      this.events.forEach(element => {
        const toPlace = this.getGeoItems[element.toPlace];
        const fromPlace = this.getGeoItems[element.fromPlace];
        if (toPlace && fromPlace) {
          places = [...places, element.toPlace, element.fromPlace];

          const caseStudy = element.types.find(x => x.hierarchy === 'Case study')
            ?.identifier
            .split('/')
            .pop();
          const toLatLng = toPlace.geometry.type === 'Point' ? [...toPlace.geometry.coordinates].reverse() : [0, 0];
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
              color: this.getCaseStudyColor(caseStudy) || 'rgba(255,255,255,0.5)',
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
