<template>
  <v-sheet width="100vw" class="grey lighten-2 pa-3 px-sm-15 py-sm-5">
    <v-row no-gutters >

      <v-col cols="12" sm="4" md="3"  class="mr-15">
        <p class="text-h5">Where to Find Us</p>
        <p class="text-body-1 mb-1"> Royal Holloway, University of London</p>
        <p class="text-body-1 mb-1"> Egham Hill</p>
        <p class="text-body-1 mb-1"> TW20 0EX</p>
        <p class="text-body-1 mb-1">Surrey</p>
        <p class="text-body-1 mb-1"> United Kingdom</p>

      </v-col>

      <v-col cols="12" sm="4" md="3"  class="mr-15">
        <p class="text-h5">Contact</p>
        <div class="text-body-1 mb-1" v-html="getSiteContent.contact"></div>


      </v-col>

    </v-row>
    <v-divider class="my-4"></v-divider>
    <div class="text--black d-flex justify-center">
      <nuxt-link to="/imprint">Imprint</nuxt-link>
    </div>
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Footer',
  computed:{
    ...mapGetters('app',['getSiteContent'])
  }
};
</script>

<style scoped>
a {
  color: grey !important;
}
a:hover {
  filter: brightness(0.8);
}
</style>
