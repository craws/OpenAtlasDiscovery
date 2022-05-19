<template>
  <div class="d-flex nav-search">
    <v-select class="ma-0 nav-search-select" hide-details outlined
              dense
              style="width:150px"
              v-model="selectedClass"
              :items="items"
              item-text="text"
              return-object
    >

    </v-select>
    <v-text-field
      v-model="filterstring"
      outlined
      dense
      class="nav-search-input"
      hide-details
      append-icon="mdi-magnify"
      @click:append="updateQuery(filterstring)"
      @keydown.enter="updateQuery(filterstring)"
      :placeholder="`Search for ${selectedClass.text}`"
    >

    </v-text-field>
  </div>
</template>

<script>
import search from 'cytoscape/src/core/search';

export default {
  data() {
    return {
      filterstring: '',
      items: this.$store.state.app.menuitems,
      selectedClass: this.$store.state.app.menuitems[0],
    };
  },
  watch: {
    '$route.params': {
      handler(s) {
        this.updateString(s.q);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    updateString(query) {
      if (!query) {
        this.filterstring = '';
      } else {
        this.filterstring = query;
      }
    },
    updateQuery(a) {
      let name = 'list-q';
      if (this.$route.name === 'list-q' || this.$route.name === 'map-q') name = this.$route.name;
      this.$router.push({
        name,
        query: {
          view_classes: this.selectedClass.target.query.view_classes,
          search: [`{"entityName":[{"operator":"like","logicalOperator":"or","values":["${this.filterstring}"]}]}`]
          //  search for description
          //            `{"entityDescription":[{"operator":"like","logicalOperator":"or","values":["${this.filterstring}"]}]}`]
        },
      });
    },
  },
};
</script>

<style>
.nav-search-select .v-input__control {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.nav-search-input .v-input__control {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
