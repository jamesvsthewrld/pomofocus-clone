const timerDisplay = document.getElementById('timer-display');
const pomoBtn = document.getElementById('pomo-btn');
const shortBtn = document.getElementById('short-btn');
const longBtn = document.getElementById('long-btn');
const startBtn = document.getElementById('start-btn');
const pomoCountDisplay = document.getElementById('pomo-count');
const focusString = document.getElementById('focus-string');
const sound = new Audio('click-sound.mp3');
const alarm = new Audio('alarm-sound.mp3'); 
let isRunning = false;
let interval;
let timeleft = 1500;
let pomoCount = 0; 
let currentMode = 'pomodoro'; 

const updateTimer = () => {
    const minutes = Math.floor(timeleft / 60);
    const seconds = timeleft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const resetMode = (time, mode) => {
    startBtn.classList.remove('pressed');
    clearInterval(interval);
    isRunning = false;
    timeleft = time;
    currentMode = mode;
    updateTimer();
    startBtn.textContent = 'Start';
};

const setActiveButton = (activeBtn) => {
    [pomoBtn, shortBtn, longBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
};

pomoBtn.addEventListener('click', () => resetMode(1500, 'pomodoro'));
shortBtn.addEventListener('click', () => resetMode(300, 'short'));
longBtn.addEventListener('click', () => resetMode(900, 'long'));

const startTimer = () => {
    interval = setInterval(() => {
        if (timeleft > 0) {
            timeleft--;
            updateTimer();
        } else {
            clearInterval(interval);
            isRunning = false;
            startBtn.textContent = 'Start';
            startBtn.classList.remove('pressed');
            alarm.play();

            if (currentMode === 'pomodoro') {
                pomoCount++;
                pomoCountDisplay.textContent = pomoCount;
                updateFocusString(pomoCount); 
                if (pomoCount % 4 === 0) {
                    // Every 4th pomodoro, take a long break
                    resetMode(900, 'long');
                    setActiveButton(longBtn);
                } else {
                    // Otherwise, take a short break
                    resetMode(300, 'short');
                    setActiveButton(shortBtn);
                }
            } else {
                resetMode(1500, 'pomodoro');
                setActiveButton(pomoBtn);
            }
        }
    }, 1);
};

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startBtn.textContent = 'Stop';
        startBtn.classList.add('pressed');
        sound.play();
        isRunning = true;
        startTimer();
    } else {
        startBtn.textContent = 'Start';
        startBtn.classList.remove('pressed');
        sound.play();
        isRunning = false;
        clearInterval(interval);
    }
});

document.querySelectorAll('.timer-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.timer-nav .nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.code === 'Space' || e.key === ' ') {
        startBtn.click();
    }
});

function updateFocusString(count) {
    const totalMinutes = count * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        focusString.textContent = `(${hours} hour${hours > 1 ? 's' : ''} and ${minutes} min of focus)`;
    } else if (hours > 0) {
        focusString.textContent = `(${hours} hour${hours > 1 ? 's' : ''} of focus)`;
    } else {
        focusString.textContent = `(${minutes} min of focus)`;
    }
}
