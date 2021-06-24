<template>
  <v-data-table
    :headers="$store.state.app.tableheaders.wide"
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
    <template v-slot:item.features[0].systemClass="{ item }">
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            {{ getIconBySystemClass(item.features[0].systemClass) }}
          </v-icon>
        </template>
        <span>
          {{ getCRMClassBySystemClass(item.features[0].systemClass) }}
          -
          {{ getLabelBySystemClass({ c: item.features[0].systemClass, l: 'en' }) }}
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
    const query = {
      limit: itemsPerPage,
      first: this.itemIndex[page - 1] ? this.itemIndex[page - 1].startId : null,
      filter: this.filter,
      column: sortBy ? this.getSortColumnByPath(sortBy[0]) : null,
      sort: sortDesc[0] ? 'desc' : 'asc',
    };
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_2_query_(query);
    // eslint-disable-next-line prefer-destructuring
    this.items = p.body.results;
    this.itemIndex = p.body.pagination.index;
    this.totalItems = p.body.pagination.entities;
    this.loading = false;
  },
  data() {
    return {
      items: [],
      loading: true,
      options: {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      },
      itemsPerPageOptions: [10, 20, 50, 100],
      totalItems: 0,
      itemIndex: [],
    };
  },
  watch: {
    options: {
      handler(o, n) {
        if ((o.sortBy !== n.sortBy) || (o.sortDesc !== n.sortDesc)) this.itemIndex = [];
        this.$fetch();
      },
      deep: true,
    },
    filter: {
      handler() { this.$fetch(); },
      deep: true,
    },
  },
  methods: {
  },
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
    ]),
  },
};
</script>
