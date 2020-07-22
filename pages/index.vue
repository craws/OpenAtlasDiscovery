<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
        <p class="title">
          Welcome to the OpenAtlas Discovery prototype
        </p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue';

export default {
  components: {
    Logo,
  },
  mounted() {
    console.log(this.$api.Users.retrieveEntitiesByClass({ class: 'E21', limit: 10 }));
  },
};
</script>
