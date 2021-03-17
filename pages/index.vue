<template>
  <div>
    <v-layout
      column
      justify-center
      align-center
    >
      <div class="text-center ontop splashtext">
        <logo />
        <div v-html="body" />
      </div>
    </v-layout>
    <div class="bgmap">
      <qmap v-if="!loading" :geojsonitems="items" :options="{ zoomControl: false }" />
    </div>
  </div>
</template>

<script>
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
      body: 'loading...',
      loading: true,
    };
  },
  async mounted() {
    const p = await this.$api.Entities.get_api_0_2_code__code_({
      limit: 100,
      show: ['geometry'],
      code: 'place',
    });
    this.items = p.body.result;
    const content = await this.$api.Content.get_api_0_2_content_({});
    this.body = content.body.intro;
    this.loading = false;
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
  width: 100%;
  position: absolute;
  top: 0px;
}
</style>
