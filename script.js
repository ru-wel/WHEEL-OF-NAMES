let names = [];
let winners = [];
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let spinning = false;
let spinAngle = 0;
let segmentAngle = 0;
const centerX = 380;
const centerY = 380;
const radius = 465;
canvas.width = 765;
canvas.height = 765; 
let animationFrameId;

function toggleTab(tab) {
    const entriesTab = document.getElementById("entriesTab");
    const resultsTab = document.getElementById("resultsTab");
    const entriesBoxContainer = document.getElementById("entriesBoxContainer");
    const resultsBoxContainer = document.getElementById("resultsBoxContainer");
    const underline = document.getElementById("underline");

    if (tab === "entries") {
        entriesTab.classList.add("active");
        resultsTab.classList.remove("active");
        entriesBoxContainer.style.display = "block";
        resultsBoxContainer.style.display = "none";
        underline.style.left = "0";
    } else {
        entriesTab.classList.remove("active");
        resultsTab.classList.add("active");
        entriesBoxContainer.style.display = "none";
        resultsBoxContainer.style.display = "block";
        underline.style.left = "50%";
    }
}

function loadNames() {
    const entries = document.getElementById("entriesBox").value.trim();
    names = entries ? entries.split("\n").map(name => name.trim()).filter(name => name) : [];
    segmentAngle = (2 * Math.PI) / names.length;
    updateEntryCount();
    drawWheel();
    
    spinInitialAnimation();
}

function drawWheel() {
    if (names.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < names.length; i++) {
        const angle = i * segmentAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + segmentAngle);
        ctx.closePath();

        ctx.fillStyle = i % 2 === 0 ? "#FFFFFF" : "#000000";
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = i % 2 === 0 ? "#000000" : "#FFFFFF";
        ctx.font = "85px 'Quicksand', sans-serif";
        ctx.fillText(names[i], radius * 0.5, 25);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function spinInitialAnimation() {
    if (spinning || names.length === 0) return;

    spinning = true;
    const spinSpeed = 0.005;

    function animate() {
        spinAngle += spinSpeed;
        drawWheelAtAngle(spinAngle);
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

canvas.addEventListener("click", function() {
    if (spinning) {
        cancelAnimationFrame(animationFrameId);
        spinning = false;
        spin();
    }
});

function spin() {
    if (spinning || names.length === 0) return;

    spinning = true;
    const spinTime = 3000;
    const spinSpeed = 0.15;
    const startTime = Date.now();

    document.querySelector('.curved-text-image').style.display = 'none';

    function animate() {
        const elapsed = Date.now() - startTime;
        spinAngle += spinSpeed;

        if (elapsed < spinTime) {
            drawWheelAtAngle(spinAngle);
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            selectWinner();
        }
    }

    animate();
}

function drawWheelAtAngle(angle) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();
}

function selectWinner() {
    const adjustedAngle = (spinAngle % (2 * Math.PI));
    const winningIndex = Math.floor((names.length - adjustedAngle / segmentAngle) % names.length);
    const winner = names[winningIndex];

    winners.push(winner);
    updateResultsBox();
    updateWinnerCount();

    alert(`The winner is: ${winner}!`);
}

function updateResultsBox() {
    const resultsBox = document.getElementById("resultsBox");
    resultsBox.value = winners.join("\n");
}

function updateEntryCount() {
    document.getElementById("entriesCount").textContent = names.length;
}

function updateWinnerCount() {
    document.getElementById("resultsCount").textContent = winners.length;
}

document.getElementById("entriesBox").addEventListener("input", loadNames);

window.onload = function() {
    const defaultNames = "LIGHT\nDARK\nLIGHT\nDARK\nLIGHT\nDARK";
    document.getElementById("entriesBox").value = defaultNames;
    loadNames();
};
