import * as d3 from 'd3';

export class NetworkSimulator {
  nodesData;
  linksData;
  charge;
  distance;
  width;
  height;
  onCircleClick;
  simulation;

  constructor(charge, distance, width, height, onCircleClick) {

    this.charge = charge;
    this.distance = distance;
    this.width = width;
    this.height = height;
    this.onCircleClick = onCircleClick;

    let svg = d3.select('#actor-network');
    let g = svg.append('g')
      .attr('class', 'everything');


    // ARROW
    const marker = svg.append('defs').append('marker')
      .attr('id','arrowhead')
      .attr('viewBox','-0 -5 10 10')
      .attr('refX',13)
      .attr('refY',0)
      .attr('orient','auto')
      .attr('markerWidth',13)
      .attr('markerHeight',13)
      .attr('xoverflow','visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#ccc')
      .style('stroke','none');

  }

  deleteGraph() {
    d3.select('#actor-network').select('.everything')
      .selectAll('*')
      .remove();
  }

  stopSimulation() {
    this.simulation?.stop();
  }

  createGraph(graph) {
    const that = this;
    that.nodesData = graph['nodes'].map(d => Object.create(d));
    that.linksData = graph['links'].map(d => Object.create(d));
    that.deleteGraph();
    that.stopSimulation();

    let svg = d3.select('#actor-network');
    //  .attr('width', width)
    //  .attr('height', height);

    const randomNumber = Math.floor(Math.random() * 100);
    console.log('makenetwork', svg);
    that.simulation = d3.forceSimulation(that.nodesData);
    // Add forces, we're going to add a charge to each node, also going to add a centering force
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(that.linksData)
      .id(({ id: i }) => i)
      .distance(that.distance);
    that.simulation
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('center', d3.forceCenter())
      .on('tick', tickActions);  // Add tick actions    .on('tick', tickActions);  // Add tick actions

    let g = svg.select('.everything'); // Add encompassing group for the zoom



    //LINKS
    let link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(that.linksData)
      .enter()
      .append('line')
      .style("stroke","#ccc")
      .attr('marker-end','url(#arrowhead)')

    ;

    //LINK LABELS


    //NODES
    let node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(that.nodesData)
      .enter()
      .append('g');

    let circles = node.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', function (d) {
        return d.color;
      })
      .style('stroke', d => d.stroke);

    let labels = node.append('text')
      .text(function (d) {
        return d.name;
      })
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em');

    // Maybe use title (shows at mouseover label) if names are too long
    node.append('title')
      .text(function (d) {
        return 'd.name';
      });

    // Add drag capabilities
    let drag_handler = d3.drag()
      .on('start', drag_start)
      .on('drag', drag_drag)
      .on('end', drag_end);

    drag_handler(node);
    node.on('click', clicked);
    let zoom_handler = d3.zoom()
      .on('zoom', zoomActions); // Add zoom capabilities
    zoom_handler(svg);

    /** Functions **/

    function drag_start(event, d) {
      if (!event.active) {
        that.simulation.alphaTarget(0.03)
          .restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    // Make sure you can't drag the circle outside the box
    function drag_drag(event, d) {

      d.fx = event.x;
      d.fy = event.y;

    }

    function drag_end(event, d) {
      if (!event.active) that.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function clicked(event, d) {
      d3.select(this)
        .select('circle')
        .transition()
        .attr('r', d.r * 2)
        .transition()
        .attr('r', d.r);
      that.onCircleClick(d.id);
    }

    function zoomActions(event) {
      g.attr('transform', event.transform);
    }

    function tickActions() {
      that.simulation.nodes(that.nodesData);
      link
        .attr('x1', function (d) {
          return d.source.x || 0;
        })
        .attr('y1', function (d) {
          return d.source.y || 0;
        })
        .attr('x2', function (d) {
          return d.target.x || 0;
        })
        .attr('y2', function (d) {
          return d.target.y || 0;
        });
      node.attr('transform', function (d) {
        d.fy = null;
        d.fx = null;
        return `translate(${d.x},${d.y})`;
      });
    }

  }
}
