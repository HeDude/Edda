// Load the main menu from config.json
fetch('./model/resource.json')
    .then(response => response.json())
    .then(data => {
        populateResourceMainMenu(data.type);
    })
    .catch(error => {
        console.error('Error loading config:', error);
    });

// Function to populate the main menu
function populateResourceMainMenu(types) {
    const mainMenu = document.getElementById('resourceMainMenu');
    types.forEach(type => {
        const menuItem = document.createElement('div');
        menuItem.className = 'resourceMenuItem';
        menuItem.textContent = type;
        menuItem.addEventListener('click', () => {
            loadResourceSubMenu(type);
        });
        mainMenu.appendChild(menuItem);
    });
}

// Function to load and populate the submenu
function loadResourceSubMenu(type) {
    const filename = `./model/${type}_nl.json`; // Assuming filename pattern
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            populateResourceSubMenu(data);
        })
        .catch(error => {
            console.error(`Error loading ${filename}:`, error);
        });
}

// Function to show object details in a popup
function showObjectDetails(key, itemData) {
    const popup = document.getElementById("resourceInfoPopup");
    let content = '<button id="closePopup">&#10005;</button>';  // Using HTML entity for 'X'
    content += '<div class="content">';
    content += "<h3>" + itemData.title + "</h3>";
    Object.keys(itemData).forEach(detail => {
        content += "<strong>" + detail + ":</strong> " + itemData[detail] + "<br>";
    });
    content += '</div>';
    popup.innerHTML = content;
    popup.style.display = "block";

    // Add click event to "X" button to close the popup
    document.getElementById("closePopup").addEventListener("click", () => {
        popup.style.display = "none";
    });
}



// Modify populateResourceSubMenu to include click event for showing object details
function populateResourceSubMenu(items) {
    const subMenu = document.getElementById("resourceSubMenu");
    subMenu.innerHTML = ''; // Clear previous items
    Object.keys(items).forEach(key => {
        const menuItem = document.createElement('div');
        menuItem.id = "resourceMenuItem_" + key;  // Assign a unique ID based on key
        menuItem.className = 'resourceMenuItem';
        menuItem.textContent = items[key].title;
        menuItem.draggable = true;
        menuItem.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', key);
        });
        menuItem.addEventListener('click', () => {
            showObjectDetails(key, items[key]);
        });
        subMenu.appendChild(menuItem);
    });
}

// Handle drag start event
document.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', event.target.id);
});

// Allow drop action on canvas
const canvas = document.getElementById('resourceCanvas');  // Assuming 'resourceCanvas' is the id of your canvas div
canvas.addEventListener('dragover', function (event) {
    event.preventDefault();
});

let canvasItems = [];  // Store the coordinates and element references of items dropped into the canvas

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

canvas.addEventListener('drop', function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);
    const clone = draggedElement.cloneNode(true);

    // Get canvas's bounding box
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate position relative to the canvas
    const relativeLeft = event.clientX - canvasRect.left;
    const relativeTop = event.clientY - canvasRect.top;

    clone.className = 'resourceClonedItem';
    clone.style.position = 'absolute';
    clone.style.left = relativeLeft + 'px';
    clone.style.top = relativeTop + 'px';

    clone.addEventListener('click', function () {
        const nodeId = clone.id.replace('resourceMenuItem_', '');  // Extract node ID from clone ID
        d3.select(`#node_${nodeId}`).remove();  // Remove corresponding D3 circle (node)
        clone.remove();  // Remove the clone
        updateD3Graph();
    });

    canvas.appendChild(clone);
})

// Initialize D3 SVG canvas
const svg = d3.select("#resourceCanvas")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);

let nodes = []; // Array to store nodes
let links = []; // Array to store links between nodes

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Function to add a new node
function addNode(x, y, label) {
    const node = { x, y, label };
    nodes.push(node);
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .attr("fill", "blue");
}

// Function to add a new link
function addLink(source, target) {
    const link = { source, target };
    links.push(link);
    svg.append("line")
        .attr("x1", source.x)
        .attr("y1", source.y)
        .attr("x2", target.x)
        .attr("y2", target.y)
        .attr("stroke", "black");
}

// Drop event to add a new node and possibly new links
document.getElementById("resourceCanvas").addEventListener('drop', function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');

    // Get SVG canvas's bounding box
    const canvasRect = svg.node().getBoundingClientRect();

    // Calculate position relative to the SVG canvas
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    // Add the new node
    addNode(x, y, data);

    // Randomly add links to previously added nodes
    const newNode = nodes[nodes.length - 1];
    nodes.slice(0, -1).forEach((existingNode, i) => {
        if (getRandomInt(2) === 1) {
            addLink(newNode, existingNode);
        }
    });
});

// Add drag behavior to the circles
const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

svg.selectAll("circle").call(drag);  // Attach drag behavior to existing circles

function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d3.select(this).attr("cx", d.x).attr("cy", d.y);
}

function dragended(event, d) {
    d3.select(this).attr("stroke", null);
    // Check if the node is outside the canvas and remove it if so
    const canvasRect = svg.node().getBoundingClientRect();
    if (d.x < 0 || d.x > canvasRect.width || d.y < 0 || d.y > canvasRect.height) {
        d3.select(this).remove();
    }
}

// Function to update the D3 graph
function updateD3Graph() {
    // Update links
    const link = svg.selectAll(".link")
        .data(links)
        .join("line")
        .attr("class", "link");

    // Update nodes
    const node = svg.selectAll(".node")
        .data(nodes)
        .join("circle")
        .attr("class", "node")
        .attr("r", 10);

    // Update text labels
    const text = svg.selectAll(".nodeText")
        .data(nodes)
        .join("text")
        .attr("class", "nodeText")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => d.label);

    // Apply force simulation
    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text.attr("x", d => d.x)
            .attr("y", d => d.y);
    }
}