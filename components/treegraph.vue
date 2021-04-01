<template>
  <client-only>
    <div id="treegraph" class="treecontainer" />
  </client-only>
</template>

<script>
/* eslint-disable no-underscore-dangle,no-param-reassign */
import * as d3 from 'd3';
import { mapGetters } from 'vuex';

export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        margin: {
          top: 120,
          right: 90,
          bottom: 30,
          left: 90,
        },
        height: 960,
        width: 600,
        duration: 750,
      }),
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
  computed: {
    ...mapGetters('app', [
      'getIconBySystemClass',
      'getLabelBySystemClass',
      'getCRMClassBySystemClass',
      'getSortColumnByPath',
      'hasTime',
      'hasSex',
    ]),
  },
  watch: {},
  mounted() {
    const treeData = this.treeobject || {};
    const { margin, duration } = this.config;
    const width = this.config.width - margin.left - margin.right;
    const height = this.config.height - margin.top - margin.bottom;
    const svg = d3.select('#treegraph').attr('viewBox', [-10, -10, width, height])
      .append('g')
      .attr('transform', `translate(${
        margin.left},${margin.top})`);
    let i = 0;

    const treemap = d3.tree().size([height, width]).nodeSize([30, 60]);

    const root = d3.hierarchy(treeData, (d) => d.children);
    root.x0 = height / 2;
    root.y0 = 100;

    if (root.children) root.children.forEach(collapse);
    update(root);

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      // eslint-disable-next-line no-shadow
      const treeData = treemap(root);

      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });
      const node = svg.selectAll('g.node')
        .data(nodes, (d) => d.id || (d.id = ++i));

      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0},${source.x0})`)
        .on('click', click);

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

      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children || d._children ? -13 : 13))
        .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
        .text((d) => d.data.name);

      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`);
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', (d) => (d._children ? '#c9e4ff' : '#fff'))
        .style('stroke-width', () => '2px')
        .attr('cursor', 'pointer');

      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', () => `translate(${source.y},${source.x})`)
        .remove();
      nodeExit.select('circle')
        .attr('r', 1e-6);
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      const link = svg.selectAll('path.link')
        .data(links, (d) => d.id);

      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      const linkUpdate = linkEnter.merge(link);
      linkUpdate.transition()
        .duration(duration)
        .attr('d', (d) => diagonal(d, d.parent));
      link.exit().transition()
        .duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();
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
.treecontainer {
  width: 100%;
  height: 100%;
}
</style>
