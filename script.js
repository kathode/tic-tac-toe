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
    console.table(this.#gameboard);
    return this.#gameboard;
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

  isWin(player) {
    const playerSelections = this.getPlayerSelections(player);

    return this.#winningScenarios.some((scenarios) => {
      return scenarios.every((scenario) => playerSelections.includes(scenario));
    });
  }

  isDraw() {
    return !this.isWin(this.#player1) && !this.isWin(this.#player2) && this.#round === 9;
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
    this.renderGame();
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

const kathy = new Player("Kathy", ":)");
const qi = new Player("Qi", "HI");

const game = new Gameboard(kathy, qi);
