<template>
  <client-only>
    <div>
      <svg id="network-svg"></svg>
    </div>
  </client-only>
</template>

<script>
import { createGraph } from '../utils/Network';

export default {
  name: 'ActorNetwork',
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
  mounted() {
    this.$nextTick(() => {
      const data = {
        nodes: this.nodes,
        links: this.edges,
      };
      //createGraph(data, 2, 2, "100%", "600px");

    });
  },
  watch: {
    nodes() {
      const data = {
        nodes: this.nodes,
        links: this.edges,
      };
      createGraph(data, 2, 2, "100%", "600px");


    },
    edges() {
      const data = {
        nodes: this.nodes,
        links: this.edges,
      };
      console.log("renderGraph")
      createGraph(data, 2, 2, "100%", "600px");



    }
  },
}
;
</script>

<style scoped>


</style>
