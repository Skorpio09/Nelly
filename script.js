const CORRECT_PASSCODE = "140626";
const START_DATE = new Date("2026-06-14T00:00:00");
const PUZZLE_IMAGE = "images/puzzle.jpg";

let currentPasscode = "";

function pressKey(num) {
  if (currentPasscode.length < 6) {
    currentPasscode += num;
    updateDots();
    if (currentPasscode.length === 6) {
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
  for (let i = 0; i < 6; i++) {
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
    alert("Wrong code! Try again ♡");
    clearKey();
  }
}

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function showTimerScreen() {
  switchScreen("timer-screen");
}

function showMainScreen() {
  switchScreen("main-screen");
}

function createFloatingHearts() {
  const field = document.querySelector(".heart-field");
  if (!field) return;

  for (let i = 0; i < 26; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";

    const size = 8 + Math.random() * 16;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = `${-30 - Math.random() * 20}px`;
    heart.style.animationDuration = `${9 + Math.random() * 11}s`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    heart.style.opacity = (0.35 + Math.random() * 0.6).toFixed(2);
    heart.style.setProperty("--drift", `${(Math.random() * 120 - 60).toFixed(2)}px`);

    field.appendChild(heart);
  }
}

const puzzleGrid = document.getElementById("puzzle-grid");
let tilesState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentState = [2, 0, 8, 1, 5, 3, 7, 4, 6];
let selectedTileIndex = null;

function initPuzzle() {
  puzzleGrid.innerHTML = "";
  currentState.forEach((piecePos, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.backgroundImage = `url('${PUZZLE_IMAGE}')`;
    
    const row = Math.floor(piecePos / 3);
    const col = piecePos % 3;
    tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

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
  const isSolved = currentState.every((val, idx) => val === tilesState[idx]);
  if (isSolved) {
    document.getElementById("scroll-hint").style.display = "block";
    document.getElementById("secret-content").style.display = "block";
  }
}

function updateTimer() {
  const now = new Date();
  const diff = now - START_DATE;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
  document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
}

createFloatingHearts();
setInterval(updateTimer, 1000);
updateTimer();