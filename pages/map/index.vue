<template>
<v-row no-gutters>
  <v-col cols="12" sm="9">
  <event-map id="eventMap" :options="options" ></event-map>
  </v-col>
  <v-col cols="12" sm="3">
    <v-card flat class="px-4">
      <v-btn @click="reset()">reset</v-btn>
    <filter-case-studies :reset="resetProperties.caseStudies" v-model="options.caseStudies"></filter-case-studies>
      <filter-types  v-model="options.eventTypes"></filter-types>
      <filter-actors :reset="resetProperties.actors" v-model="options.actorFilter"></filter-actors>
    </v-card>
  </v-col>

</v-row>
</template>

<script>
import FilterCaseStudies from '../../components/FilterCaseStudies';
import FilterTypes from '../../components/FilterTypes';
import FilterActors from '../../components/FilterActors';
export default {
  name: 'index',
  components: { FilterActors, FilterTypes, FilterCaseStudies },
  data(){
    return{
      options:{
      caseStudies:[],
        eventTypes:[],
        actorFilter:{
          sender: {
            id: undefined,
            sex: undefined
          },
          bearer: {
            id: undefined,
            sex: undefined
          },
          recipient: {
            id: undefined,
            sex: undefined
          },
          traveller: {
            id: undefined,
            sex: undefined
          },
          others: {
            id: undefined,
            sex: undefined
          }
        }},
      resetProperties:{
        caseStudies:false,
        actors:false
      }
    }
  },
  methods:{
    reset(){
      this.resetProperties.caseStudies=!this.resetProperties.caseStudies;
      this.resetProperties.actors=!this.resetProperties.actors;
      this.options.eventTypes=[];
    }
  }
};
</script>

<style scoped>

</style>
