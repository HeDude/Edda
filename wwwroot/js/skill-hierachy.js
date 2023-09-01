// Fetch the JSON data from the file
fetch('./model/skill.json')
    .then(response => response.json())
    .then(data => {
        // Function to check if an item has children
        function hasChildren(title) {
            return Object.values(data).some(item => item.parent === title);
        }

        // Function to build the menu recursively
        function buildMenu(parentId) {
            const items = Object.values(data).filter(item => item.parent === parentId);
            if (items.length === 0) return null;

            const ul = document.createElement('ul');
            ul.style.display = 'none'; // Initially hide the list

            items.forEach(item => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                const viewLink = document.createElement('a');
                const editLink = document.createElement('a');
                const editIcon = document.createElement('span');
                const moveIcon = document.createElement('span');

                viewLink.href = `https://api.hedude.com/goal/html/nl?title=${encodeURIComponent(item.title)}`;
                viewLink.target = "_blank";
                viewLink.innerHTML = "&#x1F441;"; // Eye icon
                viewLink.style.textDecoration = "none"; // Remove underline

                editLink.href = `./Skilleditor?title=${encodeURIComponent(item.title)}`;
                editLink.style.textDecoration = "none"; // Remove underline
                editIcon.innerHTML = "&#x270E;"; // Pencil icon
                editLink.appendChild(editIcon);

                moveIcon.innerHTML = "&#x2194;&#x2195;"; // Left-right-up-down arrows

                span.appendChild(viewLink);
                span.appendChild(document.createTextNode(" "));
                span.appendChild(editLink);
                span.appendChild(document.createTextNode(" "));
                span.appendChild(moveIcon);
                span.appendChild(document.createTextNode(" " + item.name));

                li.appendChild(span);

                if (hasChildren(item.title)) {
                    span.onclick = function () {
                        const childMenu = li.querySelector('ul');
                        if (childMenu) {
                            if (childMenu.style.display === 'block') {
                                childMenu.style.display = 'none';
                                span.lastChild.textContent = "+ " + item.name;
                            } else {
                                childMenu.style.display = 'block';
                                span.lastChild.textContent = "- " + item.name;
                            }
                        }
                    };
                    span.lastChild.textContent = "+ " + item.name;
                    const childMenu = buildMenu(item.title);
                    if (childMenu) {
                        li.appendChild(childMenu);
                    }
                } else {
                    const description = document.createElement('div');
                    description.innerHTML = `<i style="margin-left: 4em;">${item.description}</i>`;
                    li.appendChild(description);
                }

                ul.appendChild(li);
            });
            return ul;
        }

        // Build and display the menu
        const menu = document.getElementById('menu');
        const rootMenu = buildMenu(""); // Assuming root items have an empty parent
        if (rootMenu) {
            menu.appendChild(rootMenu);
            rootMenu.style.display = 'block'; // Show the root menu
        }
    })
    .catch(error => {
        console.error("Error fetching the JSON data:", error);
    });
