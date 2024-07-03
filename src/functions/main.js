function musicaInicio() {
  document.addEventListener('DOMContentLoaded', (event) => {
    // Reproducir música al cargar la página
    var audio = document.getElementById('music')
    audio.pause();


    // Obtener el botón
    var botonMusica = document.getElementById('botonMusica');


    // Definir el comportamiento al hacer clic en el botón
    var musicaActiva = false;
    botonMusica.addEventListener('click', function () {
      if (musicaActiva) {
        audio.pause();
        musicaActiva = false;
        botonMusica.innerHTML = 'MÚSICA: NO';
      } else {
        audio.play();
        musicaActiva = true;
        botonMusica.innerHTML = 'MÚSICA: SI';
      }
    });
  });

  var botonEfecto = document.getElementById('botonEfecto');
  var efectosActivos = true; // Por defecto, los efectos están activos
  
  botonEfecto.addEventListener('click', function() {
    if (efectosActivos) {
      efectosActivos = false;
      botonEfecto.innerHTML = 'EFECTOS: NO';
    } else {
      efectosActivos = true;
      botonEfecto.innerHTML = 'EFECTOS: SI';
    }
  });


};
musicaInicio();

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let questions = []; // JSON de preguntas cargado
let currentCellIndex = null; // Índice de la celda seleccionada

const cells = document.querySelectorAll("td");
const restartBtn = document.getElementById("restartBtn");

// Sonidos
const tizaSound = document.getElementById("tizaSound");
const restartSound = document.getElementById("restartSound");
const pop = document.getElementById("pop");


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
    
      pop.play();
    
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
    // Agregar animación solo la primera vez que se escribe en la celda
    if (!cells[currentCellIndex].classList.contains('animated')) {
      cells[currentCellIndex].textContent = currentPlayer;
      cells[currentCellIndex].classList.add('animated', currentPlayer.toLowerCase());

      // Reproducir sonido dependiendo del jugador actual
      if (currentPlayer === "X" || "O") {
        tizaSound.play();
      }
    } else {
      cells[currentCellIndex].textContent = currentPlayer;
      cells[currentCellIndex].classList.add(currentPlayer.toLowerCase());
    }

    // Mostrar el botón de reinicio si se ha ocupado al menos una celda después de reiniciar
    if (board.some(cell => cell !== "")) {
      document.getElementById("restartBtn").classList.add("show");
      document.getElementById("restartBtn").style.display = "block";
      document.getElementById("restartBtn").style.margin = "0 auto";
    }


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
    cell.classList.remove("x", "o", "animated");
  });

  // Ocultar el botón de reinicio y remover la clase "show"
  document.getElementById("restartBtn").classList.remove("show");
  document.getElementById("restartBtn").style.display = "none";
}
// Agregar evento de clic al botón de reinicio
restartBtn.addEventListener("click", () => {
  // Reproducir el sonido de reinicio
  restartSound.play();
  // Llamar a la función para reiniciar el juego
  restartGame();
});

