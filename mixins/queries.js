export default {
  methods: {
    parseQuery(query) {
      try {
        const q = JSON.parse(query);
        if (typeof q === 'object') {
          this.query = q;
        }
      } catch (e) {
        this.query = {
          filter: [`or|name|like|${query}`],
        };
      }
    },
  },
};
