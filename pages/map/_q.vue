<template>
  <div>
    <maplist :filter="query" />
  </div>
</template>

<script>
import maplist from '~/components/lists/maplist.vue';
import queries from '~/mixins/queries';

export default {
  components: {
    maplist,
  },
  mixins: [queries],
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
