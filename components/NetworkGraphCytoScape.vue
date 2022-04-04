<template>
    <div id="mynetwork2"></div>
</template>

<script>
import cytoscape from "cytoscape"
import fcose from 'cytoscape-fcose';

export default {
  name: 'NetworkGraph',
  props: {
    nodes: {
      type: Array,
      default: () => [],
    },
    edges: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      container: undefined,
      network: undefined,
    };
  },
  mounted() {
    cytoscape.use(fcose);
    // create an array with edges

    this.container = document.getElementById('mynetwork2');
    this.printNetwork();

  },
  methods: {
    printNetwork() {
      const cy = cytoscape({
        container: document.getElementById('mynetwork2'),
        elements: [
          ...this.nodes.map(x => ({data:x})),
          ...this.edges.map(x => ({data:x})),
        ]
      });
      cy.layout({
        name: 'fcose'
      }).run();

      this.loading = false;

    }
  },
  watch: {
    nodes() {
      this.printNetwork();
    },
    edges() {
      this.printNetwork();

    }
  }
};
</script>

<style scoped>
#mynetwork2 {
  height: 100%;
}
</style>
