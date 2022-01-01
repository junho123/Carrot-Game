"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 3;
const BUG_COUNT = 3;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpMessage = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const carrotSound = new Audio("../sound/carrot_pull.mp3");
const alertSound = new Audio("../sound/alert.wav");
const bgSound = new Audio("../sound/bg.mp3");
const bugSound = new Audio("../sound/bug_pull.mp3");
const winSound = new Audio("../sound/game_win.mp3");

let started = false;
let timer = undefined;
let score = 0;

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText("REPLAY?🙄");
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WON~!👍" : "YOU LOST🤢");
}

function initGame() {
  gameScore.innerHTML = CARROT_COUNT;
  score = 0;
  field.innerHTML = "";

  addItem("carrot", CARROT_COUNT, "../img/carrot.png");
  addItem("bug", BUG_COUNT, "../img/bug.png");
}

function addItem(className, count, imgPath) {
  // 위치를 알아야한다
  const x1 = 0;
  const y1 = 0;

  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    // 이미지를 생성
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);

    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.remove("fa-play");
  icon.classList.add("fa-stop");
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;

  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    if (gameScore.outerText === "0") {
      clearInterval(timer);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerHTML = `${minutes}:${seconds}`;
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function onFieldClick(event) {
  if (!started) {
    return;
  }

  const target = event.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();

    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

function stopGameTimer() {
  clearInterval(timer);
}

function showPopUpWithText(text) {
  popUpMessage.innerHTML = text;
  popUp.classList.remove("pop-up--hide");
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

function updateScoreBoard() {
  gameScore.innerHTML = CARROT_COUNT - score;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
