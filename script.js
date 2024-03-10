const Gameboard = (function () {

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

  const getBoard = () => board;

  const printBoard = () => {
    board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithMarks);
  }

  return {
    getBoard,
    printBoard,
  }

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

function newPlayer (marker) {
  let score = 0;
  return {
    marker,
    score
  };
};

function gameController (
  playerOneName = "Player X",
  playerTwoName = "Player O",
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: 'X',
    },
    {
      name: playerTwoName,
      marker: 'O',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  }
}

