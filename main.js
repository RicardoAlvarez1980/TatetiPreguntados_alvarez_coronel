let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true; // Variable para controlar si el juego está activo o no

const cells = document.querySelectorAll("td");

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick(event) {
  if (!gameActive) return; // Si el juego no está activo, salimos de la función

  const cellIndex = Array.from(cells).indexOf(event.target);

  if (board[cellIndex] !== "") {
    return;
  }

  board[cellIndex] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    gameActive = false; // Desactivamos el juego

    setTimeout(() => {
      alert(`¡Jugador ${currentPlayer} ha ganado!`);
    }, 100); // Mostrar alert después de 100ms para que se vea el último movimiento

    return;
  }

  if (checkDraw()) {
    gameActive = false; // Desactivamos el juego si hay empate

    setTimeout(() => {
      alert("¡Empate!");
    }, 100); // Mostrar alert después de 100ms para que se vea el último movimiento

    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin() {
  const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontales
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // verticales
    [0, 4, 8],
    [2, 4, 6], // diagonales
  ];

  for (let index = 0; index < winCondition.length; index++) {
    const winElement = winCondition[index];
    let isWin = true;
    for (let index2 = 0; index2 < winElement.length; index2++) {
      const posWin = winElement[index2];
      if (board[posWin] !== currentPlayer) {
        isWin = false;
        break;
      }
    }
    if (isWin) {
      return true;
    }
  }

  return false;
}

function checkDraw() {
  return board.every((cell) => cell !== ""); // Retorna true si todas las celdas están llenas (empate)
}
