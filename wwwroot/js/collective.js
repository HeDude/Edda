document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('buttonContainer');

    // Generate random number between 10 and 20
    const numOfButtons = Math.floor(Math.random() * 11) + 10;

    // List of words
    const words = ['single', 'peer', 'triade', 'group', 'team', 'class', 'cohort'];

    for (let i = 0; i < numOfButtons; i++) {
        const button = document.createElement('button');
        const textContainer = document.createElement('div'); // Container for text

        // Get random word from list
        const randomWord = words[Math.floor(Math.random() * words.length)];

        // Get random letter and number
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 65 is ASCII for 'A'
        const randomNumber = Math.floor(Math.random() * 10); // Gets a number between 0 and 9

        // Apply styles for centered text
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.alignItems = "center";
        textContainer.style.textAlign = "center";

        textContainer.innerHTML = `${randomWord}<br>${randomLetter}${randomNumber}`; // Set text content
        button.appendChild(textContainer); // Add the text container to the button

        button.addEventListener('click', function () {
            populateSmileys();
        });

        container.appendChild(button);
    }
});
