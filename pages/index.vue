<template>
  <v-container class="bgmap">
    <v-row
      no-gutters
      style="height: 50%"
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
          <qmap v-if="!loading" :geojsonitems="getGeoItemsAsFeatureCollection" :options="{ zoomControl: false }"/>
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
              <v-list-item-subtitle v-html="content.intro"/>
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
                <v-list-item-subtitle v-html="content.contact"></v-list-item-subtitle>
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
                <v-list-item-subtitle>{{ content.legalNotice }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      style="height: 50%"
    >
      <v-col cols="12">
        <v-row>
          <v-col
            cols="3"
            sm="6"
            md="3"
            v-for="item in items"
          >
            <v-card

              class="mx-auto"
              max-width="344"
            >
              <v-card-text v-if="item.features[0]">
                <div>Case Study</div>
                <p class="text-h4 text--primary">
                  {{ item.features[0].properties.title }}
                </p>
                <div class="text--primary" v-if="item.features[0].description">
                  {{ item.features[0].description[0].value }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                >
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';
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
      casestudies: [633, 13064, 9362, 1420],
      content: {
        contact: '',
        intro: 'loading...',
        legalNotice: '',
        siteName: '',
      },
      loading: true,
      reveal: false,
    };
  },
  async mounted() {
    const c = await this.$api.Content.get_api_0_2_content_({});
    this.content = c.body;
    // eslint-disable-next-line no-restricted-syntax
    for (const ct of this.casestudies) {
      // eslint-disable-next-line no-await-in-loop,no-underscore-dangle
      const cf = await this.$api.Entities.get_api_0_2_entity__id__({
        id_: ct,
      });
      this.items.push(cf.body);
    }
    console.log(this.items);
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

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
