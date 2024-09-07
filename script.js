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

  drawNewBoard() {
    this.#container.textContent = "";
    this.#layout = [...Array.from({ length: 9 }).fill("")];

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

  setLayout(index, marker, isWin = false) {
    this.#layout[index] = marker;
    const cellPrev = this.#container.children[index];

    cellPrev.className = `cell ${isWin ? "win" : ""}`;
    cellPrev.textContent = marker;
  }
}

class Game {
  #player1;
  #player2;
  #currentPlayer;

  #storeWinningScenarios;
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
  #moves = 0;

  constructor(player1, player2) {
    this.#player1 = player1;
    this.#player2 = player2;
  }

  getPlayerSelections(player) {
    return this.#gameboard.getLayout().reduce((acc, row, index) => {
      for (const cellIndex in row) {
        if (row[cellIndex] === player.getSign()) {
          acc.push(index);
        }
      }

      return acc;
    }, []);
  }

  isGameWon(player) {
    const playerSelections = this.getPlayerSelections(player);
    this.#storeWinningScenarios = [];

    const scenariosWon = this.#winningScenarios.map((scenarios) => {
      const isWin = scenarios.every((scenario) => playerSelections.includes(scenario));
      if (!isWin) return false;

      this.#storeWinningScenarios.push(scenarios);
      return true;
    });

    return scenariosWon.some(Boolean);
  }

  highlightWinningCells() {
    for (const scenarios of this.#storeWinningScenarios) {
      for (const cell of scenarios) {
        this.#gameboard.setLayout(cell, this.#currentPlayer.getSign(), true);
      }
    }
  }

  isGameDraw() {
    return !this.isGameWon(this.#player1) && !this.isGameWon(this.#player2) && this.#moves === 8;
  }

  getRound() {
    return this.#round;
  }

  getCurrentPlayer() {
    return this.#currentPlayer;
  }

  displayScores() {
    const statistics = document.querySelector(".statistics");

    for (const pTag of statistics.children) {
      const span = pTag.children[1];

      switch (span.id) {
        case "player-1-score":
          span.textContent = this.#player1.getScore();
          break;
        case "player-2-score":
          span.textContent = this.#player2.getScore();
          break;
        case "round-count":
          span.textContent = this.getRound();
        default:
          break;
      }
    }
  }

  playRound() {
    const container = document.querySelector(".tic-tac-toe");

    const handleGamePlay = (event) => {
      const index = Number(event.target.dataset.attribute);
      if (this.#gameboard.getLayout(index)) return; // Prevents overriding previous player selection

      this.#gameboard.setLayout(index, this.#currentPlayer.getSign());

      if (this.isGameWon(this.#currentPlayer)) {
        this.#currentPlayer.setScore(this.#currentPlayer.getScore() + 1);
        this.highlightWinningCells();
        this.rematch();
        this.displayScores();

        container.removeEventListener("click", handleGamePlay);
      } else if (this.isGameDraw()) {
        this.rematch();
      } else {
        this.setNextPlayer(this.#currentPlayer);
        this.#moves++;
      }
    };

    container.addEventListener("click", handleGamePlay);
  }

  rematch() {
    const rematch = document.querySelector(".rematch-options");
    rematch.style.opacity = 1;

    const hideOptionsAfterClick = () => {
      rematch.removeEventListener("click", handlePlayAgain);
      rematch.style.opacity = 0;

      this.#moves = 0;
      this.startGame();
      this.displayScores();
    };

    const handlePlayAgain = (event) => {
      const yes = event.target.className === "play-again-yes";
      const no = event.target.className === "play-again-no";

      if (yes) {
        this.#round++;
        hideOptionsAfterClick();
      }
      if (no) {
        this.#round = 1;
        this.#player1.setScore(0);
        this.#player2.setScore(0);
        hideOptionsAfterClick();
      }
    };

    rematch.addEventListener("click", handlePlayAgain);
  }

  startGame() {
    // Randomly select player to start game
    this.#currentPlayer = Math.random() > 0.5 ? this.#player1 : this.#player2;
    this.showCurrentPlayerIndicator();
    this.#gameboard.drawNewBoard();
    this.playRound();
  }

  setNextPlayer(currentPlayer) {
    if (currentPlayer === this.#player1) {
      this.#currentPlayer = this.#player2;
    } else {
      this.#currentPlayer = this.#player1;
    }

    this.showCurrentPlayerIndicator();
  }

  showCurrentPlayerIndicator() {
    const statistics = document.querySelector(".statistics");
    const [player1, player2] = statistics.children;

    if (this.#currentPlayer === this.#player1) {
      player1.classList.add("active");
    } else {
      player1.classList.remove("active");
    }

    if (this.#currentPlayer === this.#player2) {
      player2.classList.add("active");
    } else {
      player2.classList.remove("active");
    }
  }
}

class Player {
  #name;
  #sign;
  #score;

  constructor(name, sign) {
    this.#name = name;
    this.#sign = sign;
    this.#score = 0;
  }

  getSign() {
    return this.#sign;
  }

  getName() {
    return this.#name;
  }

  getScore() {
    return this.#score;
  }

  setScore(score) {
    this.#score = score;
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
