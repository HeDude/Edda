document.addEventListener("DOMContentLoaded", function () {
    populateSmileys();
});

function populateSmileys() {
    fetch('./model/smiley.json')
        .then(response => response.json())
        .then(data => {
            const numOfSmileys = Math.floor(Math.random() * 36) + 1;
            const nodes = Array.from({ length: numOfSmileys }, (_, i) => {
                const randomFiveDigitNumber = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
                const smileyConfig = data[Math.floor(Math.random() * data.length)];
                return {
                    id: i,
                    number: randomFiveDigitNumber,
                    smileyConfig: smileyConfig
                };
            });

            applyForceSimulation(nodes);
        })
        .catch(error => {
            console.error("Error fetching smileys:", error);
        });
}

const width = 800;
const height = 600;
const svg = d3.select("#smileyContainer").append("svg")
    .attr("width", width)
    .attr("height", height);

function generateRandomLinks(nodes) {
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Add a link with a 20% probability
            if (Math.random() < 0.2) {
                links.push({
                    source: nodes[i].id,
                    target: nodes[j].id,
                    thickness: Math.floor(Math.random() * 19) + 2  // Random value between 2 and 20
                });
            }
        }
    }
    return links;
}

function applyForceSimulation(nodes) {
    const links = generateRandomLinks(nodes);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(50))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(50))
        .on("tick", ticked);

    svg.selectAll(".socialLink")
        .data(links)
        .enter().append("line")
        .attr("class", "socialLink")
        .attr("stroke", d => {
            if ((d.thickness >= 2 && d.thickness <= 5) || (d.thickness >= 16 && d.thickness <= 20)) {
                return "red";
            } else if (d.thickness >= 10 && d.thickness <= 12) {
                return "green";
            } else {
                return "lightblue";
            }
        })
        .attr("stroke-width", d => d.thickness)  // Set the stroke thickness
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    function ticked() {
        // Handling links
        const link = svg.selectAll(".socialLink")
            .data(links);

        link.enter().append("line")
            .attr("class", "socialLink")
            .attr("stroke", "white");

        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        link.exit().remove();

        // Handling smiley groups
        const smileyGroups = svg.selectAll(".smileyGroup")
            .data(nodes);

        const newSmileyGroups = smileyGroups.enter()
            .append("g")
            .attr("class", "smileyGroup");

        smileyGroups.attr("transform", d => `translate(${d.x}, ${d.y})`);

        smileyGroups.exit().remove();

        // Circle inside the group
        newSmileyGroups.append("circle")
            .attr("class", "socialNode")
            .attr("r", 32)
            .attr("fill", d => d.smileyConfig.fillColor)
            .attr("stroke", d => {
                // Check if the node has any associated links
                const linked = links.some(link => link.source.id === d.id || link.target.id === d.id);
                return linked ? "none" : "red";  // If no links, set stroke to red
            })
            .attr("stroke-width", d => {
                // Check if the node has any associated links
                const linked = links.some(link => link.source.id === d.id || link.target.id === d.id);
                return linked ? 0 : 3;  // If no links, set stroke width to 3
            });

        // Eyes inside the group
        newSmileyGroups.append("g")
            .attr("class", "socialEyes")
            .attr("transform", "translate(-16, -16)") // Offset from the group's center
            .html(d => d.smileyConfig.eyes.join(' '));

        // Mouth inside the group
        newSmileyGroups.append("g")
            .attr("class", "socialMouth")
            .attr("transform", "translate(-16, -16)") // Offset from the group's center
            .html(d => d.smileyConfig.mouth);

        // Number above the circle inside the group
        newSmileyGroups.append("text")
            .attr("class", "socialNumberOverlay")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("fill", "white")
            .attr("dy", "-40")  // This moves the text above the circle
            .text(d => d.number);
    }
}
