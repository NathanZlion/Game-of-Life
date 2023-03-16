//init
let city;
let interval;
let frameTimeGap = 500;

const grid = document.querySelector(".grid");
setListeners();

//when user specifies size of grid
function initialize(width, height) {
  city = new City(height, width);
  setEmptyGrid(width, height, city);
}

function setEmptyGrid(width, height) {
  grid.setAttribute("style", `grid-template-columns: repeat(${width}, 1fr);`);
  grid.innerHTML = ""; //reset existing grid

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
  const cells = [...grid.children]; //to use .forEach()
  cells.forEach((cell) => cell.classList.add("invisible"));

  const totalTime = 1000;
  const timeGap = totalTime / cells.length;

  animate(0);

  function animate(cellIndex) {
    if (cellIndex >= cells.length) {
      return;
    }

    const cell = cells[cellIndex];
    cell.classList.remove("invisible");
    cell.classList.add("twinkle");

    setTimeout(() => animate(cellIndex + 1), timeGap);
  }
}

//when user clicks play, and enjoying the "video"
function play() {
  interval = setInterval(showNextState, frameTimeGap);
}

function pause() {
  if (interval) clearInterval(interval);
}

function showNextState() {
  console.log("frame");
  const state = city.nextState();

  for (const cell of grid.children) {
    const row = cell.dataset.row;
    const column = cell.dataset.column;
    const isAlive = state[row][column] == 1;

    if (isAlive) cell.classList.remove("dead-cell");
    else cell.classList.add("dead-cell");
  }
}

function adjustSpeed(speed) {
  //speed from 0 to 10
  const maxTimeGap = 1000;
  const minTimeGap = 5;

  const percent = 1 - speed / 10;
  console.log("percent", percent);

  frameTimeGap = minTimeGap + (maxTimeGap - minTimeGap) * percent;
  pause();
  play();
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
  const speedInput = document.querySelector("#speed-input");

  //size prompt
  sizeSubmit.addEventListener("click", async () => {
    await transition([sizePrompt, grid], [togglePrompt, grid]);
    initialize(+widthInput.value, +heightInput.value);
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

  speedInput.addEventListener("change", () => {
    console.log(speedInput.value);
    adjustSpeed(+speedInput.value);
  });

  resetButton.addEventListener("click", async () => {
    pause();
    await transition([videoControls, grid], [sizePrompt]);
  });
}

async function transition(toOffs, toOns) {
  //wait for all elements to turn off (some might be already off)
  const onPromises = toOffs.map(turnOff);
  await Promise.all(onPromises);

  const offPromises = toOns.map(turnOn);
  await Promise.all(offPromises);
  console.log("done transitioning");
}

function turnOff(element) {
  return new Promise((resolve, reject) => {
    //no transition will happen
    if (element.classList.contains("invisible")) {
      element.classList.add("display-none");
      resolve();
      return;
    }

    element.classList.add("invisible");

    element.ontransitionend = () => {
      element.classList.add("display-none");
      resolve();
    };
  });
}

function turnOn(element) {
  return new Promise((resolve, reject) => {
    //no transition will happen
    if (!element.classList.contains("invisible")) {
      element.classList.remove("display-none");
      resolve();
      return;
    }

    element.classList.remove("display-none");
    setTimeout(() => element.classList.remove("invisible"));

    element.ontransitionend = resolve;
  });
}
