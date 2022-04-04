<template>
  <client-only>
  <div id="mynetwork"></div>
  </client-only>
</template>

<script>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { mapGetters } from 'vuex';

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

    // create an array with edges
    this.$nextTick(() => {

      this.container = document.getElementById('mynetwork');
      this.printNetwork();
    });

  },
  methods: {
    printNetwork() {
      this.network?.destroy();
      this.loading = true;
      const data = {
        nodes: new DataSet(this.nodes),
        edges: new DataSet(this.edges),
      };
      const groups = this.getCaseStudies.reduce((dict, current) => ({
        ...dict,
        [current.id]: { color: { background: current.color, border: current.color } }
      }), {});
      const options = {
        groups,
        nodes: {
          shape: 'dot',
          scaling: {
            min: 10,
            max: 30,
          },
          font: {
            size: 12,
            face: 'Tahoma',
          },
        },
        edges: {
          width: 0.15,
          smooth: {
            type: 'continuous',
          },
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200,
          },
        },
        interaction: {
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
        },
      };
      this.network = new Network(this.container, data, options);
      this.loading = false;
      const n = this.network
      const routeToPage = (id) => {
        this.$router.push(`/single/${id}`);
      };
      this.network.on("doubleClick", function (params) {
        const node = n.getNodeAt(params.pointer.DOM)
        routeToPage(node)
      });

    }
  },
  watch: {
    nodes() {
     this.container && this.printNetwork();
    },
    edges() {
      this.container && this.printNetwork();

    }
  },
  computed: {
    ...mapGetters('data', ['getCaseStudies']),
  }
};
</script>

<style scoped>
#mynetwork {
  height: 100%;
}
</style>
