
// Gameboard object (module)

// Player objects (factory)

// Controller object (module)

const gameBoard = (function() {
    const board = [];
    // I think this just sets up the board
    for (let row = 0; row < 3; row++) {
        board[row] = []; // Create 3 arrays (ROWS)
        for (let column = 0; column < 3; column++) {
            board[row].push(""); // Create a column for each row and set it to empty
        }
    }
    const drawBoard = function() {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                document.getElementById(`${row}${column}`).textContent = board[row][column]
            }
        }
    }

    const makeMove = function(player, row, column) {
        board[row][column] = player.symbol;
        drawBoard();
    }

    // const getBoard = () => board;
    return {makeMove, drawBoard};
})();

const player = function(symbol) {
    return {symbol}
}

const controller = (function() {
    const player1 = player("X");
    const player2 = player("O");

    const playRound = function() {

    }

    return {player1, player2}
})();

gameBoard.makeMove(controller.player1, 1, 1);
