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
  #gameboard;
  #player1;
  #player2;
  #round;
  #currentPlayer;

  #starterGameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

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

  constructor(player1, player2) {
    this.#gameboard = this.#starterGameboard.map((row) => [...row]);
    this.#player1 = player1;
    this.#player2 = player2;
    this.#round = 1;
  }

  renderGame() {
    const container = document.querySelector(".tic-tac-toe");
    container.textContent = "";

    for (const i in this.#gameboard.flat()) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.textContent = this.#gameboard.flat()[i];
      cell.onclick = () => this.playRound(this.#currentPlayer, i);

      container.appendChild(cell);
    }
  }

  resetGame() {
    this.#gameboard = this.#starterGameboard.map((row) => [...row]);
  }

  getPlayerSelections(player) {
    return this.#gameboard.reduce((acc, row, rowIndex) => {
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

  playRound(player, selection) {
    const rowIndex = Math.floor(selection / 3);
    const cellIndex = selection % 3;

    // prevents overrides
    if (this.#gameboard[rowIndex][cellIndex]) return;

    this.#gameboard[rowIndex][cellIndex] = player.getSign();
    this.#round += 1;

    this.setNextPlayer(player);
    this.renderGame();
  }

  startGame() {
    this.#currentPlayer = Math.random() > 0.5 ? this.#player1 : this.#player2;
    this.renderGame();
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

const game = new Gameboard(kathy, qi);

// Initialise tic tac toe grid
game.startGame();
