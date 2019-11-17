class View {

  tiles = document.querySelectorAll('.tile');
  newGameBtn = document.querySelector('#new-game');

  createMarker(markerType) {

    const marker = document.createElement('i');
    marker.classList = `fas fa-${markerType}`;

    return marker;
  }
}

class Player {

  populatedTiles = [];

  constructor(id, name, markerType) {
    this.id = id;
    this.name = name;
    this.markerType = markerType;
  }

  addTile(id) {
    this.populatedTiles.push(id);
  }

  reset() {
    this.populatedTiles = [];
  }
}

class Conditions {

  winningConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [3, 5, 7],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
  ];
}

class Game {

  view = new View();

  isGameActive = false;
  conditions = new Conditions().winningConditions;
  playerOne = new Player(1, 'Player one', 'times');
  playerTwo = new Player(2, 'Player two', 'circle');
  currentPlayer = this.playerOne;

  constructor() {
    this.prepare();
    this.startGame();
  }

  startGame() {
    this.isGameActive = true;
  }

  prepare() {

    this.view.tiles.forEach((tile) => {

      tile.addEventListener('click', (e) => {

        if (tile.hasChildNodes()) {
          return;
        }

        this.place(e.target);
      });
    });

    this.view.newGameBtn.addEventListener('click', () => {
      this.reset();
      this.startGame();
    });
  }

  place(tile) {

    if (!this.isGameActive) {
      return;
    }

    tile.appendChild(this.view.createMarker(this.currentPlayer.markerType));
    this.endTurn(tile);
  }

  nextTurn() {

    if (this.currentPlayer === this.playerTwo) {
      this.currentPlayer = this.playerOne;
    }
    else {
      this.currentPlayer = this.playerTwo;
    }
  }

  endTurn(tile) {

    this.currentPlayer.addTile(parseInt(tile.getAttribute('id')));

    if (this.currentPlayer.populatedTiles.length < 3) {
      this.nextTurn();
    }
    else {
      this.checkBoard();
    }
  }

  checkBoard() {

    let inARow = 0;

    for (const conditionStack of this.conditions) {
      for (const tileId of this.currentPlayer.populatedTiles) {

        if (conditionStack.indexOf(tileId) !== -1) {

          inARow += 1;

          if (inARow === 3) {
            return this.endGame(true);
          }
        }
      }
      inARow = 0;
    }

    if (this.playerOne.populatedTiles.length === 5) {
      this.endGame(false);
    }
    else {
      this.nextTurn();
    }
  }

  endGame(isWinner) {
    
    if (isWinner) {
      this.showAlert(`Winner is ${this.currentPlayer.name}`);
    }
    else {
      this.showAlert('It ends in a draw!');
    }

    this.isGameActive = false;
  }

  showAlert(msg) {

    const alertBox =  document.querySelector('.alert-box');
          alertBox.classList.add('active');
          alertBox.textContent = msg;

    setTimeout(() => {
      alertBox.classList.remove('active');
    }, 2000);
  }

  reset() {

    document.querySelectorAll('.tile').forEach((tile) => {
      
      while (tile.firstChild) {
        tile.removeChild(tile.firstChild);
      }
    });

    this.playerOne.reset();
    this.playerTwo.reset();
  }
}

new Game();