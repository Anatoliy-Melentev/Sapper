

const
  getEl = id => { return document.getElementById(id) },
  board = new Board();

getEl('reload').addEventListener('click', () => board.reCreateBoard());
getEl('bombs').addEventListener('input', () => board.reCreateBoard());
getEl('offx').addEventListener('input', () => board.reCreateBoard());
getEl('offy').addEventListener('input', () => board.reCreateBoard());

board.game.addEventListener('click', ({target}) => {
  if (target.tagName === 'TD') {
    let curPoint = board.list[+target.dataset.id];

    if (curPoint.isOpen()) {
      return;
    }

    if (board.getStart()) {
      board.setStart(false);
      board.generateMinefield(+target.dataset.id);
    }

    curPoint.openField();

    if (curPoint.isBomb()) {
      board.createMsg('Game Over!', true);
      let bombs = board.getBombs();
      bombs.forEach(bomb => {
        board.list[bomb].openField();
      });
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
  }
});

board.game.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'TD') {
    e.preventDefault();
    board.list[+e.target.dataset.id].setFlag();
  }
});