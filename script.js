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
let isSelectingWinner = false;
let targetAngle = 0;

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

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

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
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        spinning = false;
        isSelectingWinner = false;
    }
    spin();
});

window.addEventListener("keydown", function(event) {
    if (spinning) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        spinning = false;
        isSelectingWinner = false;
    }

    if (event.key === "1") {
        spinToColor(true);
    } else if (event.key === "2") {
        spinToColor(false);
    }
});

function spinToColor(isWhite) {
    if (spinning || names.length === 0) return;
    
    spinning = true;
    isSelectingWinner = false;
    const spinTime = 5000;
    const startTime = Date.now();

    targetAngle = Math.random() * Math.PI * 2 + Math.PI * 12;
    const adjustedAngle = (targetAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const segmentIndex = Math.floor((names.length - adjustedAngle / segmentAngle) % names.length);
    
    if ((segmentIndex % 2 === 0) !== isWhite) {
        targetAngle += segmentAngle;
    }

    const startAngle = spinAngle;
    const angleToRotate = targetAngle - (startAngle % (Math.PI * 2));

    document.querySelector('.curved-text-image').style.display = 'none';

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const easedProgress = easeOutCubic(progress);
        
        spinAngle = startAngle + (angleToRotate * easedProgress);
        drawWheelAtAngle(spinAngle);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            spinning = false;
            if (!isSelectingWinner) {
                selectWinner();
            }
        }
    }

    animate();
}

function spin() {
    if (spinning || names.length === 0) return;

    spinning = true;
    isSelectingWinner = false;
    const spinTime = 5000;
    const startTime = Date.now();
    
    targetAngle = Math.random() * Math.PI * 2 + Math.PI * 12;
    const startAngle = spinAngle;
    const angleToRotate = targetAngle - (startAngle % (Math.PI * 2));

    document.querySelector('.curved-text-image').style.display = 'none';

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const easedProgress = easeOutCubic(progress);
        
        spinAngle = startAngle + (angleToRotate * easedProgress);
        drawWheelAtAngle(spinAngle);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            spinning = false;
            if (!isSelectingWinner) {
                selectWinner();
            }
        }
    }

    animate();
}

function selectWinner() {
    if (isSelectingWinner) return;
    isSelectingWinner = true;

    const adjustedAngle = (spinAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor((names.length - adjustedAngle / segmentAngle) % names.length);
    const winner = names[winningIndex];

    winners.push(winner);
    updateResultsBox();
    updateWinnerCount();

    setTimeout(() => {
        isSelectingWinner = false;
        spinning = false;
    }, 100);
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