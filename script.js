const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ampmEl = document.getElementById('ampm');
const dateEl = document.getElementById('date');
const formatSwitch = document.getElementById('formatSwitch');
const secondsSwitch = document.getElementById('secondsSwitch');
const colonSeconds = document.getElementById('colon-seconds');
const themeBtn = document.getElementById('themeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const alarmTimeInput = document.getElementById('alarmTime');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const clearAlarmBtn = document.getElementById('clearAlarmBtn');
const alarmStatus = document.getElementById('alarmStatus');
const alarmSound = document.getElementById('alarmSound');
const timezoneEl = document.getElementById('timezone');
const quoteEl = document.getElementById('quote');
const quoteAuthorEl = document.getElementById('quote-author');

let is24Hour = false;
let showSeconds = true;
let alarmTime = null;
let alarmActive = false;
let alarmTimeout = null;
let theme = localStorage.getItem('theme') || 'dark';

function setTheme(newTheme) {
    document.body.classList.remove('light-theme', 'neon-theme');
    if (newTheme !== 'dark') document.body.classList.add(`${newTheme}-theme`);
    theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '🌙 Theme' : newTheme === 'light' ? '☀️ Theme' : '🟢 Neon';
}

function toggleTheme() {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('neon');
    else setTheme('dark');
}

themeBtn.addEventListener('click', toggleTheme);
setTheme(theme);

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

function updateClock() {
    fetch(`/api/time?format=${is24Hour ? '24' : '12'}`)
        .then(res => res.json())
        .then(data => {
            animateDigit(hoursEl, data.hours);
            animateDigit(minutesEl, data.minutes);
            animateDigit(secondsEl, data.seconds);
            ampmEl.textContent = is24Hour ? '' : data.ampm;
            dateEl.textContent = data.date;
            if (alarmActive && alarmTime === `${data.hours}:${data.minutes}` && (!showSeconds || data.seconds === '00')) {
                triggerAlarm();
            }
        })
        .catch(() => {
            // fallback to JS time if backend is unavailable
            const now = new Date();
            let hours = now.getHours();
            let ampm = '';
            if (!is24Hour) {
                ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
            }
            animateDigit(hoursEl, String(hours).padStart(2, '0'));
            animateDigit(minutesEl, String(now.getMinutes()).padStart(2, '0'));
            animateDigit(secondsEl, String(now.getSeconds()).padStart(2, '0'));
            ampmEl.textContent = is24Hour ? '' : ampm;
            dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            if (alarmActive && alarmTime === `${String(hours).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` && (!showSeconds || String(now.getSeconds()).padStart(2, '0') === '00')) {
                triggerAlarm();
            }
        });
    if (showSeconds) {
        secondsEl.style.display = '';
        colonSeconds.style.display = '';
    } else {
        secondsEl.style.display = 'none';
        colonSeconds.style.display = 'none';
    }
}

function animateDigit(el, newVal) {
    if (el.textContent !== newVal) {
        el.style.opacity = 0.3;
        setTimeout(() => {
            el.textContent = newVal;
            el.style.opacity = 1;
        }, 150);
    }
}

formatSwitch.addEventListener('change', () => {
    is24Hour = formatSwitch.checked;
    updateClock();
});

secondsSwitch.addEventListener('change', () => {
    showSeconds = secondsSwitch.checked;
    updateClock();
});

// Alarm logic
setAlarmBtn.addEventListener('click', () => {
    if (alarmTimeInput.value) {
        alarmTime = alarmTimeInput.value;
        alarmActive = true;
        alarmStatus.textContent = `Alarm set for ${alarmTime}`;
        alarmStatus.style.color = '#20e3b2';
    }
});

clearAlarmBtn.addEventListener('click', () => {
    alarmActive = false;
    alarmTime = null;
    alarmStatus.textContent = 'Alarm cleared';
    alarmStatus.style.color = '#ffb86c';
    alarmSound.pause();
    alarmSound.currentTime = 0;
    if (alarmTimeout) clearTimeout(alarmTimeout);
});

function triggerAlarm() {
    alarmActive = false;
    alarmStatus.textContent = '⏰ Alarm!';
    alarmStatus.style.color = '#ff4c4c';
    alarmSound.play();
    if (alarmTimeout) clearTimeout(alarmTimeout);
    alarmTimeout = setTimeout(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmStatus.textContent = '';
    }, 10000);
}

// Timezone display
function updateTimezone() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timezoneEl.textContent = `Timezone: ${tz}`;
}
updateTimezone();

// Quote of the day
async function fetchQuote() {
    try {
        const res = await fetch('https://api.quotable.io/random');
        const data = await res.json();
        quoteEl.textContent = `"${data.content}"`;
        quoteAuthorEl.textContent = `- ${data.author}`;
    } catch {
        quoteEl.textContent = 'Stay positive, work hard, make it happen!';
        quoteAuthorEl.textContent = '';
    }
}
fetchQuote();

// Ensure only digital clock logic is present and updateClock runs every second
setInterval(updateClock, 1000);
updateClock(); 