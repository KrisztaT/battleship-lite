class GameBoard {
  constructor(rows = 10, cols = 10) {
    this._rows = rows;
    this._cols = cols;
    this._ships = [
      new Carrier(),
      new Battleship(),
      new Cruiser(),
      new Submarine(),
      new Destroyer(),
    ];
    this._hiddenGameBoard = Array.from({ length: rows }, () =>
      Array(cols).fill(0));
  }

  
  createGameBoard() {
    const gameBoard = document.getElementById("game-board");

    for (let j = 0; j <= this._cols; j++) {
      const headerCell = document.createElement("div");
      headerCell.classList.add("header-cell");
      if (j > 0) {
        headerCell.textContent = String.fromCharCode(64 + j); 
      }
      gameBoard.appendChild(headerCell);
    }
  
    for (let i = 0; i < this._rows; i++) {
      const headerCell = document.createElement("div");
      headerCell.classList.add("header-cell");
      headerCell.textContent = i + 1;
      gameBoard.appendChild(headerCell);
  
      for (let j = 0; j < this._cols; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener("click", (event) => this.handleCellClick(event));
        gameBoard.appendChild(cell);
      }
    }
  }


  handleCellClick(event) {
    const cellRow = event.target.dataset.row;
    const cellCol = event.target.dataset.col;
    const cell = document.querySelector(
        `div[data-row='${cellRow}'][data-col='${cellCol}']`
    );
    const message = document.getElementById('message')

    if (this._hiddenGameBoard[cellRow][cellCol] === 0){
        cell.innerHTML = "✖"
        message.classList.remove("hit")
        message.textContent = "Missed shot."
    }else if(this._hiddenGameBoard[cellRow][cellCol] !== 0){
      cell.innerHTML = '💥'
      
      for (let ship of this._ships){
        if (this._hiddenGameBoard[cellRow][cellCol] === ship.mapId){
          ship.decrease_life()
          if (ship.life > 0){
            message.classList.add("hit")
            message.textContent = `Direct hit on a ${ship.shipType}! It still has ${ship.life} life remaining.`
            
          }else{
            message.textContent = `Good job! You have sunk the ${ship.shipType}.`}
            if (!this.checkAnyShipsAlive()){
              message.classList.remove("hit")
              message.classList.add("celebrate")
              message.textContent = "Congratulations! All ships are destroyed! Game over."
              this.restartGame()
            }
          }
        }
      }
    }


  restartGame() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "restart";
    restartButton.classList.add("restart-button");
    message.appendChild(restartButton)
    restartButton.addEventListener("click", () =>{
      setTimeout(function() {
        window.location.reload();
      }, 2000);
    })
  }


  checkAnyShipsAlive(){
    for (let ship of this._ships){
      if (ship.isAlive){
        return true
      }
    }
    return false
  }

  generateRandomLocation() {
    const orientation = ["V", "H"];
    let orientationIndex = Math.round(Math.random() * 1);
    let coordinateX = Math.floor(Math.random() * this._cols);
    let coordinateY = Math.floor(Math.random() * this._rows);

    return [orientation[orientationIndex], coordinateX, coordinateY];
  }

  isValidPosition(result, len) {
    const [orientation, startX, startY] = result;
    if (orientation === "H" && startX + len > this._cols) {
      return false;
    }

    if (orientation === "V" && startY + len > this._rows) {
      return false;
    }

    for (let j = 0; j < len; j++) {
      const x = orientation === "H" ? startX + j : startX;
      const y = orientation === "V" ? startY + j : startY;

      if (this._hiddenGameBoard[y][x] !== 0) {
        return false;
      }
    }
    return true;
  }

  placeShip(ship, result) {
    const [orientation, startX, startY] = result;
    const len = ship.length;
    const id = ship.mapId;

    for (let j = 0; j < len; j++) {
      const x = orientation === "H" ? startX + j : startX;
      const y = orientation === "V" ? startY + j : startY;
      this._hiddenGameBoard[y][x] = id;
    }
  }

  addShips() {
    for (let ship of this._ships) {
      let len = ship.length;
      let result;

      do {
        result = this.generateRandomLocation();
      } while (!this.isValidPosition(result, len));

      this.placeShip(ship, result);
    }
  }
}

class Ships {
  constructor(shipType, length, mapId) {
    this._shipType = shipType;
    this._length = length;
    this._life = length;
    this._mapId = mapId;
    this._isAlive = true;
  }

  get shipType() {
    return this._shipType;
  }

  get length() {
    return this._length;
  }

  get life() {
    return this._life;
  }

  get mapId() {
    return this._mapId;
  }

  get isAlive() {
    return this._isAlive;
  }

  decrease_life() {
    this._life -= 1;
    if (this._life === 0) {
      this._isAlive = false;
    }
  }
}

class Carrier extends Ships {
  constructor(map_id = 5) {
    super("carrier", 5, map_id);
  }
}

class Battleship extends Ships {
  constructor(map_id = 4) {
    super("battleship", 4, map_id);
  }
}

class Cruiser extends Ships {
  constructor(map_id = 3) {
    super("cruiser", 3, map_id);
  }
}

class Submarine extends Ships {
  constructor(map_id = 1) {
    super("submarine", 3, map_id);
  }
}

class Destroyer extends Ships {
  constructor(map_id = 2) {
    super("destroyer", 2, map_id);
  }
}

const gameBoard = new GameBoard();
gameBoard.createGameBoard();
gameBoard.addShips();