<template>
  <v-text-field
    v-model="filterstringinternal"
    solo-inverted
    flat
    hide-details
    prepend-inner-icon="mdi-magnify"
    @keydown.enter="parseQuery(filterstringinternal)"
  />
</template>

<script>
export default {
  props: {
    filterstring: {
      type: String,
    },
  },
  data() {
    return {
      filterstringinternal: '',
      filter: {},
    };
  },
  methods: {
    parseQuery(query) {
      if (!query) this.filterstringinternal = '';
      else {
        try {
          const q = JSON.parse(query);
          if (typeof q === 'object') {
            this.filter = q;
            this.filterstring = query;
            this.filterstringinternal = query;
          } else throw new Error('faulty list object');
        } catch (e) {
          // TODO: this will need to be redone once vuex is in play
          if (this.$route.name === 'list-q' || 'map-q') {
            this.$router.push({
              name: 'list-q',
              params: {
                q: '{}',
              },
            });
          }
        }
      }
    },
    updateQuery(a) {
      this.$router.push({
        name: this.$route.name,
        params: {
          q: JSON.stringify(a),
        },
      });
    },
  },
  watch: {
    filterstring: {
      handler(s) { this.parseQuery(s); },
      immediate: true,
    },
    filter: {
      handler(f) { this.updateQuery(f); },
      deep: true,
    },
    '$route.params': {
      handler(s) { this.parseQuery(s.q); },
      immediate: true,
      deep: true,
    },
  },
};
</script>
