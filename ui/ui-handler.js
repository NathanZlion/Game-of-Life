//init
let city;
const grid = document.querySelector(".grid");
setListeners();

//when user specifies size of grid
function initialize(width, height) {
  city = new City(height, width);
  setEmptyGrid(width, height, city);
}

function setEmptyGrid(width, height) {
  grid.setAttribute("style", `grid-template-columns: repeat(${width}, 1fr);`);

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const cell = createCell(row, column, reflectToggle);
      grid.appendChild(cell);
    }
  }
  puddleAnimate();
}

function createCell(row, column, reflectToggle) {
  const element = document.createElement("button");
  element.classList.add("cell");
  element.classList.add("dead-cell");

  element.setAttribute("data-row", row);
  element.setAttribute("data-column", column);

  element.addEventListener("click", reflectToggle);
  return element;
}

function reflectToggle() {
  const cell = this;
  const row = cell.dataset.row;
  const column = cell.dataset.column;
  city.toggle(row, column);
  cell.classList.toggle("dead-cell");
}

function puddleAnimate() {
  const cells = grid.children;
  const timeGap = 100;
  animate(0);

  function animate(cellIndex) {
    if (cellIndex >= cells.length) {
      return;
    }

    const cell = cells[cellIndex];
    cell.classList.add("twinkle");

    setTimeout(() => animate(cellIndex + 1), timeGap);
  }
}

//when user clicks play, and enjoying the "video"
function play() {
  const timeGap = 1000;
  setInterval(showNextState, timeGap);
}

function showNextState() {
  console.log("next state");
  const state = city.nextState();

  for (const cell of grid.children) {
    const row = cell.dataset.row;
    const column = cell.dataset.column;
    const isAlive = state[row][column] == 1;

    if (isAlive) cell.classList.remove("dead-cell");
    else cell.classList.add("dead-cell");
  }
}

function pause() {
  clearInterval(showNextState);
}

//for page transitions and taking inputs

function setListeners() {
  const sizePrompt = document.querySelector(".size-prompt");
  const togglePrompt = document.querySelector(".toggle-prompt");
  const videoControls = document.querySelector(".video-controls");

  const heightInput = document.querySelector("#height-input");
  const widthInput = document.querySelector("#width-input");
  const sizeSubmit = document.querySelector("#size-submit");

  const startButton = document.querySelector("#start-btn");

  const playButton = document.querySelector("#play-btn");
  const pauseButton = document.querySelector("#pause-btn");
  const resetButton = document.querySelector("#reset-btn");

  //size prompt
  sizeSubmit.addEventListener("click", () => {
    initialize(+widthInput.value, +heightInput.value);
    transition([sizePrompt], [togglePrompt, grid]);
  });

  //toggle prompt
  startButton.addEventListener("click", async () => {
    await transition([togglePrompt], [videoControls]);
    play();
  });

  //video controls
  playButton.addEventListener("click", () => {
    play();
    pauseButton.classList.remove("display-none");
    playButton.classList.add("display-none");
  });
  pauseButton.addEventListener("click", () => {
    pause();
    playButton.classList.remove("display-none");
    pauseButton.classList.add("display-none");
  });

  resetButton.addEventListener("click", () => {
    pause();
    city = undefined;
    transition([videoControls, grid], [sizePrompt]);
  });
}

function transition(toOffs, toOns) {
  return new Promise((resolve, reject) => {
    toOffs.forEach((element) => element.classList.add("invisible"));

    toOffs[0].addEventListener("transitionend", () => {
      toOffs.forEach((element) => element.classList.add("display-none"));

      toOns.forEach((element) => element.classList.remove("display-none"));
      toOns.forEach((element) => element.classList.remove("invisible"));

      toOns[0].addEventListener("transitionend", resolve);
    });
  });
}
