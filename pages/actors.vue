<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>

    </v-flex>
  </v-layout>
</template>

<script>

export default {
  mounted() {
    console.log(this.$api.Users.retrieveQuery({ 'classes[]': ['E21', 'E74', 'E40'], limit: 10 }));
  },
};
</script>
