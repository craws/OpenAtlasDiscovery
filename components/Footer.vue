<template>
  <v-sheet width="100vw" class="grey lighten-2 pa-3 px-sm-15 py-sm-5">
    <v-row no-gutters>

      <v-col cols="12" sm="4" order="1" class="mb-5">
        <p class="text-h5">Where to Find Us</p>
        <p class="text-body-1 mb-1"> Royal Holloway, University of London</p>
        <p class="text-body-1 mb-1"> Egham Hill</p>
        <p class="text-body-1 mb-1"> TW20 0EX</p>
        <p class="text-body-1 mb-1">Surrey</p>
        <p class="text-body-1 mb-1"> United Kingdom</p>

      </v-col>

      <v-col cols="12" sm="4" order="2" class="mb-5">
        <p class="text-h5">Contact</p>
        <div class="text-body-1 mb-1" v-html="getSiteContent.contact"></div>


      </v-col>
      <v-col cols="12" sm="4" class="mb-5 text-sm-right nav" order="0" order-sm="3">
        <p class="ma-1 pa-0">
          <nuxt-link to="/">Home page</nuxt-link>
        </p>
        <p class="ma-1 pa-0">
          <nuxt-link to="/network">Actor Connections</nuxt-link>
        </p>
        <p class="ma-1 pa-0">
          <nuxt-link to="/map">Map</nuxt-link>
        </p>
        <p class="ma-1 pa-0">
          <nuxt-link to="/casestudies">Case Studies</nuxt-link>
        </p>
        <p class="ma-1 pa-0">
          <nuxt-link to="/methodology">Methodology</nuxt-link>
        </p>
        <p class="ma-1 pa-0">
          <nuxt-link to="/userguide">User Guide</nuxt-link>
        </p>


      </v-col>

    </v-row>
    <v-divider></v-divider>
    <div class="d-flex white justify-space-around align-center flex-wrap">
      <a class="d-flex ma-2" v-for="partner in partners" :key="partner.name" :href="partner.url" target="_blank" >
        <img style="height:80px"  :src="partner.logo" :alt="partner.name" :title="partner.name">
      </a>
    </div>
    <v-divider class="mb-4"></v-divider>
    <div class="text--black d-flex justify-center">
      <nuxt-link to="/imprint">Imprint</nuxt-link>
    </div>
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Footer',
  data() {
    return {
      partners: {
        'RHUL': {
          'name': 'Royal Holloway University of London',
          'url': 'https://www.royalholloway.ac.uk/',
          'logo': '/rhul.png'
        },
        'OEAW': {
          'name': 'Austrian Academy of Sciences',
          'url': 'https://www.oeaw.ac.at/',
          'logo': '/oeaw.png'
        },
        'ACDH': {
          'name': 'Austrian Centre for Digital Humanities and Cultural Heritage',
          'url': 'https://www.oeaw.ac.at/acdh/',
          'logo': '/acdh.png'},
        'ERC': {
          'name': 'European Research Council',
          'url': 'https://erc.europa.eu/',
          'logo': '/erc.png'},
        'OA': {
          'name': 'OpenAtlas',
          'url': 'https://openatlas.eu/',
          'logo': '/openatlas.png'},
      }
    };
  },
  computed: {
    ...mapGetters('app', ['getSiteContent'])
  }
};
</script>

<style scoped>
a {
  color: grey !important;
}

.nav a:hover {
  filter: brightness(0.8);
}

</style>
