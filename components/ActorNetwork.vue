<template>
  <client-only>
    <div>
      <svg id="actor-network" width="100%" :style="`--map-height:${height}`">
        <g class="links"></g>
        <g class="nodes"></g>
      </svg>
    </div>
  </client-only>
</template>

<script>
import { NetworkSimulator } from '../utils/Network';
import { loadAllFromCidocClass } from '../plugins/api';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ActorNetwork',
  props: {
    translateX: {
      type: String,
      default: () => '0'
    },
    translateY: {
      type: String,
      default: () => '0'
    },
    scale: {
      type: String,
      default: () => '1'
    },
    height: {
      type: String,
      default: () => '500px'
    },
    filterCaseStudies: {
      type: Array,
      default: () => [633, 6934, 14057, 8184, 938, 9362, 12953, 14058, 13088, 13064, 13246, 13087]
    },
    relationTypes: {
      type: Array,
      default: () => []
    },
    currentActor: {
      type: String,
      default: () => undefined
    },
  },
  data() {
    return {
      persons: {},
      relationType: 'crm:OA7 has relationship to',
      simulator: undefined,

    };
  },
  async mounted() {
    console.log('mounted');
    console.time('loadP');
    await this.loadPersons();
    console.timeEnd('loadP');

    this.$nextTick(() => {
      const onCircleClick = (d) => {
        this.$router.push({
          path: `/single/${d}`,
          hash: '#actor-network'
        });
      };
      console.log('create Simuator');
      this.simulator = new NetworkSimulator(0.4, 500, '100%', this.height, onCircleClick, this.scale, this.translateX,this.translateY);
      this.simulator?.createGraph(this.networkData || {
        nodes: [],
        links: []
      });

    });
  },
  watch: {
    networkData() {
      this.generateNetwork();

    }
  },
  computed: {
    ...mapGetters('network', ['getPersonsLoaded', 'getPersons']),
    networkData() {
      let filteredPersons = {};
      let links = []
      Object.entries(this.getPersons)
        .forEach(entry => {
          const [id, person] = entry;
          const caseStudies = person?.types?.filter(t => t.hierarchy === 'Case study')
            .map(t => parseInt(t.identifier.split('/')
              .pop(), 10));

          const nodeData = {
            id: id,
            name: person.properties?.title,
            color: '#34B522',
            r: this.currentActor === id ? 25 : 12,
            stroke: this.currentActor === id ? 'black' : 'transparent',
            x: 0,
            y: 0,
            fx: 0,
            fy: 0,
            data: person,
          };

          if (this.currentActor && id === this.currentActor)
            filteredPersons[id] = nodeData;

          if (this.currentActor && id !== this.currentActor && !person?.relations?.some(r => r.relationTo.split('/')
            .pop() === this.currentActor)) {
            return;
          }

          if (this.filterCaseStudies?.length !== 0 && !caseStudies?.some(cs => this.filterCaseStudies?.includes(cs)))
            return;


          if (person.relations?.length === 0 || this.relationTypes?.length !== 0 && !person.relations.some(r => this.relationTypes.includes(r.type)))
            return;

          if (this.currentActor && this.relationTypes?.length !== 0 && !person.relations.some(r => this.relationTypes.includes(r.type) && r.relationTo.split('/').pop() === this.currentActor))
            return;


          filteredPersons[id] = nodeData;

        });

      Object.entries(filteredPersons)
        .forEach(entry => {
          const [id, node] = entry;
          const person = node.data;
          const caseStudies = person?.types?.filter(t => t.hierarchy === 'Case study')
            .map(t => parseInt(t.identifier.split('/')
              .pop(), 10));

          person.relations?.forEach(relation => {
            const to = relation?.relationTo?.split('/')
              .pop()

            if (this.relationTypes?.length !== 0 && !this.relationTypes.includes(relation.type))
              return;

            if (!filteredPersons[to]) return;

            links.push({
              source: id,
              target: to,
              type: relation.type,
              caseStudies
            })
          });


        });


      return {
        nodes: Object.values(filteredPersons),
        links
      };
    },
  },
  methods: {
    ...mapMutations('network', ['SET_PERSONS_LOADED', 'SET_PERSONS']),
    ...mapActions('network', ['loadPersons']),
    async loadPersons() {
      if (this.getPersonsLoaded) {
        console.log('loadPersonsenNot');

        this.persons = this.getPersons;
      } else {
        console.log('loadPersons');

        const localItems = await loadAllFromCidocClass('actor', ['relations', 'types'], 100, ['OA7']);
        const persons = localItems.reduce((acc, curr) => ({
          ...acc,
          [curr.features[0]['@id'].split('/')
            .pop()]: curr.features[0],
        }), {});

        this.SET_PERSONS_LOADED(true);
        this.persons = persons;

        this.SET_PERSONS(persons);
      }
    },
    generateNetwork() {

      console.log('gräphle', this.networkData);
      this.simulator?.createGraph(this.networkData || {
        nodes: [],
        links: []
      });
    }
  },
  destroyed() {
    console.log('DOSTROYED!');
    this.simulator?.stopSimulation();
  }
}
  ;
</script>

<style>
g {
  transition: all ease-in 100ms;
}

#actor-network {
  height: var(--map-height);
}



circle {
  cursor: pointer;
}
</style>
