<template>
  <div>
    <maplist :filter="query"></maplist>
  </div>
</template>

<script>
import maplist from '~/components/lists/maplist.vue';
import queries from '~/mixins/queries';

export default {
  mixins: [queries],
  components: {
    maplist,
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
