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
    if (currentSpot === "") {
      board[row][column].addMark(player);
      marked = true;
    } else {
      console.log('That spot is taken!');
    }
    return marked;
  }

  const getBoard = () => board;


  return {
    getBoard,
    markSpot,
  }

};

function makeCell() {
  let value = "";

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
  playerOneName = "Player 1",
  playerTwoName = "Player 2",
) {
  const board = Gameboard();
  const currentBoard = board.getBoard();
  let turnCounter = 0;

  const players = [
    // Set markers to values for easier win condition check with math
    // A win for p2 will be a total of 6, for p1 a total of 15
    // No other combination will reach these totals
    {
      name: playerOneName,
      marker: '',
    },
    {
      name: playerTwoName,
      marker: '',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;


  // const promptPlayer = () => {
  //   const playerColumn = parseInt(prompt(`${getActivePlayer().name}, select a column.`));
  //   const playerRow = parseInt(prompt(`${getActivePlayer().name}, select a row.`));
  //   return {playerColumn, playerRow};
  // }

  const checkForWin = () => {
    const marker = getActivePlayer().marker;
    const winningScore = marker.repeat(3);
    let winner = false;
    // horizontals + verticals
    for (let i = 0; i < 3; i++) {
      let rowTotal = '';
      let colTotal = '';  
      for (let j = 0; j < 3; j++) {
        rowTotal += currentBoard[i][j].getValue();
        colTotal += currentBoard[j][i].getValue();
        console.log(winningScore, rowTotal, colTotal);
        if (rowTotal == winningScore || colTotal == winningScore) {
          winner = true;
          return winner;
        }
      }
      // console.log('rt: ' + rowTotal, 'ct: ' + colTotal);
    }

    // diagonals
    const forward = currentBoard[0][0].getValue()
    + currentBoard[1][1].getValue()
    + currentBoard[2][2].getValue();

    const backward = currentBoard[0][2].getValue()
    + currentBoard[1][1].getValue()
    + currentBoard[2][0].getValue();

    if (forward == winningScore || backward == winningScore) {
      winner = true;
      return winner;
    };
  }

  // Refactored this into the turn counter
    // const checkForTie = () => {
    //   let tie = false;
    //   let boardTotal = 0;
    //   for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       boardTotal += currentBoard[i][j].getValue();
    //     }
    //   }
    //   if (boardTotal > 28) {
    //     tie = true;
    //     return tie;
    //   }
    // }

  const playRound = (playerRow, playerColumn) => {
    do {
      // const { playerRow, playerColumn } = promptPlayer();
      console.log(
        `Marking spot with ${activePlayer.name}'s symbol...`
      );
      if (board.markSpot(playerRow, playerColumn, activePlayer.marker)) {
        break;
      } else {
        return;
      };
    } while (true);

    let results = {
      win: false,
      tie: false,
      player: activePlayer.name,
    }

    if (checkForWin()) {
      results.win = true;
    } else {
      turnCounter++;
    }
    console.log(turnCounter);

    if (turnCounter == 9) {
      results.tie = true;
    }
    if (results.win == false && results.tie == false) {
      switchPlayerTurn();
    }
    return results;
    // playRound();
  };

  const reset = () => {
    turnCounter = 0;
    // playRound.results.win = false;
    // playRound.results.tie = false;
    activePlayer = players[0];
    // const newBoard = Gameboard();
    const currentBoard = board.getBoard();
    currentBoard.forEach((row) => {
      row.forEach((cell) =>{
        cell.addMark("");
      })
    })
  }

  // playRound();

  return {
    players,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    reset,
  };
}

function ScreenController () {
  const game = gameController();

  const boardDiv = document.querySelector('.game-board');
  const resultsArea = document.querySelector('.results-area');
  // let activePlayer = game.getActivePlayer();


  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = '';
    // resultsArea.textContent = '';

    // get the latest version of the board with player input
    const board = game.getBoard();

    // display the updated board
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;

    let result = game.playRound(selectedRow, selectedCol, game.getActivePlayer());
    
    // inform win and reset
    if (result.win == true) {
      console.log(`${result.player}, you have won!`);
      addResetButton();
      boardDiv.removeEventListener('click', clickHandlerBoard);

    } else if (result.tie == true) {
      console.log('Tie game!');
      addResetButton();
      boardDiv.removeEventListener('click', clickHandlerBoard);
    };
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  function addResetButton () {
    const reset = document.createElement('button');
    reset.classList.add('reset');
    reset.textContent = 'Play again?';
    reset.addEventListener('click', () => {
      game.reset();
      updateScreen();
      boardDiv.addEventListener('click', clickHandlerBoard);
      resultsArea.removeChild(reset);
    });
    resultsArea.appendChild(reset);
  }

  // player marker selection and load game board
  const selectDiv = document.querySelector('.selection');
  const selectionButtons = document.querySelectorAll('.selector');
  selectionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.id == 'X') {
        game.players[0].marker = 'X';
        game.players[1].marker = 'O';
      } else {
        game.players[0].marker = 'O';
        game.players[1].marker = 'X';
      }
      updateScreen();
      selectDiv.style.height = '0px';
    });
  });

};

ScreenController();
