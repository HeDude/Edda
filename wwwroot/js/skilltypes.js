
// Function to run after the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Fetching the JSON data
    fetch("./model/skilltypes.json")
        .then(response => response.json())
        .then(data => {
            const skillTypes = data.Skilltype;

            // Create the table and its elements
            const table = document.createElement("table");
            table.className = "skill-types-table";
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");
            table.appendChild(thead);
            table.appendChild(tbody);

            // Create table header based on the main types (Metacognitive, Affective, etc.)
            const headerRow = document.createElement("tr");
            for (const mainType of Object.keys(skillTypes)) {
                const th = document.createElement("th");
                th.innerText = mainType;
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);

            // Function to randomly select 1 to 4 main types and return them as an array
            function getRandomMainTypes(skillTypes) {
                const mainTypes = Object.keys(skillTypes);
                const numToSelect = Math.floor(Math.random() * 4) + 1; // Randomly select between 1 and 4 main types
                return mainTypes.sort(() => 0.5 - Math.random()).slice(0, numToSelect);
            }

            // Create table body (Subtypes)
            const maxSubtypes = Math.max(...Object.keys(skillTypes).map(key => Object.keys(skillTypes[key]).length));
            for (let i = 0; i < maxSubtypes; i++) {
                const row = document.createElement("tr");
                for (const mainType of Object.keys(skillTypes)) {
                    const td = document.createElement("td");
                    const subtypes = Object.keys(skillTypes[mainType]);
                    if (subtypes[i]) {
                        td.innerText = subtypes[i];
                    }
                    row.appendChild(td);
                }
                tbody.appendChild(row);
            }

            // Append the table to the container div with class "types"
            const typesDiv = document.querySelector(".types");
            typesDiv.appendChild(table);

            // Randomly highlight subtypes and their lower levels
            const randomMainTypes = getRandomMainTypes(skillTypes);
            for (const mainType of randomMainTypes) {
                const subtypes = Object.keys(skillTypes[mainType]);
                const randomSubtype = subtypes[Math.floor(Math.random() * subtypes.length)];
                const level = skillTypes[mainType][randomSubtype];
                for (const [subtype, subtypeLevel] of Object.entries(skillTypes[mainType])) {
                    if (subtypeLevel <= level) {
                        // Highlight this subtype and all subtypes under it with a lower level
                        // Assume each subtype text is unique in the table for simplicity
                        const cells = Array.from(document.querySelectorAll(`td`)).filter(cell => cell.innerText === subtype);
                        cells.forEach(cell => {
                            cell.classList.add("highlight");
                            cell.innerHTML = "&#x2713; " + cell.innerText;  // Add a check sign "✔" before the text
                        });
                    }
                }
            }
        })
        .catch(error => console.error("An error occurred:", error));
});
