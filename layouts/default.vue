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
          <img class="barlogo ml-1 mr-1" alt="logo" src="/OpenAtlasDiscovery_logo.png">
        </div>
      </nuxt-link>
      <querysearch />
      <v-spacer />
    </v-app-bar>
    <v-main v-if="!loading">
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
import { mapMutations } from 'vuex';
import querysearch from '~/components/querysearch.vue';

export default {
  components: {
    querysearch,
  },
  async fetch() {
    const content = await this.$api.Content.get_api_0_2_content_({});
    this.setSiteContent(content.body);
    this.title = content.body.siteName;
    const g = await this.$api.Content.get_api_0_2_geometric_entities_();
    this.setGeoItems(g.body);
    const p = await this.$api.Entities.get_api_0_2_code__code_({
      limit: 2000,
      code: 'event',
      show: 'when',
    });
    this.setTempItems(p.body.results);
    this.loading = false;
  },
  data() {
    return {
      drawer: false,
      items: [
        { heading: 'Sample Queries' },
      ].concat(this.$store.state.app.menuitems),
      title: '',
      loading: true,
    };
  },
  head() {
    return { title: this.title };
  },
  methods: {
    ...mapMutations('app', [
      'setGeoItems',
      'setTempItems',
      'setSiteContent',
    ]),
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
  height: 53px;
  top: 2px;
  position: relative;
}
</style>
