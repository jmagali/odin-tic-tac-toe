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

        // If the first cell of the row is not zero, check if the row/column is the same
        if (cellOne) {
            if (board[i].every(cell => cell.getValue() === cellOne) ||
                board.every(row => row[i].getValue() === cellOne)
            ) {
                return cellOne;
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

function createPlayer(playerName, playerMark) {
    return {
        playerName,
        playerMark
    };
}

function capitalizeFirstCharacter (text) {
    return text[0].toUpperCase() + text.slice(1, text.length);
}

const controller = (function GameController() {
    let players = [];

    for (let i = 0; i < 2; i++) {
        let name = prompt(`What is Player ${i + 1}'s name?`);
        let mark = i + 1;

        players.push(createPlayer(name, mark));
    }

    const game = GameBoard();
    const gameBoard = game.getBoard();
    let activePlayer = players[0];
    let winner = false;

    function playTurn() {  
        let validMove = false;

        while (!validMove) {
            const choice = getPlayerChoice();
            validMove = game.placeChoice(choice, activePlayer);

            if (!validMove) {
                alert("That cell is already taken! Try again.");
            }
        }

        game.printBoard();
    }

    function getPlayerChoice() {
        let row = prompt("Row?");
        let col = prompt("Column?");
        return [row - 1, col - 1];
    }

    function declareResults() {
        if (winner) {
            console.log(`${capitalizeFirstCharacter(winner.playerName)}, Wins!`);
            return;
        }

        console.log(`Tie! Nobody Wins!`);
    }

    // Initial board print
    game.printBoard();

    while(!winner && !game.isBoardFull()) {
        playTurn();
        winner = players.find(p => p.playerMark === detectWinner(gameBoard));

        if (!winner) {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        }
    }

    declareResults();
})();