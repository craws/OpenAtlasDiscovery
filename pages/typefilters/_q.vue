<template>
  <div>
    <list :filter="query" />
  </div>
</template>

<script>
import list from '~/components/lists/list.vue';
import queries from '~/mixins/queries';
import diachrony from '~/mixins/diachrony';

export default {
  components: {
    list,
    diachrony,
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
