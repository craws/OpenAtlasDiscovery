<template>
  <div>
    <maplist :filter="query"></maplist>
  </div>
</template>

<script>
import maplist from '~/components/lists/maplist.vue';

export default {
  components: {
    maplist,
  },
  data() {
    return {
      viewdial: false,
      transition: 'slide-y-reverse-transition',
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
    parseQuery(query) {
      try {
        const q = JSON.parse(query);
        if (typeof q === 'object') {
          this.query = q;
        } else throw new Error('faulty list object');
      } catch (e) {
        console.log(e);
        // TODO: this will need to be redone once vuex is in play
        this.$router.push({
          name: 'map-q',
          params: {
            q: '{}',
          },
        });
      }
    },
  },
};
</script>
