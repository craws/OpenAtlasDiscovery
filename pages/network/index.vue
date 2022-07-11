<template>
  <div>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" sm="9">
        <v-card outlined class="full-height" tile>
          <actor-network height="calc(100vh - 64px)" :filterCaseStudies="filterCaseStudies" :relationTypes="relationTypes"></actor-network>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" >
        <v-card class="full-height pa-2 overflow-auto" tile outlined>
          <filter-case-studies v-model="filterCaseStudies"></filter-case-studies>
          <filter-relations v-model="relationTypes"></filter-relations>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import NetworkGraphD3 from '~/components/NetworkGraphD3.vue';

export default {
  name: 'index',
  data() {
    return {
      filterCaseStudies: [],
      relationTypes:[]
    };
  },
  computed: {
    ...mapGetters('data', ['getCaseStudies']),
  },
  methods: {

  },

  components: { NetworkGraphD3 }
};
</script>

<style scoped>
.full-height {
  height: calc(100vh - 64px);
}


</style>
