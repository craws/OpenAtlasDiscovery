<template>
  <div>
    <v-overlay :value="!getPersonsLoaded" z-index="9999">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" sm="6" md="8">
        <v-card outlined class="full-height" tile>
          <network-graph :nodes="nodes" :edges="edges"></network-graph>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="full-height pa-2 overflow-auto" tile outlined>
          <filter-case-studies v-model="filterCaseStudies"></filter-case-studies>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'index',
  data() {
    return {
      filterCaseStudies:[ 633, 6934, 8184, 938, false, 12953, false, 13088, 13087, false, 13246, false ] ,
    }
  },
  computed: {
    ...mapGetters('data', ['getPersonsLoaded', 'getPersons','getCaseStudies']),
    filteredPersons(){
      let ps = this.getPersons;
      //casestudies
      if(this.filterCaseStudies?.length !== 0){

        ps = ps.filter(p => this.filterCaseStudies.includes(parseInt(p?.types?.find(t => t.hierarchy === 'Case study')?.identifier.split('/').pop(),10)));
      }
      return ps;
    },
    nodes() {
      const personsWithEdges =  this.filteredPersons.filter(x => !!x.id && x?.relations?.some(r => r.relationType === 'crm:OA7 has relationship to'));
      return personsWithEdges.map(x => {
        const caseStudie = parseInt(x?.types?.find(t => t.hierarchy === 'Case study')?.identifier.split('/').pop(),10);
        const group = this.getCaseStudies.find(x => x.id === caseStudie || x.subs.includes(caseStudie))?.id;

        return {
          ...x,
          label: x?.properties?.title,
          group: group?.toString()
        }
      });
    },
    edges() {
      const e = this.filteredPersons.filter(x => !!x.id).flatMap(p => p?.relations
        ?.filter(r => r.relationType === 'crm:OA7 has relationship to')
        .map(r => ({from: p.id, to:r?.relationTo?.split('/').pop(), })));
      return e.filter(x => !!x).filter(x => this.filteredPersons.map(x => x.id).includes(x.to));
    }
  },
  methods: {
    ...mapActions('data', ['loadPersons']),
  },
  mounted() {
    if (!this.getPersonsLoaded) {
      this.loadPersons();
    }
  }
};
</script>

<style scoped>
.full-height {
  height: calc(100vh - 64px);
}


</style>
