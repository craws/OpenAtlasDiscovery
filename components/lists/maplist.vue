<template>
  <v-row no-gutters>
    <v-col xs="0" lg="9">
      <div class="fullheight">
        <qmap v-if="!this.loading" :geojsonitems="items" />
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import qmap from '~/components/map.vue';

export default {
  components: {
    qmap,
  },
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
      limit: this.options.itemsPerPage,
      first: this.itemIndex[page - 1] ? this.itemIndex[page - 1].start_id : null,
      filter: this.filter,
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
        itemsPerPage: 50,
      },
      itemsPerPageOptions: [10, 20, 50],
      totalItems: 0,
      itemIndex: [],
      headers: [
        {
          text: 'Class',
          value: 'features[0].system_class',
          width: '20px',
        },
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
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
    ]),
  },
};
</script>
<style>
.fullheight {
  height: calc(100vh - 64px);
}
</style>
