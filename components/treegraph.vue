<template>
  <svg class="d3-tree treecontainer">
    <g class="container" />
  </svg>
</template>

<script>
/* eslint-disable no-underscore-dangle,no-param-reassign */
import * as d3 from 'd3';
import { mapGetters } from 'vuex';

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
      showDetails: false,
      nodeId: '1',
      nodeName: 'flare',
      zoom: null,
      index: 0,
      duration: 750,
      root: null,
      nodes: [],
      links: [],
      dTreeData: null,
      margin: {
        top: 20, right: 90, bottom: 30, left: 90,
      },
      currentNode: null,
      svg: null,
      container: null,
      nodeObj: null,
      newNodeName: '',
      rootNodeId: null,
      buttonDisabled: false,
      dialog: false,
    };
  },
  methods: {
    getChildren(d) {
      const children = [];
      if (typeof d === 'object' && d !== null) {
        let i = 10;
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const dKey in d) {
          const r = {
            name: dKey,
            value: i,
          };
          if (this.getChildren(d[dKey]) !== null) r.children = this.getChildren(d[dKey]);
          children.push(r);
          // eslint-disable-next-line no-plusplus
          i++;
        }
        return children;
      }
      return null;
    },
    initSvg(treeData) {
      const { clientWidth } = document.body;
      const { clientHeight } = document.body;
      this.width = Math.floor(clientWidth * 0.6);
      this.height = clientHeight - 72;
      const margin = ({
        top: 10, right: 120, bottom: 10, left: 40,
      });
      const { width } = this;
      const dx = 30;
      this.nodeObj = d3.hierarchy.prototype.constructor;
      this.svg = d3
        .select('svg.d3-tree')
        .attr('viewBox', [-margin.left, -margin.top, width, dx]);
      const transform = d3.zoomIdentity
        .translate(this.margin.left, this.margin.top)
        .scale(1);
      this.container = this.svg.select('g.container');
      // init zoom behavior, which is both an object and function
      this.zoom = d3
        .zoom()
        .scaleExtent([1 / 4, 4])
        .on('zoom', (event) => {
          d3.select('g.container')
            .attr('transform', event.transform);
        });
      this.container
        .transition()
        .duration(750)
        .call(this.zoom.transform, transform);
      this.svg.call(this.zoom).on('dblclick.zoom', null);
      this.root = this.getRoot(treeData);
      this.update(this.root);
    },
    initDrawer() {
      console.log('init drawer');
      this.newNodeName = '';
      this.nodeId = '';
      this.nodeName = '';
      this.currentNode = null;
    },
    addNode() {
      if (!this.newNodeName) {
        console.warn('新增节点名称不能为空');
        return false;
      }
      if (!this.currentNode) {
        console.warn('请先选择一个节点');
        return false;
      }
      const parent = this.currentNode;
      const child = Object.assign(new this.nodeObj, {parent, depth: parent.depth + 1}) // eslint-disable-line
      const value = parseInt(Math.random() * 9999, 10) + 1;
      child.value = value;
      child.data = {
        name: this.newNodeName,
        value,
      };
      if (parent.children) parent.children.push(child);
      else parent.children = [child];
      this.nodes.push(child);
      this.links.push({ source: parent, target: child });
      this.update(parent);
      console.info('新增成功');
    },
    deleteNodeData() {
      this.dialog = false;
      if (this.currentNode.parent && this.currentNode.parent.children.length > 0) {
        this.currentNode.parent.children.filter((item, i) => {
          if (item.data && (item.data.value === this.currentNode.data.value)) {
            this.currentNode.parent.children.splice(i, 1);
            if (this.currentNode.parent.children.length === 0) {
              delete this.currentNode.parent.children;
            }
            this.update(this.currentNode);
            this.initDrawer();
          }
        });
      }
    },
    deleteNode() {
      if (!this.currentNode) {
        console.warn('请选择要删除的节点');
        return false;
      }
      if (this.currentNode.data.value === this.rootNodeId) {
        console.warn('不能删除根节点');
        return false;
      }
      this.dialog = true;
    },
    editNode() {
      if (!this.currentNode) {
        console.warn('请选择要编辑的节点');
        return false;
      }
      this.currentNode.data.name = this.newNodeName;
      const { parent } = this.currentNode;
      this.update(parent);
    },
    async handleDrop(evt) {
      evt.preventDefault();
      if (evt.dataTransfer.files && evt.dataTransfer.files.length) {
        const file = evt.dataTransfer.files[0];
        console.log('file: ', file) // eslint-disable-line
      }
    },
    goBack() {
      if (this.$route.params.data) {
        if (this.$route.params.data.searchType === 'keyword') {
          this.$router.push({
            name: 'Search',
            params: { data: this.$route.params.data },
          }).catch((err) => {
          }) // eslint-disable-line
        } else if (this.$route.params.data.searchType === 'title') {
          this.$router.push({
            name: 'ArticleDetail',
            params: { data: this.$route.params.data },
          }).catch((err) => {
          }) // eslint-disable-line
        }
      } else {
        this.$router.push({ name: 'ArticleDetail' }).catch((err) => {
        }) // eslint-disable-line
      }
    },
    getRoot(treeData) {
      const root = d3.hierarchy(treeData, (d) => d.children);
      root.x0 = this.height / 2;
      root.y0 = 0;
      return root;
    },
    dblclickNode(d) {
      // Double click the node, and expand the node if there are child nodes
      if (d.children) {
        this.$set(d, '_children', d.children);
        d.children = null;
      } else {
        this.$set(d, 'children', d._children);
        d._children = null;
      }
      this.$nextTick(() => {
        this.update(d);
      });
    },
    clickNode(d) {
      this.currentNode = d;
      this.nodeId = d.data.value;
      this.nodeName = d.data.name;
      if (d.children) {
        this.$set(d, '_children', d.children);
        d.children = null;
      } else {
        this.$set(d, 'children', d._children);
        d._children = null;
      }
      this.$nextTick(() => {
        this.update(d);
      });
    },
    diagonal(s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
    },
    getNodesAndLinks() {
      this.dTreeData = this.treemap(this.root);
      this.nodes = this.dTreeData.descendants();
      this.links = this.dTreeData.descendants().slice(1);
    },
    // 数据与Dom进行绑定
    update(source) {
      console.log('update');
      this.getNodesAndLinks();
      // this.nodes.forEach(d => {
      //   d.y = d.depth * 18
      // })
      const node = this.container.selectAll('g.node').data(this.nodes, (d) => d.id || (d.id = ++this.index));
      // Enter any new sources at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        // .on('dblclick', this.dblclickNode)
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .on('click', this.clickNode);
      console.log('---: ', node.enter().selectAll('circle'));
      // Add circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', (d) => (d._children ? '#c9e4ff' : '#fff'))
        .append('title')
        .text((d) => // add title
          d.value)
        .on('click', function () {
          const self = this;
          setTimeout(() => {
            d3.select(self)
              .transition()
              .delay(1)
              .style('fill', () => '#54a8ff')
              .style('stroke-width', () => '3px');
          }, 100);
        });
      nodeEnter
        .append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children || d._children ? -14 : 14))
        .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
        .text((d) => (d.data.name.length > 20 ? `${d.data.name.substring(0, 20)}...` : d.data.name))
        .attr('class', 'update');
      // Transition nodes to their new position.
      const nodeUpdate = nodeEnter
        .merge(node)
        .transition()
        .duration(this.duration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`);
      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', (d) => (d._children ? 'lightsteelblue' : '#fff'))
        .style('stroke-width', () => '2px')
        .attr('cursor', 'pointer');
      nodeUpdate.select('text').style('fill-opacity', 1);
      console.log('node: ', node);
      // update the text
      node.select('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children || d._children ? -14 : 14))
        .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
        .text((d) => (d.data.name.length > 20 ? `${d.data.name.substring(0, 20)}...` : d.data.name));
      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition()
        .duration(this.duration)
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .remove();
      nodeExit.select('circle').attr('r', 1e-6);
      nodeExit.select('text').style('fill-opacity', 1e-6);
      // *************************** Links section *************************** //
      // Update the links…
      const link = this.container.selectAll('path.link').data(this.links, (d) => d.id);
      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return this.diagonal(o, o);
        })
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('stroke', '#ccc');
      // Transition links to their new position.
      const linkUpdate = linkEnter.merge(link);
      linkUpdate
        .transition()
        .duration(this.duration)
        .attr('d', (d) => this.diagonal(d, d.parent));
      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(this.duration)
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return this.diagonal(o, o);
        })
        .remove();
      // Stash the old positions for transition.
      this.nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
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
    childrenTree() {
      const tree = {
        name: 'root',
        children: this.getChildren(this.treeobject),
        value: 1,
      };
      return tree;
    },
    treemap() {
      return d3.tree().nodeSize([26, 240]);
    },
  },
  watch: {},
  mounted() {
    this.rootNodeId = this.childrenTree.value;
    this.initSvg(this.childrenTree);
  },
};
</script>

<style>
.treecontainer {
  width: 100%;
  height: 100%;
}
</style>
