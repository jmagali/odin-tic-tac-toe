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

function detectWinner(board) {
    const boardLength = board[0].length;
    const diagLeft = [];
    const diagRight = [];

    // Loop through all rows
    for (let i = 0; i < boardLength; i++) {
        let cellOne = board[i][0].getValue();

        // Push each diagonal to a left or right array
        diagLeft.push(board[i][i].getValue());
        diagRight.push(board[i][boardLength - 1 - i].getValue());

        // If the first cell of the row is not zero, check if the row/column is the same == winner
        if (cellOne) {
            if (board[i].every(cell => cell.getValue() === cellOne) // Checks row
                ||
                board.every(row => row[i].getValue() === cellOne) // Checks column
            ) {
                return cellOne; // Winning mark
            }
        }
    }

    // Check if somebody has won diagonally
    if (diagLeft[0] !== 0 && diagLeft.every(cell => cell === diagLeft[0])) {
        return diagLeft[0];
    }

    if (diagRight[0] !== 0 && diagRight.every(cell => cell === diagRight[0])) {
        return diagRight[0];
    }

    // In the case of no winner
    return null;
}

function createPlayer(playerMark) {
    return {
        playerMark
    };
}

function capitalizeFirstCharacter (text) {
    return text[0].toUpperCase() + text.slice(1, text.length);
}

const controller = (function GameController() {

    const board = GameBoard().getBoard();
    const grid = document.getElementById("grid-container");

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

    let players = [];

    for (let i = 0; i < 2; i++) {
        let mark = i + 1;

        players.push(createPlayer(mark));
    }

    let activePlayer = players[0];
    let winner = false;

    function playTurn(element) { 
        // Get row and column from id (split by space)
        const [row, col] = element.id.split(" ").map(Number);

        board[row][col].setValue(activePlayer.playerMark);

        let winner = detectWinner(board)

        if (!winner) activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

//     // TODO
//     function declareResults() {
//         if (winner) {
//             console.log(`${capitalizeFirstCharacter(winner.playerName)}, Wins!`);
//             return;
//         }

//         console.log(`Tie! Nobody Wins!`);
//     }

//     // Initial board print
//     game.printBoard();

//     while(!winner && !game.isBoardFull()) {
//         playTurn();
//         winner = players.find(p => p.playerMark === detectWinner(gameBoard));

//         if (!winner) {
//             activePlayer = activePlayer === players[0] ? players[1] : players[0];
//         }
//     }

//     declareResults();
})();