const Gameboard = function () {

  // Use nested loops to create a 3x3 array
  // One array with 3 rows--arrays--with 3 cells each
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++ ) {
    board[i] = [];
    for (let j = 0; j < columns; j++ ) {
      board[i].push(makeCell());
    }
  }

  const markSpot = (row, column, player) => {
    let marked = false;
    const currentSpot = board[row][column].getValue();
    if (currentSpot === 0) {
      board[row][column].addMark(player);
      marked = true;
    } else {
      console.log('That spot is taken!');
    }
    return marked;
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithMarks = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithMarks);
  }

  return {
    getBoard,
    printBoard,
    markSpot,
  }

};

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
    // Set markers to values for easier win condition check with math
    // A win for p2 will be a total of 6, for p1 a total of 15
    // No other combination will reach these totals
    {
      name: playerOneName,
      marker: 5,
    },
    {
      name: playerTwoName,
      marker: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  }

  const promptPlayer = () => {
    const playerColumn = parseInt(prompt(`${getActivePlayer().name}, select a column.`));
    const playerRow = parseInt(prompt(`${getActivePlayer().name}, select a row.`));
    return {playerColumn, playerRow};
  }

  const checkForWin = (board) => {
    const marker = getActivePlayer().marker;
    const winningScore = marker * 3;
    let winner = false;
    // horizontals + verticals
    for (let i = 0; i < 3; i++) {
      let rowTotal = 0;
      // let colTotal = 0;  
      for (let j = 0; j < 3; j++) {
        rowTotal += board[i][j].getValue();
        // colTotal += board[j][i].getValue();
        if (rowTotal == winningScore) {
          winner = true;
          return winner;
        }
      }
    }
    // console.log('rt: ' + rowTotal, 'ct: ' + colTotal);
  }

  const playRound = () => {
    do {
      const { playerRow, playerColumn } = promptPlayer();
      console.log(
        `Marking spot with ${getActivePlayer().name}'s symbol...`
      );
      if (board.markSpot(playerColumn, playerRow, getActivePlayer().marker)) {
        break;
      };
    } while (true);

    if (checkForWin(board)) {
      return console.log(`${getActivePlayer().name}, you have won!`);
    };

    switchPlayerTurn();
    printNewRound();
    playRound();
  };

  printNewRound();
  playRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = gameController();

