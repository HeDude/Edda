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

// Handle drop action on canvas
canvas.addEventListener('drop', function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);
    const clone = draggedElement.cloneNode(true);  // Clone the dragged element

    // Get canvas's bounding box
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate position relative to the canvas
    const relativeLeft = event.clientX - canvasRect.left;
    const relativeTop = event.clientY - canvasRect.top;

    clone.className = "resourceClonedItem";  // Apply the new class to make the clone visible

    clone.style.position = 'absolute';
    clone.style.left = relativeLeft + 'px';
    clone.style.top = relativeTop + 'px';

    clone.addEventListener('click', function () {
        clone.remove();  // Remove element when clicked
    });

    canvas.appendChild(clone);  // Append the clone to canvas
});



