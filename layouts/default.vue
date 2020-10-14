<template>
  <v-app light>
    <v-navigation-drawer
      v-model="$store.state.app.queryDrawer"
      class="ontop"
      :disable-resize-watcher="true"
      clipped
      app
      color="grey lighten-4"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            />
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          />
          <v-list-item
            v-else
            :key="i"
            link
            :to="item.target"
            @click="$store.commit('app/closeQueryDrawer')"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left class="ontop">
      <v-app-bar-nav-icon @click="$store.commit('app/toggleQueryDrawer')" />
      <nuxt-link to="/" @click="$store.commit('app/closeQueryDrawer')">
        <div class="logocaption d-none d-sm-flex">
          <img class="barlogo ml-1" src="/logo.png">
          <span class="title ml-1">OpenAtlas</span>
          <span class="title font-weight-light mr-5">Discovery</span>
        </div>
      </nuxt-link>
      <querysearch />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
import querysearch from '~/components/querysearch.vue';
import menuitems from '../assets/menuqueries.json';

export default {
  components: {
    querysearch,
  },
  data() {
    return {
      drawer: false,
      items: [
        { heading: 'Sample Queries' },
      ].concat(menuitems),
    };
  },
};
</script>
<style lang="scss">
td {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tablecolumndesc {
  min-width: 500px;
  max-width: 500px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.ontop {
  z-index: 401!important;
}

.logocaption {
  color: black;
  font-size: 0;
}

.barlogo {
  height: 27px;
  top: 8px;
  position: relative;
}
</style>
