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

const game = GameBoard();
game.printBoard();