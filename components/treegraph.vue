<template>
  <client-only>
    <div id="treegraph" class="mapcontainer" />
  </client-only>
</template>

<script>
/* eslint-disable no-underscore-dangle,no-param-reassign */
import * as d3 from 'd3';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      },
    },
    treeobject: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {},
  mounted() {
    const treeData = this.treeobject || {};
    const margin = {
      top: 120, right: 90, bottom: 30, left: 90,
    };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const svg = d3.select('#treegraph').attr('viewBox', [-10, -10, width, height])
      .append('g')
      .attr('transform', `translate(${
        margin.left},${margin.top})`);
    let i = 0;
    const duration = 750;
    let root;
    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]).nodeSize([30, 60]);
    // var treemap = d3.tree().nodeSize([width, height])
    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, (d) => d.children);
    root.x0 = height / 2;
    root.y0 = 100;
    // Collapse after the second level
    if (root.children) root.children.forEach(collapse);
    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      // Assigns the x and y position for the nodes
      const treeData = treemap(root);
      // Compute the new tree layout.
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);
      // Normalize for fixed-depth.
      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });
      // ****************** Nodes section ***************************
      // Update the nodes...
      const node = svg.selectAll('g.node')
        .data(nodes, (d) => d.id || (d.id = ++i));
      // Enter any new modes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0},${source.x0})`)
        .on('click', click);
      // Add Circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', (d) => (d._children ? '#c9e4ff' : '#fff'));
      // .on('click', function () {
      //   d3.select(this)
      //     .transition()
      //     .delay(1)
      //     .style('fill', function () {
      //       return '#6cfa00'
      //     })
      //     .style('stroke-width', function () {
      //       return '3px'
      //     })
      // })
      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children || d._children ? -13 : 13))
        .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
        .text((d) => d.data.name);
      // UPDATE
      const nodeUpdate = nodeEnter.merge(node);
      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`);
      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', (d) => (d._children ? '#c9e4ff' : '#fff'))
        .style('stroke-width', () => '2px')
        .attr('cursor', 'pointer');
      // Remove any exiting nodes
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', () => `translate(${source.y},${source.x})`)
        .remove();
      // On exit #f7d708uce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);
      // On exit #f7d708uce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);
      // ****************** links section ***************************
      // Update the links...
      const link = svg.selectAll('path.link')
        .data(links, (d) => d.id);
      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });
      // UPDATE
      const linkUpdate = linkEnter.merge(link);
      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', (d) => diagonal(d, d.parent));
      // Remove any exiting links
      link.exit().transition()
        .duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();
      // Store the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }
  },
  methods: {},
};
</script>

<style>
.mapcontainer {
  width: 100%;
  height: 100%;
}
</style>
