/* НАСТРОЙКИ */
const CORRECT_PASSCODE = "0000"; // Парола за отключване
const START_DATE = new Date("2024-01-01T00:00:00"); // Дата на връзката
const PUZZLE_IMAGE = "images/puzzle.jpg"; // Път към вашата снимка

/* ПИН КОД ЛОГИКА */
let currentPasscode = "";

function pressKey(num) {
  if (currentPasscode.length < 4) {
    currentPasscode += num;
    updateDots();

    if (currentPasscode.length === 4) {
      setTimeout(checkPasscode, 200);
    }
  }
}

function deleteKey() {
  currentPasscode = currentPasscode.slice(0, -1);
  updateDots();
}

function clearKey() {
  currentPasscode = "";
  updateDots();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);

    if (i < currentPasscode.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  }
}

function checkPasscode() {
  if (currentPasscode === CORRECT_PASSCODE) {
    switchScreen("main-screen");
    initPuzzle();
  } else {
    alert("Грешен код! Опитай пак ♡");
    clearKey();
  }
}

/* НАВИГАЦИЯ */
function switchScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  document.getElementById(screenId).classList.add("active");
}

function showTimerScreen() {
  switchScreen("timer-screen");
}

function showMainScreen() {
  switchScreen("main-screen");
}

/* ПЪЗЕЛ ЛОГИКА */
const puzzleGrid = document.getElementById("puzzle-grid");

let tilesState = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Верен ред
let currentState = [2, 0, 8, 1, 5, 3, 7, 4, 6]; // Разбъркан ред
let selectedTileIndex = null;

function initPuzzle() {
  puzzleGrid.innerHTML = "";

  currentState.forEach((piecePos, index) => {
    const tile = document.createElement("div");

    tile.className = "tile";
    tile.style.backgroundImage = `url('${PUZZLE_IMAGE}')`;

    // Сметки за позицията на снимката в 3x3 мрежа
    const row = Math.floor(piecePos / 3);
    const col = piecePos % 3;

    tile.style.backgroundPosition =
      `-${col * 100}px -${row * 100}px`;

    tile.addEventListener("click", () => handleTileClick(index));

    puzzleGrid.appendChild(tile);
  });
}

function handleTileClick(index) {
  const tiles = puzzleGrid.children;

  if (selectedTileIndex === null) {
    selectedTileIndex = index;
    tiles[index].classList.add("selected");
  } else {
    // Размяна на местата
    let temp = currentState[selectedTileIndex];

    currentState[selectedTileIndex] = currentState[index];
    currentState[index] = temp;

    tiles[selectedTileIndex].classList.remove("selected");
    selectedTileIndex = null;

    initPuzzle();
    checkPuzzleSolved();
  }
}

function checkPuzzleSolved() {
  const isSolved = currentState.every(
    (val, idx) => val === tilesState[idx]
  );

  if (isSolved) {
    document.getElementById("scroll-hint").style.display = "block";
    document.getElementById("secret-content").style.display = "block";
  }
}

/* ТАЙМЕР ЛОГИКА */
function updateTimer() {
  const now = new Date();
  const diff = now - START_DATE;

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (diff / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (diff / 1000 / 60) % 60
  );

  const seconds = Math.floor(
    (diff / 1000) % 60
  );

  document.getElementById("days").innerText = days;

  document.getElementById("hours").innerText =
    hours < 10 ? "0" + hours : hours;

  document.getElementById("minutes").innerText =
    minutes < 10 ? "0" + minutes : minutes;

  document.getElementById("seconds").innerText =
    seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateTimer, 1000);
updateTimer();
