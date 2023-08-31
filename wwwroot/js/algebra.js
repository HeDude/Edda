
// Function to run after the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Fetching the JSON data for English algebra labels
    fetch("./model/skill_algebra_en.json")
        .then(response => response.json())
        .then(data => {
            let algebraDiv = document.querySelector("td.algebra");
            const labels = data.labels;
            let allChecked = Math.random() < 0.3; // 30% chance to check all checkboxes
            
            labels.forEach(label => {
                const checkboxDiv = document.createElement("div");
                checkboxDiv.className = "checkbox";
                
                const labelElement = document.createElement("label");
                labelElement.className = "algebra-label";
                
                const inputElement = document.createElement("input");
                inputElement.type = "checkbox";
                inputElement.value = "";
                
                // Randomly check or uncheck the checkbox
                if (allChecked || Math.random() < 0.5) {
                    inputElement.checked = true;
                }
                
                labelElement.appendChild(inputElement);
                labelElement.appendChild(document.createTextNode(" " + label));
                checkboxDiv.appendChild(labelElement);
                algebraDiv.appendChild(checkboxDiv);
            });
        })
        .catch(error => {
            console.error("An error occurred:", error);
        });
});
