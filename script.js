function GameBoard () {
    const length = 3;
    const board = Array.from({length}, 
                  Array.from(({length}), 
                  () => Cell()));

    const getBoard = () => board;

    return {getBoard};
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
