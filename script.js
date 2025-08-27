function GameBoard () {
    const length = 3;
    board = Array.from({length}, () => Array(length).fill(Cell()));
}

function Cell() {
    value = 0; // 0 = none, 1 = player 1, 2 = player 2
}