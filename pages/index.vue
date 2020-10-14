<template>
  <div>
    <v-layout
      column
      justify-center
      align-center
    >
      <div class="text-center ontop splashtext">
        <logo />
        <p class="title">
          Welcome to the OpenAtlas Discovery prototype
        </p>
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
      loading: true,
    };
  },
  async mounted() {
    const p = await this.$api.Users.retrieveQuery({
      limit: 100,
      show: ['detailed'],
      items: 'place',
    });
    this.items = p.body[0];
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
