function GameBoard () {
    const length = 3;
    const board = [];

    // Fill board
    for (let i = 0; i < length; i++) {
        // Make each row an array
        board[i] = [];

        // Fill each row with length number Cells
        for (let j = 0; j < length; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeChoice = (cell, player) => {
        if (board[cell[0]][cell[1]].getValue()) {
            return false // Invalid move
        }

        board[cell[0]][cell[1]].setValue(player.playerMark);
        return true // Valid move
    };

    const isBoardFull = () => board.every(row => row.every(cell => cell.getValue() !== 0));

    // Temp function
    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    }

    return {
        getBoard,
        placeChoice,
        printBoard,
        isBoardFull
    };
}

function Cell() {
    let value = 0; // 0 = none, 1 = player 1, 2 = player 2

    const getValue = () => value;

    const setValue = (player) => {
        value = player;
    };

    return {
        getValue,
        setValue
    };
}

function detectWinner(board, boardObj) {
    const size = board.length;

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        const row = board[i];
        const colValue = board[0][i].getValue();

        // Check row
        if (row[0].getValue() !== 0 && row.every(cell => cell.getValue() === row[0].getValue())) {
            return row[0].getValue();
        }

        // Check column
        if (colValue !== 0 && board.every(row => row[i].getValue() === colValue)) {
            return colValue;
        }
    }

    // Check diagonals
    const diagLeftValue = board[0][0].getValue();
    const diagRightValue = board[0][size - 1].getValue();

    if (diagLeftValue !== 0 && board.every((row, i) => row[i].getValue() === diagLeftValue)) {
        return diagLeftValue;
    }

    if (diagRightValue !== 0 && board.every((row, i) => row[size - 1 - i].getValue() === diagRightValue)) {
        return diagRightValue;
    }

    // In the case of no winner
    if (boardObj.isBoardFull()) {
        return 3; // tie
    }
    
    return null;
}

function createPlayer(playerMark) {
    return {
        playerMark
    };
}

