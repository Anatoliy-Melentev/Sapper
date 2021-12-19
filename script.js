const
  boardSize = [10, 10],
  board = new Board(boardSize, 10);

let first = true;

board.table.addEventListener('click', ({target}) => {
  if (target.tagName === 'TD') {
    let curPoint = board.list[+target.dataset.id];

    if (curPoint.isOpen()) {
      return;
    }

    curPoint.openField();

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

    if (curPoint.isBomb()) {
      alert('Gameover')
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
          curMateMates = curMate.getMates(boardSize);

        curMate.openField();

        emptyMates = emptyMates.concat(curMateMates.filter(mate => {
          board.list[mate].isEmpty() &&
          !board.list[mate].isOpen() &&
          emptyMates.indexOf(mate) === -1
        }));
        debugger;
        countMates = countMates.concat(curMateMates.filter(mate => {
          board.list[mate].isCount() &&
          !board.list[mate].isOpen() &&
          countMates.indexOf(mate) === -1
        }));

      }



    }
  }
});