<template>
  <div>
    <v-row no-gutters style="height: 100%">
      <v-col cols="12" sm="6" md="8">
        <v-card outlined class="full-height" tile>
          <actor-network></actor-network>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import NetworkGraphD3 from '~/components/NetworkGraphD3.vue';

export default {
  name: 'index',
  data() {
    return {
      filterCaseStudies: [633, 6934, 8184, 938, false, 12953, false, 13088, 13087, false, 13246, false],
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
