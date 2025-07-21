const canvas = document.getElementById('analogStopwatch');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startStopwatchBtn');
const pauseBtn = document.getElementById('pauseStopwatchBtn');
const resetBtn = document.getElementById('resetStopwatchBtn');
const digitalTimeEl = document.getElementById('digitalStopwatchTime');

let stopwatchInterval = null;
let stopwatchStart = null;
let stopwatchElapsed = 0;
let stopwatchRunning = false;
let spacebarDownTime = null;
let longPressTimeout = null;

function drawAnalogStopwatch(ms) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // Draw face
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, 2 * Math.PI);
    ctx.fillStyle = '#232142';
    ctx.shadowColor = '#6dd5fa';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Draw ticks
    for (let i = 0; i < 60; i++) {
        ctx.save();
        ctx.rotate((i * 6) * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, -120);
        ctx.lineTo(0, -130);
        ctx.strokeStyle = i % 5 === 0 ? '#ffb86c' : '#6dd5fa';
        ctx.lineWidth = i % 5 === 0 ? 4 : 2;
        ctx.stroke();
        ctx.restore();
    }
    // Draw numbers (minutes)
    ctx.font = 'bold 1.2rem Orbitron, Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 60) * Math.PI / 180;
        ctx.fillText(String(i * 5).padStart(2, '0'), Math.cos(angle) * 100, Math.sin(angle) * 100);
    }
    // Hands
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    // Minute hand
    ctx.save();
    ctx.rotate(((minutes % 60) * 6) * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -70);
    ctx.strokeStyle = '#ffb86c';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
    // Second hand
    ctx.save();
    ctx.rotate((seconds * 6 + centiseconds * 0.06) * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -110);
    ctx.strokeStyle = '#6dd5fa';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
    // Centisecond hand
    ctx.save();
    ctx.rotate((centiseconds * 6) * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -90);
    ctx.strokeStyle = '#20e3b2';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff4c4c';
    ctx.fill();
    ctx.restore();
}

function formatDigital(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateAnalogStopwatch() {
    let ms = stopwatchElapsed;
    if (stopwatchRunning) {
        ms += Date.now() - stopwatchStart;
    }
    drawAnalogStopwatch(ms);
    digitalTimeEl.textContent = formatDigital(ms);
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchStart = Date.now();
        stopwatchRunning = true;
        stopwatchInterval = setInterval(updateAnalogStopwatch, 10);
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchElapsed += Date.now() - stopwatchStart;
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        updateAnalogStopwatch();
    }
}

function resetStopwatch() {
    stopwatchElapsed = 0;
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    updateAnalogStopwatch();
}

startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
        spacebarDownTime = Date.now();
        longPressTimeout = setTimeout(() => {
            if (!stopwatchRunning) startStopwatch();
            spacebarDownTime = null;
        }, 400); // 400ms threshold for long press
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        if (longPressTimeout) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
            if (spacebarDownTime && Date.now() - spacebarDownTime < 400) {
                // Short press: stop if running
                if (stopwatchRunning) pauseStopwatch();
            }
            spacebarDownTime = null;
        }
    } else if (e.code === 'Enter') {
        resetStopwatch();
    }
});

updateAnalogStopwatch(); 