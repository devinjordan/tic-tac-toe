const createGameboard = (function () {

  // Use nested loops to create a 3x3 array
  // One array with 3 rows--arrays--with 3 cells each
  const rows = 3;
  const columns = 3;
  const board = [];
  for ( i = 0; i < rows; i++ ) {
    board[i] = [];
    for ( j = 0; j < columns; j++ ) {
      board[i].push(makeCell());
    }
  }

  // const printGameboard = () => {
    const boardWithMarks = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithMarks);
  // };


})();

function makeCell() {
  let value = 0;
  
  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue
  };
};

