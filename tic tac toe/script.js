const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameBoard');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const modeSelection = document.getElementById('modeSelection');
const friendButton = document.getElementById('friendButton');
const aiButton = document.getElementById('aiButton');
let oTurn;
let playWithAI = false;

friendButton.addEventListener('click', () => startGame(false));
aiButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', showModeSelection);

function showModeSelection() {
  modeSelection.style.display = 'block';
  board.style.display = 'none';
  winningMessageElement.classList.remove('show');
}

function startGame(aiMode) {
  playWithAI = aiMode;
  oTurn = false;
  modeSelection.style.display = 'none';
  board.style.display = 'grid';
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (playWithAI && oTurn) {
      aiMove();
    } else {
      setBoardHoverClass();
    }
  }
}

function aiMove() {
  const availableCells = [...cellElements].filter(cell => 
    !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
  );
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, O_CLASS);
  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
