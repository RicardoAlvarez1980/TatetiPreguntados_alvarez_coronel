let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

const cells = document.querySelectorAll("td");

console.log(cells);

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick(event) {
  const cellIndex = Array.from(cells).indexOf(event.target);
  console.log(cellIndex);

  if (board[cellIndex] != "") {
    return;
  }

  board[cellIndex] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWin()) {
    console.log("Ganaste de nuevo");
  }

  currentPlayer = currentPlayer == "X" ? "O" : "X";
  /*
    if(currentPlayer == 'X'){
        currentPlayer = 'O'
    }
    else{
        currentPlayer = 'X'
    }
   */
}

function checkWin() {
  const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontales
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // veticales
    [0, 4, 8],
    [2, 4, 6], // diagonales
  ];

  for (let index = 0; index < winCondition.length; index++) {
    const winElement = winCondition[index];
    let isWin = true;
    for (let index2 = 0; index2 < winElement.length; index2++) {
      const posWin = winElement[index2];
      if (board[posWin] != currentPlayer) {
        isWin = false;
      }
    }
    if (isWin) {
      return true;
    }
  }

  return false;

  return winConditions.some((condition) => {
    return condition.every((index) => board[index] === currentPlayer);
  });
}
