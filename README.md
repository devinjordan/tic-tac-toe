# tic-tac-toe

## Issues I Struggled With
- Had a major bug for a while with the 'checkForWin' function in script.js.
  - The bug arised from defining a const 'board' as equal to an instance of the Gameboard() function. This was returning an object to me when I believed it to be an array. It turned out to be a pretty easy fix. I just ran the .getBoard() function on my 'board' variable to return an array of the current state of the board. I'm documenting it to carry this forward for learning purposes.