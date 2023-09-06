
// Gameboard object (module)

// Player objects (factory)

// Controller object (module)

const gameBoard = function() {
    const board = [];
    // I think this just sets up the board
    for (let row = 0; row < 3; row++) {
        board[row] = []; // Create 3 arrays (ROWS)
        for (let column = 0; column < 3; column++) {
            board[row].push("-"); // Create a column for each row and set it to empty
        }
    }
    const drawBoard = function() {
        console.log(board);
    }
    const getBoard = () => board;
    return {drawBoard, getBoard};
};

const player = function(symbol) {
    return {symbol}
}

const controller = (function() {
    const activeBoard = gameBoard();
})();

// function cell() {
//     let value = "-";
//     return {value};
// }
