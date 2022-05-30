<template>
  <div v-if="!loading">
    <v-container class="pb-15 pt-10">

      <p class="text-h3 text-center">{{ item.features[0].properties.title }}</p>
      <event-map :options="options" height="600px" :selectedCaseStudies="$route.params.id" id="eventMap" class="mt-15"
      ></event-map>
      <v-row no-gutters class="mt-5">
        <v-col cols="12" sm="8" class="pr-5">{{ item.features[0].descriptions[0].value }}</v-col>
        <v-col cols="12" sm="4" class="">
          <filter-types v-model="options.eventTypes"></filter-types>
          <filter-actors v-model="options.actorFilter"></filter-actors>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  async fetch() {
    this.loading = true;
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_3_entity__id__({
      id_: this.$route.params.id,
    });
    // eslint-disable-next-line prefer-destructuring
    this.item = p.body;

    this.loading = false;
  },
  data() {
    return {
      loading: true,
      item: undefined,
      options: {
        eventTypes: [],
        actorFilter: {
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
        }
      },

    };
  },
  watch: {
    '$route.params': {
      handler() {
        this.$fetch();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>

</style>
