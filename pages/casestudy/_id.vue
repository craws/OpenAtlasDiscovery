<template>
  <div v-if="!loading">
    <v-container class="pb-15">

      <p class="text-h4 text-center">{{item.features[0].properties.title}}</p>
      <event-map height="600px" :selectedCaseStudies="$route.params.id" id="eventMap" class="mt-15"></event-map>
      <v-row no-gutters class="mt-5">
        <v-col cols="12" sm="8" class="pr-5">{{item.features[0].descriptions[0].value}}</v-col>
        <v-col colse="12" sm="4" class="d-flex align-end">
          <div>
            <v-text-field solo-inverted flat color="primary" label="YOUR NAME"></v-text-field>
            <v-text-field solo-inverted flat color="primary" label="YOUR EMAIL"></v-text-field>
            <v-text-field solo-inverted flat color="primary" label="SUBJECT"></v-text-field>
            <v-textarea   solo-inverted flat color="primary"  label="MESSAGE" ></v-textarea>
            <v-btn class="grey lighten-2 el-0">Send</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  async fetch() {
    this.loading = true;
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Entities.get_api_0_3_entity__id__({
      id_: this.$route.params.id,
    });
    // eslint-disable-next-line prefer-destructuring
    this.item = p.body;

    this.loading = false;
  },
  data(){
    return{
      loading:true,
      item:undefined,
    }
  },
  watch: {
    '$route.params': {
      handler() {
        this.$fetch();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>

</style>
