const
  boardSize = [10, 10, 12],
  board = new Board(boardSize),
  reload = document.querySelector('.scored__reload'),
  offsetX = document.querySelector('.scored__offsetX'),
  offsetY = document.querySelector('.scored__offsetY'),
  bombCount = document.querySelector('.scored__bombs');

offsetX.value = boardSize[0];
offsetY.value = boardSize[1];
bombCount.value = boardSize[2];

let first = true;

reload.addEventListener('click', () => {
  board.reCreateBoard([
    offsetX.value >= 5 && offsetX.value <= 30 ? +offsetX.value : boardSize[0],
    offsetY.value >= 5 && offsetY.value <= 30 ? +offsetY.value : boardSize[1],
    bombCount.value >= 5 && bombCount.value <= 30 ? +bombCount.value : boardSize[2],
  ], 15);
  first = true;
});

board.game.addEventListener('click', ({target}) => {
  if (target.tagName === 'TD') {
    let curPoint = board.list[+target.dataset.id];

    if (curPoint.isOpen()) {
      return;
    }

    if (first) {
      first = false;
      board.generateMinefield(+target.dataset.id);

      board.list.forEach(field => {
        let mates = field.getMates(boardSize);

        let count = mates.reduce((sum, mate) => {
          if (board.list[mate].isBomb()) {
            sum++;
          }

          return sum;
        }, 0);

        if (!field.isBomb() && count > 0) {
          field.setCount(count);
        }
      });
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
        closeMates = curPoint.getMates(boardSize),
        emptyMates = closeMates.filter(mate => board.list[mate].isEmpty()),
        countMates = closeMates.filter(mate => board.list[mate].isCount());

      while (emptyMates.length) {
        let
          curId = emptyMates.shift(),
          curMate = board.list[curId],
          curMateMates = curMate.getMates(boardSize),
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