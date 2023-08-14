// Sample data
var nodes = [
    { name: "Skill A", level: 1, status: "achieved" },
    { name: "Skill B", level: 1, status: "achieved" },
    { name: "Skill C", level: 2, status: "achieved" },
    { name: "Skill D", level: 2, status: "working" },
    { name: "Skill E", level: 3, status: "working" },
    { name: "Skill F", level: 4, status: "todo" },
    { name: "Skill G", level: 4, status: "todo" }
];

var links = [
    { source: 0, target: 2, activity: "Activity 1" },
    { source: 0, target: 3, activity: "Activity 2" },
    { source: 1, target: 2, activity: "Activity 3" },
    { source: 2, target: 4, activity: "Activity 4" },
    { source: 3, target: 4, activity: "Activity 5" },
    { source: 4, target: 5, activity: "Activity 6" },
    { source: 4, target: 6, activity: "Activity 7" }
];

var svg = d3.select("#neural_network"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Arrowheads and gradient definition
var defs = svg.append("defs");

defs.selectAll("marker")
    .data(["end"])
    .enter().append("marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");

// Adjust the 'y' position for the first two nodes to ensure they don't start overlapped
nodes[0].fy = height / 2 - 80;  // Push the first node slightly up
nodes[1].fy = height / 2 + 80;  // Push the second node slightly down

var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(250).strength(1))
    .force("charge", d3.forceManyBody().strength(-1200))
    .force("x", d3.forceX(function (d) {
        return width * d.level / 5;
    }).strength(1))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(100));  // Add a collision force with a radius of 100

var link = svg.append("g")
    .selectAll("path")
    .data(links)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 3);

var linkText = svg.append("g")
    .selectAll("text")
    .data(links)
    .enter().append("text")
    .attr("font-size", "12px")
    .attr("dy", "-1em")
    .text(function (d) { return d.activity; });

// Neuron representation with dendrites
var neuron = svg.append("g")
    .attr("class", "neurons")
    .selectAll(".neuron")
    .data(nodes)
    .enter().append("g");

// Add octagonal shape around the neuron
neuron.append("polygon")
    .attr("points", "-45,0 -35,-35 0,-45 35,-35 45,0 35,35 0,45 -35,35")
    .attr("fill", "#a8d8ea");

neuron.append("circle")
    .attr("r", 30)
    .attr("fill", function (d) {
        switch (d.status) {
            case "achieved":
                return "green";
            case "working":
                return "#42a5f5";  // blue
            case "todo":
                return "red";
            default:
                return "#42a5f5";  // default to blue
        }
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

// Dendrites mimicking a splitting pattern
// Dendrites cover the end of the thick curve
const dendriteVariations = [
    { d1: "M 0 -30 Q 15 -45, 20 -60", d2: "M 20 -59 Q 10 -75, 5 -90", d3: "M 20 -59 Q 30 -75, 35 -90", stroke: 8 },
    { d1: "M 0 30 Q -15 45, -20 60", d2: "M -20 59 Q -10 75, -5 90", d3: "M -20 59 Q -30 75, -35 90", stroke: 8 },
    { d1: "M -30 0 Q -45 15, -60 20", d2: "M -59 20 Q -75 10, -90 5", d3: "M -59 20 Q -75 30, -90 35", stroke: 8 },
    { d1: "M 30 0 Q 45 -15, 60 -20", d2: "M 59 -20 Q 75 -10, 90 -5", d3: "M 59 -20 Q 75 -30, 90 -35", stroke: 8 }
];

dendriteVariations.forEach(variation => {
    neuron.append("path")
        .attr("d", variation.d1)
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", variation.stroke)
        .attr("fill", "none");
    neuron.append("path")
        .attr("d", variation.d2)
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", variation.stroke / 2)
        .attr("fill", "none");
    neuron.append("path")
        .attr("d", variation.d3)
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", variation.stroke / 2)
        .attr("fill", "none");
});

var nodeText = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("font-size", "14px")
    .attr("dy", ".35em")
    .text(function (d) { return d.name; })
    .attr("text-anchor", "middle");

simulation.on("tick", function () {
    link
        .attr("d", function (d) {
            return "M" + d.source.x + "," + d.source.y + " C" + (d.source.x + d.target.x) / 2 + "," + d.source.y + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y + " " + d.target.x + "," + d.target.y;
        });

    linkText
        .attr("x", function (d) { return (d.source.x + d.target.x) / 2; })
        .attr("y", function (d) { return (d.source.y + d.target.y) / 2; });

    neuron
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    nodeText
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; });
});
