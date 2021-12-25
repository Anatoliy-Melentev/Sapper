const
  getEl = id => { return document.getElementById(id) },
  reloadEl = getEl('reload'),
  board = new Board(),
  setFlag = e => {
    if (e.target.tagName !== 'TD') {
      return;
    }
    e.preventDefault();
    board.list[+e.target.dataset.id].setFlag();
  },
  openField = e => {
    if (e.target.tagName !== 'TD') {
      return;
    }
    const curPoint = board.list[+e.target.dataset.id];

    if (curPoint.isOpen()) {
      return;
    }

    if (board.getStart()) {
      board.setStart(false);
      board.generateMinefield(+e.target.dataset.id);
    }

    curPoint.openField();

    if (curPoint.isBomb()) {
      board.createMsg('Game Over!', true);
      board.getBombs().forEach(bomb => board.list[bomb].openField());
    }

    if (curPoint.isEmpty()) {
      let
        closeMates = curPoint.getMates([board.colsCount, board.rowsCount]),
        emptyMates = closeMates.filter(mate => board.list[mate].isEmpty()),
        countMates = closeMates.filter(mate => board.list[mate].isCount());

      while (emptyMates.length) {
        let
          curId = emptyMates.shift(),
          curMate = board.list[curId],
          curMateMates = curMate.getMates([board.colsCount, board.rowsCount]),
          emptyMateMates = curMateMates.filter(mate => {
            return board.list[mate].isEmpty() && !board.list[mate].isOpen() && emptyMates.indexOf(mate) === -1;
          }),
          countMateMates = curMateMates.filter(mate => {
            return board.list[mate].isCount() && !board.list[mate].isOpen() && countMates.indexOf(mate) === -1;
          });

        curMate.openField();
        emptyMates = [...emptyMates,...emptyMateMates];
        countMates = [...countMates,...countMateMates];
      }

      while (countMates.length) {
        board.list[countMates.shift()].openField();
      }
    }
    if (board.checkWin()) {
      board.createMsg('You are champion!');
    }
  };

reloadEl.addEventListener('click', () => board.reCreateBoard());
getEl('bombs').addEventListener('input', () => board.reCreateBoard());
getEl('offx').addEventListener('input', () => board.reCreateBoard());
getEl('offy').addEventListener('input', () => board.reCreateBoard());
getEl('tools').addEventListener('click', () => getEl('toolsmenu').classList.toggle('visually-hidden'));

board.game.addEventListener('click', e => openField(e));
board.game.addEventListener('contextmenu', e => setFlag(e));

let time;
reloadEl.addEventListener('touchstart', e => {
  time = setTimeout(() => openField(e), 500);
})
reloadEl.addEventListener('touchend', e => {
  clearTimeout(time);
  setFlag(e);
})