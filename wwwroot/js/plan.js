var canvas;
var canvasContext;
var funCircle = { x: 200, y: 150, size: 0, angle: 0, color: "red", text: "Playful" };
var quickCircle = { x: 400, y: 350, size: 0, angle: 0, color: "green", text: "Quick" };
var easyCircle = { x: 600, y: 150, size: 0, angle: 0, color: "blue", text: "Simple" };
var circleAngle = 0;
var stopAnimation = false;
var typeTextTitle = { x: 400, y: 60, fontsize: 60, full: "Soon", slice: "" }
var typeTextTop = { x: 400, y: 180, fontsize: 40, full: "Create", slice: "" }
var typeTextMiddle = { x: 400, y: 220, fontsize: 40, full: "your own", slice: "" }
var typeTextBottom = { x: 400, y: 260, fontsize: 40, full: "learning plan", slice: "" }

window.onload = learning_plan();

function learning_plan() {
    canvas = document.getElementById("learning_plan");
    canvas.width = 800;
    canvas.height = 600;
    canvasContext = canvas.getContext("2d");
    var framerate = 30;
    setInterval(drawAnimation, 1000 / framerate);
}

function fillContext() {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function drawAnimation() {
    if (stopAnimation) {
        return true;
    }
    fillContext();
    if
        (
        typeWriter(typeTextTitle)
        ||
        typeWriter(typeTextTop)
        ||
        typeWriter(typeTextMiddle)
        ||
        typeWriter(typeTextBottom)
        ||
        drawCircle(funCircle)
        ||
        drawCircle(quickCircle)
        ||
        drawCircle(easyCircle)
    ) {
        return false;
    }
    stopAnimation = true;
    console.log("finished");
}

function typeWriter(text) {
    canvasContext.fillStyle = "white";
    canvasContext.font = text.fontsize + "px Georgia";
    var metrics = canvasContext.measureText(text.slice);
    canvasContext.fillText(text.slice, text.x - metrics.width / 2, text.y);

    if (text.slice.length >= text.full.length) {
        return false;
    }

    text.slice += text.full.charAt(text.slice.length);
    return true;
}

function drawCircle(circle) {
    canvasContext.fillStyle = circle.color;
    canvasContext.beginPath();
    canvasContext.arc(circle.x, circle.y, circle.size, 0, circle.angle, false);
    canvasContext.fill();

    if (circle.angle >= Math.PI * 2) {
        canvasContext.fillStyle = "white";
        canvasContext.font = "40px Georgia";
        var metrics = canvasContext.measureText(circle.text);
        canvasContext.fillText(circle.text, circle.x - metrics.width / 2, circle.y + 10);
        return false;
    }

    circle.size += 2;
    circle.angle += Math.PI * 0.06;
    return true;
}