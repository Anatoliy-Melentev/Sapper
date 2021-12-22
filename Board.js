class Board {
  constructor([offsetX, offsetY, bombCount]) {
    this.rowsCount = offsetY || 10;
    this.colsCount = offsetX || 10;
    this.bombCount = bombCount || ((offsetX + offsetX) / 2);
    this.list = [];
    this.game = document.querySelector('div.game__board');
    this.gameOver = document.querySelector('div.game__over');
    this.bombList = [];

    this.generateBoard();
  }
  generateBoard() {
    let tr, td, count = 0;
    this.table = document.createElement('table');

    for (let y = 0; y < this.rowsCount; y++) {
      tr = document.createElement('tr');
      for (let x = 0; x < this.colsCount; x++) {
        td = document.createElement('td');
        td.dataset.x = x;
        td.dataset.y = y;
        td.dataset.id = count;
        tr.appendChild(td);
        this.list.push(new Point([x,y]));
        count++;
      }
      this.table.appendChild(tr);
    }

    this.game.appendChild(this.table);
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  generateMinefield(curFieldId) {
    let bombId;
    this.bombList.push(curFieldId);
    while (this.bombList.length <= this.bombCount) {
      bombId = this.getRandomInt(this.rowsCount * this.colsCount);

      if (this.bombList.indexOf(bombId) < 0) {
        this.bombList.push(bombId);
        this.list[bombId].plantBomb();
      }
    }

    return this.bombList;
  }
  getBombs () {
    return this.bombList;
  }
  createMsg(text, over) {
    this.gameOver.innerHTML = text;
    this.gameOver.style.display = 'block';
    if (over) {
      this.gameOver.style.backgroundColor = 'red';
    }
  }
  reCreateBoard([offsetX, offsetY, bombCount]) {
    this.list = [];
    this.rowsCount = offsetX || 10;
    this.colsCount = offsetY || 10;
    this.bombCount = bombCount || ((offsetX + offsetX) / 2);
    this.table.remove();
    this.gameOver.style.display = 'none';
    this.gameOver.style.backgroundColor = 'white';

    this.generateBoard();
  }
};