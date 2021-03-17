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
    <template v-slot:item.features[0].system_class="{ item }">
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            {{ getIconBySystemClass(item.features[0].system_class) }}
          </v-icon>
        </template>
        <span>
          {{ getCRMClassBySystemClass(item.features[0].system_class) }}
          -
          {{ getLabelBySystemClass({ c: item.features[0].system_class, l: 'en' }) }}
        </span>
      </v-tooltip>
    </template>
    <template v-slot:item.features[0].properties.title="{ item }">
      <nuxt-link :to="`/single/${item.features[0]['@id'].split('/').splice(-1)[0]}`">
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
import { mapGetters } from 'vuex';

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
    const p = await this.$api.Entities.get_api_0_2_query_({
      limit: itemsPerPage,
      first: this.itemIndex[page - 1] ? this.itemIndex[page - 1].start_id : null,
      filter: this.filter,
      column: this.sortColumnByPath(sortBy)[0],
      sort: sortDesc ? 'desc' : 'asc',
    });
    // eslint-disable-next-line prefer-destructuring
    this.items = p.body.result;
    this.itemIndex = p.body.pagination.index;
    this.totalItems = p.body.pagination.entities;
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
          text: 'Class',
          value: 'features[0].system_class',
          column: 'system_class',
          width: '20px',
        },
        {
          text: 'Title',
          align: 'start',
          sortable: true,
          value: 'features[0].properties.title',
          column: 'title',
          width: '200px',
        },
        {
          text: 'Description',
          value: 'features[0].description[0].value',
          column: 'description',
          width: '300px',
        },
        {
          text: 'Begin/From',
          value: 'features[0].when.timespans[0].start.earliest',
          width: '50px',
        },
        {
          text: 'End/To',
          value: 'features[0].when.timespans[0].end.latest',
          width: '50px',
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
  methods: {
    sortColumnByPath(path) {
      if (Array.isArray(this.headers) && Array.isArray(path)) {
        return this.headers.filter((h) => h.value === path[0])
      }
      return [];
    },
  },
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
    ]),
  },
};
</script>
