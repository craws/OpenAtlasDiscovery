<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="totalItems"
    :loading="loading"
    :calculate-widths="true"
    :footer-props="{
      showFirstLastPage: true,
      'items-per-page-options': itemsPerPageOptions,
    }"
  >
    <template v-slot:top="{ pagination, options, updateOptions }">
      <v-data-footer
        :pagination="pagination"
        :options="options"
        :items-per-page-options="itemsPerPageOptions"
        show-first-last-page
        @update:options="updateOptions"
      />
    </template>
    <template v-slot:item.features[0].properties.title="{ item }">
      <nuxt-link :to="`/single/${item.features[0]['@id']}`">
        {{ item.features[0].properties.title }}
      </nuxt-link>
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
</template>

<script>

export default {
  props: {
    filter: {
      type: Object,
      default: () => {},
    },
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
      show: ['names'],
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
        itemsPerPage: 10,
      },
      itemsPerPageOptions: [10, 20, 50],
      totalItems: 0,
      itemIndex: [],
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: true,
          value: 'features[0].properties.title',
          width: '400px',
        },
        {
          text: 'Description',
          value: 'features[0].description[0].value',
          width: '500px',
        },
        { text: 'Class', value: 'features[0].crmClass', width: '150px' },
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
