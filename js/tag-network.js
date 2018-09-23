var script = document.createElement("script"); //Make a script DOM node
script.src = "https://d3js.org/d3.v4.min.js"; //Set it's src to the provided URL
document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(50).strength(0.25))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("/js/tag-data.json", function(error, graph) {
  if (error) throw error;

  var nodes = graph.nodes,
      nodeById = d3.map(nodes, function(d) { return d.id; }),
      links = graph.links,
      bilinks = [];

  links.forEach(function(link) {
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  svg.append("svg:defs").selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M1,-5L10,0L0,5");

  var link = svg.selectAll(".link")
      .data(bilinks)
      .enter().append("path")
      .attr("class", "link").attr("stroke-width", function(d) { return 1; }).attr("marker-end", "url(#end)");

  var node = svg.selectAll(".node")
      .data(nodes.filter(function(d) { return d.id; }))
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return 2 + 100*d.posts.split("\n").length / graph.links.length; } )
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


  node.append("title")
    .text(function(d) { return "| "+d.id.toUpperCase() + "\n" + d.posts; });

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  d3.select("div#tagnet")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    .classed("svg-content-responsive", true);

  function ticked() {
    link
      .attr("d", positionLink);

    node
      .attr("transform", positionNode);
  }
});

function positionLink(d) {
  return "M" + Math.max(5, Math.min(width - 5, d[0].x)) + "," + Math.max(5, Math.min(height - 5, d[0].y))
    + "S" + Math.max(5, Math.min(width - 5, d[1].x)) + "," + Math.max(5, Math.min(height - 5, d[1].y))
    + " " + Math.max(5, Math.min(width - 5, d[2].x)) + "," + Math.max(5, Math.min(height - 5, d[2].y));
}

function positionNode(d) {
  return "translate(" + Math.max(5, Math.min(width - 5, d.x)) + "," + Math.max(5, Math.min(height - 5, d.y)) + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}
