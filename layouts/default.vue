<template>
  <v-app light>
    <v-app-bar app clipped-left class="ontop">
      <nuxt-link to="/" @click="$store.commit('app/closeQueryDrawer')">
        <div class="logocaption d-none d-sm-flex">
          <img class="barlogo ml-1 mr-1" alt="logo" src="/connecLogo.jpg">
        </div>
      </nuxt-link>
      <querysearch />
      <v-spacer />
      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            text
          >
            Explore all entries
          </v-btn>
        </template>
        <v-list dense class="grey lighten-4">
          <template v-for="(item, i) in items">
            <v-list-item
              :exact="true"
              :key="i"
              link
              :to="item.target"
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
      </v-menu>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <Footer></Footer>
  </v-app>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import querysearch from '~/components/querysearch.vue';

export default {
  components: {
    querysearch,
  },
  data() {
    return {
      drawer: false,
      items: this.$store.state.app.menuitems,
      title: '',
    };
  },
async mounted(){
  const p = await this.$api.Content.get_api_0_3_content_();
  this.setSiteContent(p.body);
  await this.loadTypeTree();
},
  methods: {
    ...mapMutations('app', [
      'setGeoItems',
      'setTempItems',
      'setSiteContent',
    ]),
    ...mapActions('data',['loadTypeTree']),
    ...mapActions('app',['setSiteContent']),
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
  z-index: 401 !important;
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
