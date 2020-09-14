<template>
  <div>
    <list :filter="query"></list>
  </div>
</template>

<script>
import list from '~/components/lists/list.vue';

export default {
  components: {
    list,
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
        // TODO: this will need to be redone once vuex is in play
        this.$router.push({
          name: 'list-q',
          params: {
            q: '{}',
          },
        });
      }
    },
  },
};
</script>
