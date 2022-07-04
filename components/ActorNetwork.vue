<template>
  <client-only>
    <div>
      <svg width="100%" height="900">
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
    filterCaseStudies: {
      type: Array,
      default: () => [633, 6934, 8184, 938, false, 12953, false, 13088, 13087, false, 13246, false]
    },
    currentActor: {
      type: Number,
      default: () => undefined
    },
  },
  data() {
    return {
      persons: [],
    }
  },
  async mounted() {
    await this.loadPersons();
    this.$nextTick(() => {
      const data = {
        nodes: this.nodes,
        links: this.edges,
      };
      createGraph(data, 0.4, 500, "100%", "900px");

    });
  },
  watch: {
    nodes() {
      console.log('new nodes', this.nodes,this.edges)
      createGraph({
        nodes: this.nodes,
        links: this.edges,
      }, 0.4, 500, "100%", "900px");

    },
    edges() {
      createGraph({
        nodes: this.nodes,
        links: this.edges,
      }, 0.4, 500, "100%", "900px");
    }
  },
  computed: {
    ...mapGetters('network', ['getPersonsLoaded', 'getPersons']),
    filteredPersons() {
      console.log('hier fehelr', this.persons)
      let ps = Object.values(this.persons || {});
      //casestudies
      if (this.filterCaseStudies?.length !== 0) {
        ps = ps.filter(p => this.filterCaseStudies?.includes(parseInt(p?.types?.find(t => t.hierarchy === 'Case study')
          ?.identifier
          .split('/')
          .pop(), 10)));
      }
      return ps;
    },
    nodes() {
      const personsWithEdges = this.filteredPersons.filter(x => !!x.id && x?.relations?.some(r => r.relationType === 'crm:OA7 has relationship to'));
      return personsWithEdges.map(x => {
        const caseStudie = parseInt(x?.types?.find(t => t.hierarchy === 'Case study')
          ?.identifier
          .split('/')
          .pop(), 10);
        const group = this.getCaseStudies?.find(x => x.id === caseStudie || x.subs.includes(caseStudie))?.id;
        return {
          id: x.id,
          name: x?.properties?.title,
          group: group?.toString(),
          color: '#34B522',
          x: 0, y: 0, fx: 0, fy: 0
        };
      });
    },
    edges() {
      const e = this.filteredPersons.filter(x => !!x.id)
        .flatMap(p => p?.relations
          ?.filter(r => r.relationType === 'crm:OA7 has relationship to')
          .map(r => ({
            source: p.id,
            target: r?.relationTo?.split('/')
              .pop(),
          })));
      return e.filter(x => !!x)
        .filter(x => this.filteredPersons.map(x => x.id)
          .includes(x.target));
    }
  },
  methods: {
    ...mapMutations('network', ['SET_PERSONS_LOADED', 'SET_PERSONS']),
    ...mapActions('network', ['loadPersons']),
    async loadPersons() {
      if (this.getPersonsLoaded) {
        console.log('alreadyLoaded', this.getPersons)
        this.persons = this.getPersons;
      } else {
        console.log('ntoLoadeded', this.getPersons)

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
    }
  }
}
  ;
</script>

<style >
g {
  transition: all ease-in 100ms;
}

line {
  stroke: #ccc;
}
</style>