const controller = (function GameController() {

    const gameBoard = GameBoard();
    const board = gameBoard.getBoard();
    const grid = document.getElementById("grid-container");

    let players = [];

    for (let i = 0; i < 2; i++) {
        let mark = i + 1;

        players.push(createPlayer(mark));
    }

    let activePlayer = players[0];

    (function displayBoard () {
        for (let i = 0; i < board.length; i++) {
            for (let k = 0; k < board[i].length; k++) {
                const item = document.createElement("div");
                item.classList.add("grid-item");
                item.classList.add("empty");
                item.classList.add("emptyHollow")
                item.id = `${i} ${k}`;
                grid.appendChild(item);

                item.addEventListener('mouseover', () => {
                    if (item.classList.contains("emptyHollow")) {
                        item.classList.remove("emptyHollow");
                        const hollowMark = document.createElement("img");
                        hollowMark.classList.add("non-game-mark");
                        hollowMark.id = `Mark ${i} ${k}`;

                        if (activePlayer == players[0]) {
                            hollowMark.src = "./assets/hollowX.svg"
                            hollowMark.alt = "Hollow Blue X Mark";
                        }
                        else {
                            hollowMark.classList.add("non-game-mark");
                            hollowMark.src = "./assets/hollowO.svg";
                            hollowMark.alt = "Hollow Red O Mark";
                        }

                        item.appendChild(hollowMark);
                    }
                });

                item.addEventListener(`mouseleave`, () => {
                    const hollowMark = document.getElementById(`Mark ${i} ${k}`);
                        if (hollowMark) {
                            item.removeChild(hollowMark);
                            item.classList.add("emptyHollow");
                        }
                });

                item.addEventListener('click', () => {
                    if (item.classList.contains("empty")) {
                        item.classList.remove("empty");
                        const hollowMark = document.getElementById(`Mark ${i} ${k}`);
                        item.removeChild(hollowMark);

                        const mark = document.createElement("img");
                        mark.classList.add("non-game-mark");

                        if (activePlayer == players[0]) {
                            mark.src="./assets/blue-x.svg";
                            mark.alt = "Solid Blue X Mark";
                            item.style.backgroundColor = '#0a7c9cff';
                        }
                        else {
                            mark.src="./assets/red-o.svg";
                            mark.alt = "Solid Red O Mark";
                            item.style.backgroundColor = '#c3080bff';
                        }

                        item.appendChild(mark);

                        playTurn(item);
                    }
                });
            }
        }
    })();

    function clearBoard () {
        for (let i = 0; i < board.length; i++) {
            for (let k = 0; k < board[i].length; k++) {
                const item = document.getElementById(`${i} ${k}`);

                item.style.backgroundColor = "#d9d7d7";

                if (item.firstElementChild) item.removeChild(item.firstElementChild);

                item.classList.add("empty");
                item.classList.add("emptyHollow");

                board[i][k].setValue(0);

                activePlayer = players[0];
                adjustTurnIndicator();
            }
        }
    }

    const modalBackground = document.getElementById("modal-background");
    const resultsModal = document.getElementById("results");
    const restartConfirmModal = document.getElementById("restartConfirm");
    const restartButton = document.getElementById("restart");
    const noButton = document.getElementById("no");
    const yesButton = document.getElementById("yes");
    const playAgainButton = document.getElementById("playAgain");

    function closeModals() {
        restartConfirmModal.classList.add("hidden");
        modalBackground.classList.add("hidden");
        resultsModal.classList.add("hidden");
    }

    restartButton.addEventListener("click", () => {
        modalBackground.classList.remove("hidden");
        restartConfirmModal.classList.remove("hidden");
    });

    restartConfirmModal.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    resultsModal.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    modalBackground.addEventListener("click", closeModals);
    noButton.addEventListener("click", closeModals);
    yesButton.addEventListener("click", () => {
        closeModals();
        clearBoard();

        // Reset scores
        xWins = 0, ties = 0, oWins = 0;

        scoreTextX = document.getElementById("playerXText");
        scoreTextO = document.getElementById("playerOText");
        scoreTextTie = document.getElementById("tieText");
        
        scoreTextX.textContent = xWins;
        scoreTextO.textContent = oWins;
        scoreTextTie.textContent = ties;
    });
    playAgainButton.addEventListener("click", () => {
        const container = resultsModal.firstElementChild;
        const firstChild = container.firstElementChild;

        closeModals();

        if (firstChild.tagName === "IMG") container.removeChild(firstChild);

        clearBoard();
    });

    let winner;
    let xWins = 0, ties = 0, oWins = 0;

    const winnerText = document.getElementById("winner");

    function adjustTurnIndicator() {
        // Adjust turn indicator
        const turnIndicator = document.getElementById("turn-indicator");
        const turnMarker = document.getElementById("markIndicator")

        turnMarker.src = activePlayer === players[0] ? "./assets/blue-x.svg" : "./assets/red-o.svg";
        turnMarker.alt = activePlayer === players[0] ? "Blue X Player Mark" : "Red O Player Mark";

        turnIndicator.lastElementChild.style.color = activePlayer === players[0] ? "#249ebf" : "#dd2427";
    }

    function playTurn(element) { 
        // Get row and column from id (split by space)
        const [row, col] = element.id.split(" ").map(Number);

        board[row][col].setValue(activePlayer.playerMark);

        winner = detectWinner(board, gameBoard);

        if (!winner) {
            // Switch turns
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
            adjustTurnIndicator();
        }
        else {
            let scoreText;
            const winningMark = document.createElement("img");
            winningMark.classList.add("icon");
            const winnerContainer = document.getElementById("winner");

            if(winner == players[0].playerMark) {
                scoreText = document.getElementById("playerXText");
                xWins++;
                scoreText.textContent = xWins;
                winnerContainer.firstElementChild.textContent = "WINS";
                winningMark.src = "./assets/blue-x.svg";
                resultsModal.firstElementChild.prepend(winningMark);
            }
            else if (winner == players[1].playerMark) {
                scoreText = document.getElementById("playerOText");
                oWins++;
                scoreText.textContent = oWins
                winnerContainer.firstElementChild.textContent = "WINS";
                winningMark.src = "./assets/red-o.svg";
                resultsModal.firstElementChild.prepend(winningMark);
            }   
            else {
                scoreText = document.getElementById("tieText");
                ties++;
                scoreText.textContent = ties;
                winnerText.firstElementChild.textContent = "TIE"
            }

            modalBackground.classList.remove("hidden");
            resultsModal.classList.remove("hidden");
        }
    }
})();