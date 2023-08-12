document.addEventListener("DOMContentLoaded", function () {
    populateSmileys();
});

function populateSmileys() {
    fetch('./model/smiley.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('smileyContainer');

            // Clear the existing content
            container.innerHTML = '';

            const numOfSmileys = Math.floor(Math.random() * 36) + 1;

            for (let i = 0; i < numOfSmileys; i++) {
                // Generate a random five-digit number
                const randomFiveDigitNumber = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

                const smileyWrapper = document.createElement('div');
                smileyWrapper.className = 'smileyWrapper';

                const numberElement = document.createElement('div');
                numberElement.className = 'numberOverlay';
                numberElement.innerText = randomFiveDigitNumber.toString();
                smileyWrapper.appendChild(numberElement);

                const smileySVG = createSmileySVG(data);
                smileyWrapper.appendChild(smileySVG);

                container.appendChild(smileyWrapper);
            }
        })
        .catch(error => {
            console.error("Error fetching smileys:", error);
        });
}

function createSmileySVG(smileyData) {
    const smileyConfig = smileyData[Math.floor(Math.random() * smileyData.length)];
    const smileySVG = createSVG('svg', { viewBox: "0 0 32 32", class: "smiley", width: "64", height: "64" });
    smileySVG.innerHTML = `
        <circle cx="16" cy="16" r="15" fill="${smileyConfig.fillColor}" />
        ${smileyConfig.eyes.join(' ')}
        ${smileyConfig.mouth}
    `;

    return smileySVG;
}

function createSVG(tag, attributes) {
    const namespace = "http://www.w3.org/2000/svg";
    const element = document.createElementNS(namespace, tag);

    for (const attribute in attributes) {
        element.setAttributeNS(null, attribute, attributes[attribute]);
    }

    return element;
}
