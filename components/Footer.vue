<template>
  <v-sheet width="100vw" class="grey lighten-2 pa-3 px-sm-15 py-sm-5">
    <v-row no-gutters >
      <v-col cols="12" sm="4" md="3" class="mr-15" >
        <p class="text-h5">About This Site</p>
        <div class="text-body-1 mb-1" v-html="intro"></div>

      </v-col>
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
        <div class="text-body-1 mb-1" v-html="contact"></div>


      </v-col>

    </v-row>
    <v-divider class="my-4"></v-divider>
    <div class="text--black d-flex justify-center">
      <nuxt-link to="/imprint">Imprint</nuxt-link>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'Footer',
  async fetch() {
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Content.get_api_0_3_content_();
    // eslint-disable-next-line prefer-destructuring
    this.contact = p.body.contact;
    this.intro = p.body.intro;
  },
  data() {
    return {
      contact: undefined,
      intro: undefined,
    };
  },
  mounted() {
    this.$fetch();
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
