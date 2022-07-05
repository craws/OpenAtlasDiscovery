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
import { createGraph } from '../utils/Network';
import { loadAllFromCidocClass } from '../plugins/api';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ActorNetwork',
  props: {
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
      persons: [],
      relationType: 'crm:OA7 has relationship to',

    };
  },
  async mounted() {
    await this.loadPersons();
    this.$nextTick(() => {

      this.generateNetwork();

    });
  },
  watch: {
    networkData(){
      this.generateNetwork();

    }
  },
  computed: {
    ...mapGetters('network', ['getPersonsLoaded', 'getPersons']),
    networkData() {
      const relationType = 'crm:OA7 has relationship to';
      let filteredPersons = Object.values(this.getPersons ||{});
      if(this.currentActor)
        filteredPersons = filteredPersons.filter(p => p.id === this.currentActor || p.relations?.some(r => r.relationTo.split('/').pop() === this.currentActor))

      let links = filteredPersons.filter(p => !!p.id)
        .flatMap(p => p?.relations
          ?.filter(r => r.relationType === this.relationType)
          .map(r => ({
            source: p.id,
            target: r?.relationTo?.split('/')
              .pop(),
            relation: r,
            caseStudies: p?.types?.filter(t => t.hierarchy === 'Case study').map(t => parseInt(t.identifier.split('/').pop(),10))
          })))
        .filter(x => !!x && filteredPersons.some(fp => fp.id === x.target) && filteredPersons.some(fp => fp.id === x.source));

      if(this.filterCaseStudies?.length !== 0)
        links = links.filter(e => e?.caseStudies?.some(cs => this.filterCaseStudies?.includes(cs)));

      // just connections to current Actor
      //if(this.currentActor)
      //  links = links.filter(e => e.target === this.currentActor || e.source === this.currentActor);

      if ( this.relationTypes?.length !== 0)
        links = links.filter(e => this.relationTypes.includes(e.relation.type))

      const personsWithEdges = filteredPersons.filter( p => links.some(e => e?.source === p.id || e?.target === p.id))

      const nodes = personsWithEdges.map(x => {
        return {
          id: x.id,
          name: x?.properties?.title,
          color: '#34B522',
          r: this.currentActor === x.id ? 25 : 12,
          stroke: this.currentActor === x.id ? 'black' : 'transparent',
          x: 0,
          y: 0,
          fx: 0,
          fy: 0
        };
      });

      return {nodes,links};
      },
  },
  methods: {
    ...mapMutations('network', ['SET_PERSONS_LOADED', 'SET_PERSONS']),
    ...mapActions('network', ['loadPersons']),
    async loadPersons() {
      if (this.getPersonsLoaded) {
        this.persons = this.getPersons;
      } else {
        const localItems = await loadAllFromCidocClass('actor', ['relations', 'types'], 100, ['OA7']);
        const persons = localItems.map(x => ({
          ...x.features[0],
          id: x.features[0]['@id'].split('/')
            .pop()
        }));

        this.SET_PERSONS_LOADED(true);
        this.persons = persons;

        this.SET_PERSONS(persons);
      }
    },
    generateNetwork() {

      const onCircleClick = (d) => {
        this.$router.push({
          path:`/single/${d}`,
          hash:"#actor-network"
      });
      };
      console.log('gräphle',this.networkData)
      createGraph(this.networkData || {nodes:[],links:[]}, 0.4, 500, '100%', this.height, onCircleClick);
    }
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

line {
  stroke: #ccc;
}

circle{
  cursor: pointer;
}
</style>
