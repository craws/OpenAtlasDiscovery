<template>
  <v-row no-gutters>
  <v-col xs="0" lg="9">
    <div class="fullheight">
      <qmap v-if="!this.loading" :geojsonitems="items"></qmap>
    </div>
  </v-col>
  <v-col xs="12" lg="3">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      :calculate-widths="true"
      :hide-default-footer="true"
    >
      <template v-slot:top="{ pagination, options, updateOptions }">
        <v-data-footer
          :pagination="pagination"
          :options="options"
          :items-per-page-options="itemsPerPageOptions"
          showFirstLastPage
          @update:options="updateOptions"
        />
      </template>
      <template v-slot:item.features[0].description[0].value="{ item }">
        <div v-if="item.features[0].description" class="tablecolumndesc">
          {{ item.features[0].description[0].value }}
        </div>
        <div v-else>
          n/a
        </div>
      </template>
    </v-data-table>
  </v-col>
  </v-row>
</template>

<script>
import qmap from '~/components/map.vue';

export default {
  props: {
    filter: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    qmap,
  },
  async fetch() {
    this.loading = true;
    const {
      sortBy,
      sortDesc,
      page,
      itemsPerPage,
    } = this.options;
    const p = await this.$api.Users.retrieveQuery({
      limit: this.options.itemsPerPage,
      first: this.itemIndex[page - 1] ? this.itemIndex[page - 1].start_id : null,
      show: ['detailed'],
      ...this.filter,
    });
    // eslint-disable-next-line prefer-destructuring
    this.items = p.body[0];
    this.itemIndex = p.body[1][0].index;
    this.totalItems = p.body[1][0].entities;
    this.loading = false;
  },
  data() {
    return {
      items: [],
      loading: true,
      options: {
        itemsPerPage: 50,
      },
      itemsPerPageOptions: [10, 20, 50],
      totalItems: 0,
      itemIndex: [],
      headers: [
        { text: 'Class', value: 'features[0].crmClass', width: '150px' },
        {
          text: 'Title',
          align: 'start',
          sortable: true,
          value: 'features[0].properties.title',
          width: '200px',
        },
      ],
    };
  },
  watch: {
    options: {
      handler() { this.$fetch(); },
      deep: true,
    },
    filter: {
      handler() { this.$fetch(); },
      deep: true,
    },
  },
};
</script>
<style>
.fullheight {
  height: calc(100vh - 64px);
}
</style>
