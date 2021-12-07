<template>
  <v-container class="bgmap">
    <v-row
      no-gutters
      style="height: 70%"
    >
      <v-col
        cols="12"
        sm="6"
        md="8"
      >
        <v-card
          outlined
          class="fill-height"
          tile
        >
          <qmap v-if="!loading" :geojsonitems="getGeoItemsAsFeatureCollection" :options="{ zoomControl: false }" />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="fill-height pa-2"
          tile
          outlined
        >
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h2">
                {{ content.siteName }}
              </v-list-item-title>
              <v-list-item-subtitle v-html="content.intro" />
            </v-list-item-content>
          </v-list-item>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon
                  class="grey lighten-1"
                  dark
                >
                  mdi-comment-text-multiple
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Contact</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon
                  class="grey lighten-1"
                  dark
                >
                  mdi-gavel
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Legal Information</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      style="height: 30%"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="fill-height"
          outlined
          tile
        >
          <logo />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="8"
      >
        <v-card
          class="fill-height pa-2"
          outlined
          tile
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from '~/components/Logo.vue';
import qmap from '~/components/map.vue';

export default {
  components: {
    Logo,
    qmap,
  },
  data() {
    return {
      items: [],
      content: {
        contact: '',
        intro: 'loading...',
        legalNotice: '',
        siteName: '',
      },
      loading: true,
    };
  },
  async mounted() {
    const c = await this.$api.Content.get_api_0_2_content_({});
    this.content = c.body;
    this.loading = false;
  },
  computed: {
    ...mapGetters('app', [
      'getGeoItemsAsFeatureCollection',
    ]),
  },
};
</script>
<style>

.splashtext {
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
  top: 15vh;
  width: 100%;
}

.bgmap {
  height: calc(100vh - 64px);
  max-width: 100% !important;
  position: absolute;
  top: 0px;
  padding: 0px;
}
</style>
