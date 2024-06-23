let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let questions = []; // JSON de preguntas cargado
let currentCellIndex = null; // Índice de la celda seleccionada

const cells = document.querySelectorAll("td");
const restartBtn = document.getElementById("restartBtn");

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(index));
});

restartBtn.addEventListener("click", restartGame);

fetch('preguntas.json') // Ajusta la ruta a tu archivo JSON si es necesario
  .then(response => response.json())
  .then(data => questions = data.preguntas)
  .catch(error => console.error('Error loading questions:', error));

function handleCellClick(cellIndex) {
  if (!gameActive) return;
  if (board[cellIndex] !== "") return;

  currentCellIndex = cellIndex;
  showQuestionModal();
}

function showQuestionModal() {
  const randomQuestionIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomQuestionIndex];

  document.getElementById('currentPlayerLabel').textContent = currentPlayer;
  document.getElementById('questionText').textContent = question.pregunta;
  const answerOptions = document.getElementById('answerOptions');
  answerOptions.innerHTML = "";

  question.opciones.forEach((opcion) => {
    const optionButton = document.createElement('button');
    optionButton.textContent = opcion;
    optionButton.classList.add('list-group-item', 'list-group-item-action');
    optionButton.addEventListener('click', () => handleAnswerClick(opcion, question.respuesta_correcta));
    answerOptions.appendChild(optionButton);
  });

  $('#questionModal').modal('show');
}

function handleAnswerClick(selectedAnswer, correctAnswer) {
  $('#questionModal').modal('hide');

  if (selectedAnswer === correctAnswer) {
    board[currentCellIndex] = currentPlayer;
    cells[currentCellIndex].textContent = currentPlayer;
    cells[currentCellIndex].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
      gameActive = false;
      setTimeout(() => alert(`¡Jugador ${currentPlayer} ha ganado!`), 100);
      return;
    }

    if (checkDraw()) {
      gameActive = false;
      setTimeout(() => alert("¡Empate!"), 100);
      return;
    }
  } else {
    alert(`Respuesta incorrecta. Turno del jugador ${currentPlayer === "X" ? "O" : "X"}`);
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin() {
  const winCondition = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];

  return winCondition.some(condition => 
    condition.every(index => board[index] === currentPlayer)
  );
}

function checkDraw() {
  return board.every(cell => cell !== "");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  currentCellIndex = null;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
}