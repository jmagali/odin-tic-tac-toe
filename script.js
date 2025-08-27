function GameBoard () {
    const length = 3;
    let board = [];

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

    const getCell = (row, column) => [row,column];

    const placeChoice = (cell, player) => {
        board[cell[1]][cell[2]].setValue(player);
    };

    // Temp function
    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    }

    return {
        getBoard,
        getCell,
        placeChoice,
        printBoard
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

function playRound() {
    let activePlayer = activePlater === players[0] ? players[1] : players[0];

    const game = GameBoard();
    game.printBoard();
}

function detectWinner(board) {
    let boardLength = board[0].length;
    let diagLeft = [];
    let diagRight = [];

    for (let i = 0; i < boardLength; i++) {
        let cellOne = board[i][0].getValue();

        diagLeft.push(board[i][i].getValue());
        diagRight.push(board[i][boardLength - 1 - i].getValue());

        if (cellOne) {
            if (board[i].every(cell => cell.getValue() === cellOne) ||
                board.every(row => row[i].getValue() === cellOne)
            ) {
                return cellOne;
            }
        }
    }

    if (diagLeft.every(cell => cell.getValue() === diagLeft[0][0].getValue)) {
        return diagLeft[0][0].getValue();
    }

    if (diagRight.every(cell => cell.getValue() === diagRight[0][0].getValue)) {
        return diagRight[0][0].getValue();
    }

    return null;
}

const controller = (function GameController() {
    let players = [];

    for (let i = 0; i < 2; i++) {
        let name = prompt(`What is Player ${i + 1}'s name?`);

        players.push({
            name,
            value: i + 1
        });
    }
})();