import * as d3 from 'd3';

export function createGraph(graph, charge, distance, width, height, onCircleClick) {

  let nodes_data = graph['nodes'].map(d => Object.create(d));
  let links_data = graph['links'].map(d => Object.create(d));
  d3.select('#actor-network').selectAll("*")
    .remove();

  let svg = d3.select('#actor-network')
 //  .attr('width', width)
 //  .attr('height', height);


  console.log('makenetwork',svg)


  let simulation = d3.forceSimulation(nodes_data);
  // Add forces, we're going to add a charge to each node, also going to add a centering force
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links_data).id(({id: i}) => i).distance(distance);
  simulation
  .force("link", forceLink)
      .force("charge", forceNode)
      .force("center",  d3.forceCenter())
      .on('tick', tickActions).restart();  // Add tick actions    .on('tick', tickActions);  // Add tick actions

  let g = svg.append('g')
    .attr('class', 'everything'); // Add encompassing group for the zoom

  let link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links_data)
    .enter()
    .append('line');

  let node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodes_data)
    .enter()
    .append('g');

  let circles = node.append('circle')
    .attr('r', (d) => d.r)
    .attr('fill', function (d) {
      return d.color;
    })
    .style("stroke", d => d.stroke );

  let labels = node.append('text')
    .text(function (d) {
      return d.name;
    })
    .attr('x', 0)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');

  // Maybe use title (shows at mouseover label) if names are too long
  node.append('title').text(function(d) { return 'd.name'; });

  // Add drag capabilities
  let drag_handler = d3.drag()
    .on('start', drag_start)
    .on('drag', drag_drag)
    .on('end', drag_end);

  drag_handler(node);
  node.on("click", clicked);
  let zoom_handler = d3.zoom()
    .on('zoom', zoomActions); // Add zoom capabilities
  zoom_handler(svg);

  /** Functions **/

  function drag_start(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0.03)
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
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function clicked(event, d){
    d3.select(this).select("circle").transition()
      .attr("r", d.r * 2)
      .transition()
      .attr("r", d.r)
    onCircleClick(d.id)
    console.log("hier",event,d)
  }

  function zoomActions(event) {
    g.attr('transform', event.transform);
  }

  function tickActions() {
    simulation.nodes(nodes_data);
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
      d.fy = null
      d.fx = null
      return `translate(${d.x},${d.y})`;
    });
  }

}
