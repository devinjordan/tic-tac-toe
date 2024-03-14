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

  // useful for DOM manipulation in later functions
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
      score: 0,
    },
    {
      name: playerTwoName,
      marker: '',
      score: 0,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

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
        if (rowTotal == winningScore || colTotal == winningScore) {
          winner = true;
          return winner;
        }
      }
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

  const playRound = (playerRow, playerColumn) => {
    let results = {
      win: false,
      tie: false,
      player: activePlayer,
      error: false,
    }
    
    do {
      if (board.markSpot(playerRow, playerColumn, activePlayer.marker)) {
        break;
      } else {
        results.error = true;
        return results;
      };
    } while (true);


    if (checkForWin()) {
      results.win = true;
    } else {
      turnCounter++;
    }

    if (turnCounter == 9) {
      results.tie = true;
    }
    if (results.win == false && results.tie == false) {
      switchPlayerTurn();
    }
    return results;
  };

  const reset = () => {
    turnCounter = 0;
    activePlayer = players[0];
    const currentBoard = board.getBoard();
    currentBoard.forEach((row) => {
      row.forEach((cell) =>{
        cell.addMark("");
      })
    })
  }

  return {
    players,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    reset,
    playerOneName,
    playerTwoName,
  };
}

function ScreenController () {
  const game = gameController();

  const boardDiv = document.querySelector('.game-board');
  const resultsArea = document.querySelector('.results-area');

  const playerOne = game.players[0];
  const playerTwo = game.players[1];

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = '';

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
      addResetButton(result.player);
      boardDiv.removeEventListener('click', clickHandlerBoard);
      updateScore(result.player);

    } else if (result.tie == true) {
      console.log('Tie game!');
      addResetButton(result.player);
      boardDiv.removeEventListener('click', clickHandlerBoard);

    } else if (result.error == true) {
      boardDiv.style.backgroundColor = 'red';
      
    } else if (result.error == false) {
      boardDiv.style.backgroundColor = 'white';
    };
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  function updateScore (player) {
    const scoreOne = resultsArea.querySelector('#score-one');
    const scoreTwo = resultsArea.querySelector('#score-two');

    // initializing score for losing player
    if (playerOne.score == 0 && playerTwo.score == 0) {
      scoreOne.textContent = 0;
      scoreTwo.textContent = 0;
    }

    if (player.name == playerOneTitle.textContent) {
    scoreOne.textContent = player.score + 1;
    player.score++;
    } else if (player.name == playerTwoTitle.textContent) {
    scoreTwo.textContent = player.score + 1;
    player.score++;
    }
  }

  function addResetButton (player) {
    const congrats = document.createElement('h2');
    congrats.id = 'congrats';
    congrats.textContent = `${player.name}, you won!`;
    resultsArea.appendChild(congrats);

    const reset = document.createElement('button');
    reset.classList.add('reset');
    reset.textContent = 'Play again?';
    reset.addEventListener('click', () => {
      game.reset();
      updateScreen();
      boardDiv.addEventListener('click', clickHandlerBoard);
      resultsArea.removeChild(reset);
      resultsArea.removeChild(congrats);
    });
    resultsArea.appendChild(reset);
  }

  // player marker selection and load game board
  const selectDiv = document.querySelector('.selection');
  const selectionButtons = document.querySelectorAll('.selector');
  const playerOneTitle = resultsArea.querySelector('#player-one');
  const playerTwoTitle = resultsArea.querySelector('#player-two');

  selectionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.id == 'X') {
        playerOne.name = 'Player X';
        playerTwo.name = 'Player O';
        playerOne.marker = 'X';
        playerOneTitle.textContent = playerOne.name;
        playerTwo.marker = 'O';
        playerTwoTitle.textContent = playerTwo.name;
      } else {
        playerOne.name = 'Player O';
        playerTwo.name = 'Player X';
        playerOne.marker = 'O';
        playerOneTitle.textContent = playerOne.name;
        playerTwo.marker = 'X';
        playerTwoTitle.textContent = playerTwo.name;
      }
      updateScreen();
      selectDiv.style.height = '0px';
    });
  });

};

ScreenController();
