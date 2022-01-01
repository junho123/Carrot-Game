"use strict";

import Field from "./field.js";
import * as sound from "./sound.js";

export default class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
      this.started = !this.started;
    });

    this.gameField = new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.timer = undefined;
    this.score = 0;
  }

  init() {
    this.score = 0;
    this.gameScore.innerHTML = this.carrotCount;
    this.gameField.init();
  }

  start() {
    this.init();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackGround();
  }

  stop() {
    this.stopGameTimer();
    this.hideGameButton();
    this.gameFinishBanner.showWithText("REPLAY?");
    sound.playAlert();
    sound.stopBackGround();
    this.onGameStop && this.onGameStop("cancel");
  }

  finish(win) {
    this.stopGameTimer();
    this.hideGameButton();
    if (win) {
      sound.playWin();
    } else {
      sound.playBug();
    }
    sound.stopBackGround();
    this.onGameStop && this.onGameStop(win ? "win" : "lose");
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.score++;
      this.updateScoreBoard();

      if (this.score === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === "bug") {
      this.finish(false);
    }
  };

  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;

    // 시작 전 업데이트
    this.updateTimerText(remainingTimeSec);

    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.finish();
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    this.gameTimer.innerHTML = `${minutes}:${seconds}`;
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showStopButton() {
    const icon = document.querySelector(".fas");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-stop");
  }

  updateScoreBoard() {
    this.gameScore.innerHTML = this.carrotCount - this.score;
  }
}
