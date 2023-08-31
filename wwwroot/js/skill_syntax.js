
// Function to populate syntax fields
function populateSyntaxFields(data) {
    let syntaxDiv = document.querySelector('.syntax');

    let whoLabel = document.createElement('label');
    whoLabel.textContent = data.who.label + ':';
    whoLabel.setAttribute('for', 'who');
    syntaxDiv.appendChild(whoLabel);

    let whoInput = document.createElement('input');
    whoInput.setAttribute('class', 'form-control-static');
    whoInput.setAttribute('list', 'learners');
    whoInput.setAttribute('id', 'who');
    whoInput.setAttribute('name', 'who');
    syntaxDiv.appendChild(whoInput);

    let whoDatalist = document.createElement('datalist');
    whoDatalist.setAttribute('id', 'learners');
    data.who.options.forEach(option => {
        let whoOption = document.createElement('option');
        whoOption.setAttribute('value', option);
        whoDatalist.appendChild(whoOption);
    });
    syntaxDiv.appendChild(whoDatalist);
    syntaxDiv.appendChild(document.createElement('br'));
    syntaxDiv.appendChild(document.createElement('br'));

    // Other fields
    ['verb', 'when', 'with', 'what', 'which', 'how'].forEach(field => {
        let label = document.createElement('label');
        label.textContent = data[field].label + ':';
        label.setAttribute('for', field);
        syntaxDiv.appendChild(label);

        if (field === 'verb') {
            let select = document.createElement('select');
            select.setAttribute('name', field);
            data[field].options.forEach(option => {
                let optionElement = document.createElement('option');
                optionElement.setAttribute('value', option.value);
                optionElement.textContent = option.label;
                select.appendChild(optionElement);
            });
            syntaxDiv.appendChild(select);
        } else {
            let input = document.createElement('input');
            input.setAttribute('class', 'form-control-static resize_with_content');
            input.setAttribute('type', 'text');
            input.setAttribute('name', field);
            input.setAttribute('value', data[field].default);
            syntaxDiv.appendChild(input);
        }
        syntaxDiv.appendChild(document.createElement('br'));
        syntaxDiv.appendChild(document.createElement('br'));
    });
}

// Fetch JSON and populate syntax
fetch('./model/skill_syntax_en.json')
    .then(response => response.json())
    .then(data => populateSyntaxFields(data))
    .catch(error => {
        console.error('An error occurred:', error);
    });
