// TODO LIST:
// Add Game class and move methods from Gameboard to Game class
// Add Game tally
// Add New game - resets game tally
// Add player 1v1
// Add player v bot w/difficulty (easy, med, hard)
// Add method to calculate remaining options for bot to pick
// Add strategy algorithm for bot
// Easy bot 1-2 win conditions
// Med bot 3-4 win conditions
// Hard bot 5-7 win conditions

class Gameboard {
  #layout;
  #container;

  constructor() {
    this.#layout = Array.from({ length: 9 }).fill("");
    this.#container = document.querySelector(".tic-tac-toe");
  }

  renderBoard() {
    for (const index in this.#layout) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.dataset.attribute = index;
      cell.textContent = this.#layout[index];
      this.#container.appendChild(cell);
    }
  }

  getLayout(index) {
    if (!isNaN(index) && index >= 0 && index < 9) {
      return this.#layout[index];
    }

    return this.#layout;
  }

  setLayout(index, marker) {
    this.#layout[index] = marker;

    const cellPrev = this.#container.children[index];
    const cellNew = document.createElement("button");

    cellNew.className = "cell";
    cellNew.textContent = marker;
    cellNew.dataset.attribute = index;
    this.#container.replaceChild(cellNew, cellPrev);
  }

  resetBoard() {
    this.#layout = Array.from({ length: 9 }).fill("");
  }
}

class Game {
  #player1;
  #player2;
  #currentPlayer;

  #winningScenarios = [
    [0, 1, 2],
    [2, 5, 8],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
    [3, 4, 5],
  ];

  #gameboard = new Gameboard();
  #round = 1;

  constructor(player1, player2) {
    this.#player1 = player1;
    this.#player2 = player2;
  }

  getPlayerSelections(player) {
    return this.#gameboard.getLayout().reduce((acc, row, rowIndex) => {
      for (const cellIndex in row) {
        if (row[cellIndex] === player.getSign()) {
          acc.push(rowIndex * 3 + Number(cellIndex));
        }
      }

      return acc;
    }, []);
  }

  isGameWon(player) {
    const playerSelections = this.getPlayerSelections(player);

    return this.#winningScenarios.some((scenarios) => {
      return scenarios.every((scenario) => playerSelections.includes(scenario));
    });
  }

  isGameDraw() {
    return !this.isGameWon(this.#player1) && !this.isGameWon(this.#player2) && this.#round === 9;
  }

  getRound() {
    return this.#round;
  }

  playRound() {
    const container = document.querySelector(".tic-tac-toe");

    container.addEventListener("click", (event) => {
      const index = Number(event.target.dataset.attribute);
      if (this.#gameboard.getLayout(index)) return; // Prevents overriding previous player selection

      this.#gameboard.setLayout(index, this.#currentPlayer.getSign());
      this.setNextPlayer(this.#currentPlayer);
    });
  }

  startGame() {
    this.#currentPlayer = Math.random() > 0.5 ? this.#player1 : this.#player2;
    this.#gameboard.renderBoard();
    this.playRound();
  }

  setNextPlayer(currentPlayer) {
    if (currentPlayer === this.#player1) {
      this.#currentPlayer = this.#player2;
    } else {
      this.#currentPlayer = this.#player1;
    }
  }

  getCurrentPlayer() {
    return this.#currentPlayer;
  }
}

class Player {
  #name;
  #sign;

  constructor(name, sign) {
    this.#name = name;
    this.#sign = sign;
  }

  getSign() {
    return this.#sign;
  }
}

class Bot extends Player {
  constructor(difficulty) {
    super("Bot", "X");
    this.difficulty = difficulty;
  }
}

const kathy = new Player("Kathy", "X");
const qi = new Player("Qi", "O");

const game = new Game(kathy, qi);

// Initialise tic tac toe grid
game.startGame();
