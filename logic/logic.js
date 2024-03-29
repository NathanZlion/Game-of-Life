class City {
  constructor(n, m) {
    this.emptyCity = [];
    for (let i = 0; i < n; i++) {
      let row = [];
      for (let j = 0; j < m; j++) {
        row.push(0);
      }
      this.emptyCity.push(row);
    }
    this.currentCity = [...this.emptyCity];
  }

  reset() {
    this.currentCity = [...this.emptyCity];
    return this.currentCity;
  }

  toggle(row, col) {
    this.currentCity[row][col] = this.currentCity[row][col] ? 0 : 1;
  }

  nextState() {
    for (let row = 0; row < this.currentCity.length; row++) {
      for (let col = 0; col < this.currentCity[0].length; col++) {
        if (
          this.currentCity[row][col] === 1 &&
          (this.countLiveNeighbours(row, col) < 2 ||
            this.countLiveNeighbours(row, col) > 3)
        ) {
          this.currentCity[row][col] = 10; // intermediate dead
        } else if (
          this.countLiveNeighbours(row, col) === 3 &&
          this.currentCity[row][col] === 0
        ) {
          this.currentCity[row][col] = 11; // intermediate alive
        }
      }
    }
    this.cleanUp();
    return this.currentCity;
  }

  cleanUp() {
    for (let row = 0; row < this.currentCity.length; row++) {
      for (let col = 0; col < this.currentCity[0].length; col++) {
        this.currentCity[row][col] %= 10;
      }
    }
  }

  countLiveNeighbours(row, col) {
    let neighbourCount = 0;
    let neighbours = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    let neighbourRow;
    let neighbourCol;
    for (let coordinates of neighbours) {
      neighbourRow = row + coordinates[0];
      neighbourCol = col + coordinates[1];
      if (
        neighbourRow > -1 &&
        neighbourRow < this.currentCity.length &&
        neighbourCol > -1 &&
        neighbourCol < this.currentCity[0].length
      ) {
        if (
          this.currentCity[neighbourRow][neighbourCol] === 1 ||
          this.currentCity[neighbourRow][neighbourCol] === 10
        ) {
          neighbourCount += 1;
        }
      }
    }
    return neighbourCount;
  }

  getCountArray() {
    let countArray = [];

    let rowArr;
    for (let row = 0; row < this.currentCity.length; row++) {
      rowArr = [];
      for (let col = 0; col < this.currentCity[0].length; col++) {
        rowArr.push(this.countLiveNeighbours(row, col));
      }
      countArray.push(rowArr);
    }
    return countArray;
  }
}
