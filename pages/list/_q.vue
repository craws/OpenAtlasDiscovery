<template>
  <div>
    <list :filter="query" />
  </div>
</template>

<script>
import list from '~/components/lists/list.vue';
import queries from '~/mixins/queries';

export default {
  mixins: [queries],
  components: {
    list,
  },
  data() {
    return {
      query: {},
      view: 'list',
    };
  },
  watch: {
    '$route.params': {
      handler(s) { this.parseQuery(s.q); },
      immediate: true,
      deep: true,
    },
  },
  methods: {
  },
};
</script>
