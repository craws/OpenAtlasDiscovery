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
    <v-menu offset-y attach="#menu-ancher" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">


        <div class="d-flex"  id="menu-ancher">
        <v-text-field

          v-model="filterstring"
          outlined
          dense
          class="nav-search-input"
          hide-details
          @keydown.enter="updateQuery(filterstring)"
          :placeholder="`Search for ${selectedClass.text}`"

        >
          <template slot="append">

            <v-icon

              v-on="on"
              v-bind="attrs"
              class="mr-2 search-icon"
            >mdi-tune
            </v-icon>
            <v-hover
              v-slot="{ hover }"
            >
            <v-icon
              :color="hover ? 'primary' : ''"
              @click="updateQuery(filterstring)"
            >mdi-magnify
            </v-icon>
            </v-hover>
          </template>
        </v-text-field>
        </div>
      </template>
      <v-list>
        <v-subheader>Search Settings</v-subheader>
        <v-list-item>
          <v-list-item-title>
            <v-checkbox
              label="search for name"
              v-model="searchName"
              :disabled="!searchDescription"
            ></v-checkbox>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-checkbox
              label="search for description"
              v-model="searchDescription"
              :disabled="!searchName"

            ></v-checkbox>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
      searchName:true,
      searchDescription:false,
    };
  },
  watch: {
    '$route.params': {
      handler(s) {
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    updateString(query) {
        this.filterstring = query;
    },
    updateQuery(a) {
      let name = 'list-q';
      if (this.$route.name === 'list-q' || this.$route.name === 'map-q') name = this.$route.name;
      const searchName = `{"entityName":[{"operator":"like","logicalOperator":"or","values":["${this.filterstring}"]}]}`
      const searchDescription = `{"entityDescription":[{"operator":"like","logicalOperator":"or","values":["${this.filterstring}"]}]}`


      this.$router.push({
        name,
        query: {
          view_classes: this.selectedClass.target.query.view_classes,
          search: [
            ...(this.searchName ? [searchName] : []),
            ...(this.searchDescription ? [searchDescription] : [])]
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
