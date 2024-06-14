let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let questions = []; // Variable para almacenar las preguntas
let currentQuestion = null; // Variable para almacenar la pregunta actual

const cells = document.querySelectorAll("td");
const restartBtn = document.getElementById("restartBtn");
const questionModal = new bootstrap.Modal(document.getElementById('questionModal'));
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('options');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');

// Cargar preguntas desde el archivo JSON
fetch('preguntas.json')
  .then(response => response.json())
  .then(data => {
    questions = data.preguntas;
  });

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

restartBtn.addEventListener("click", restartGame);
submitAnswerBtn.addEventListener("click", checkAnswer);

function handleClick(event) {
  if (!gameActive) return;

  const cellIndex = Array.from(cells).indexOf(event.target);

  if (board[cellIndex] !== "") {
    return;
  }

  board[cellIndex] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    gameActive = false;
    showQuestion();
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    setTimeout(() => {
      alert("¡Empate!");
    }, 100);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin() {
  const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
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
  return board.every((cell) => cell !== "");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
}

function showQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];
  questionText.textContent = currentQuestion.pregunta;
  optionsContainer.innerHTML = "";
  currentQuestion.opciones.forEach(opcion => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("form-check");
    optionElement.innerHTML = `
      <input class="form-check-input" type="radio" name="option" value="${opcion}" id="${opcion}">
      <label class="form-check-label" for="${opcion}">
        ${opcion}
      </label>
    `;
    optionsContainer.appendChild(optionElement);
  });
  questionModal.show();
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert("Por favor selecciona una opción.");
    return;
  }

  const userAnswer = selectedOption.value;
  if (userAnswer === currentQuestion.respuesta_correcta) {
    alert(`¡Jugador ${currentPlayer} ha ganado!`);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    alert(`Respuesta incorrecta. ¡Jugador ${currentPlayer} ha ganado!`);
  }

  questionModal.hide();
  restartGame();
}