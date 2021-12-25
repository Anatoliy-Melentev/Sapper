class Board {
  constructor() {
    this.start = true;
    this.list = [];
    this.colsCount = this.getOffsetX();
    this.rowsCount = this.getOffsetY();
    this.bombCount = this.getBombsCount();
    this.game = this.getEl('board');
    this.gameOver = this.getEl('gameover');
    this.bombList = [];

    this.generateBoard();
  }
  getStart() {
    return this.start;
  }
  setStart(start) {
    this.start = start;
  }
  getOffsetX(){
    return this.getValue('offx', 10);
  }
  getOffsetY(){
    return this.getValue('offy', 10);
  }
  getBombsCount(){
    return this.getValue('bombs', (this.getOffsetX() + this.getOffsetY()) * 0.7);
  }
  getValue(name, defaultValue) {
    const
      el = this.getEl(name),
      min = +el.getAttribute('min'),
      max = +el.getAttribute('max');

    return +el.value >= min && +el.value <= max ? +el.value : defaultValue;
  }
  getEl(id) {
    return document.getElementById(id);
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
    this.bombList = [];
    this.bombList.push(curFieldId);
    while (this.bombList.length <= this.bombCount) {
      bombId = this.getRandomInt(this.rowsCount * this.colsCount);

      if (this.bombList.indexOf(bombId) < 0) {
        this.bombList.push(bombId);
        this.list[bombId].plantBomb();
      }
    }

    this.generateNumberfield()
  }
  generateNumberfield() {
    this.list.forEach(field => {
      let
        mates = field.getMates([this.colsCount, this.rowsCount]),
        count = mates.reduce((sum, mate) => {
          if (board.list[mate].isBomb()) sum++;

          return sum;
        }, 0);

      if (!field.isBomb() && count > 0) {
        field.setCount(count);
      }
    });
  }
  getBombs () {
    return this.bombList;
  }
  checkWin() {
    let emptyClose = this.list.findIndex(el => {
      return !el.isBomb() && !el.isOpen();
    })
    return emptyClose < 0;
  }
  createMsg(text, over) {
    this.gameOver.innerHTML = text;
    this.gameOver.style.display = 'block';
    if (over) {
      this.gameOver.style.backgroundColor = 'red';
    }
  }
  reCreateBoard() {
    this.list = [];
    this.start = true;
    this.colsCount = this.getOffsetX();
    this.rowsCount = this.getOffsetY();
    this.bombCount = this.getBombsCount();
    this.table.remove();
    this.gameOver.style.display = 'none';
    this.gameOver.style.backgroundColor = 'white';

    this.generateBoard();
  }
};