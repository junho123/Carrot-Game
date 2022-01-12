'use strict';

import * as sound from './sound.js';

const CARROT_SIZE = 80;
const CARROT_IMG_PATH = '../imgs/carrot.png';
const BUG_IMG_PATH = '../imgs/bug.png';

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameField = document.querySelector('.game__field');
    this.fieldRect = this.gameField.getBoundingClientRect();
    this.gameField.addEventListener('click', this.onClick);
  }

  init() {
    this.gameField.innerHTML = '';
    this._addItem('carrot', this.carrotCount, CARROT_IMG_PATH);
    this._addItem('bug', this.bugCount, BUG_IMG_PATH);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath) {
    let x1 = 0;
    let y1 = 0;
    let x2 = this.fieldRect.width - CARROT_SIZE;
    let y2 = this.fieldRect.height - CARROT_SIZE;

    // 이미지 생성
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);

      // 위치 적용
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;

      this.gameField.appendChild(item);
    }
  }

  onClick = (event) => {
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick('carrot');
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick('bug');
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
