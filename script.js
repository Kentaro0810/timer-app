const timerDisplay = document.getElementById("timerDisplay");
const progressBar = document.getElementById("progressBar");
const minutesInput = document.getElementById("minutesInput");
const setButton = document.getElementById("setButton");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const statusMessage = document.getElementById("statusMessage");
const presetButtons = document.querySelectorAll(".preset-button");

let savedMinutes = Number(localStorage.getItem("timerMinutes")) || 25;
let totalSeconds = savedMinutes * 60;
let remainingSeconds = totalSeconds;
let timerId = null;
let isRunning = false;

minutesInput.value = savedMinutes;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressBar.style.width = `${progress}%`;

  document.title = `${formatTime(remainingSeconds)} - タイマー`;
}

function setTimer(minutes) {
  if (isRunning) {
    alert("タイマーを停止してから時間を変更してください");
    return;
  }

  if (minutes < 1 || minutes > 180 || isNaN(minutes)) {
    alert("1〜180分の間で入力してください");
    return;
  }

  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;

  localStorage.setItem("timerMinutes", minutes);

  statusMessage.textContent = `${minutes}分に設定しました`;
  statusMessage.classList.remove("finished");

  updateDisplay();
}

function startTimer() {
  if (isRunning) {
    return;
  }

  if (remainingSeconds <= 0) {
    remainingSeconds = totalSeconds;
  }

  isRunning = true;
  statusMessage.textContent = "タイマー実行中...";

  timerId = setInterval(() => {
    remainingSeconds--;

    updateDisplay();

    if (remainingSeconds <= 0) {
      finishTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
  isRunning = false;

  statusMessage.textContent = "一時停止中";
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;

  remainingSeconds = totalSeconds;

  statusMessage.textContent = "リセットしました";
  statusMessage.classList.remove("finished");

  updateDisplay();
}

function finishTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;

  remainingSeconds = 0;

  statusMessage.textContent = "時間になりました！";
  statusMessage.classList.add("finished");

  updateDisplay();
  playBeep();

  alert("時間になりました！");
}

function playBeep() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 880;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  oscillator.start();

  oscillator.stop(audioContext.currentTime + 0.3);
}

setButton.addEventListener("click", () => {
  const minutes = Number(minutesInput.value);
  setTimer(minutes);
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

presetButtons.forEach(button => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes);
    minutesInput.value = minutes;
    setTimer(minutes);
  });
});

updateDisplay();
