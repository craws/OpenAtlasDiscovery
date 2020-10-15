<template>
  <div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      query: {},
      view: 'list',
    };
  },
  watch: {
    '$route.params': {
      handler(s) { console.log(s.id); },
      immediate: true,
      deep: true,
    },
  },
  methods: {
  },
};
</script>
