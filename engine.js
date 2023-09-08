

const gameBoard = (function() {
    const freshBoard = [
                    ["","",""],
                    ["","",""],
                    ["","",""]
                ];
    let board = freshBoard;
    // // I think this just sets up the board
    // for (let row = 0; row < 3; row++) {
    //     board[row] = []; // Create 3 arrays (ROWS)
    //     for (let column = 0; column < 3; column++) {
    //         board[row].push("-"); // Create a column for each row and set it to empty
    //     }
    // }

    const drawBoard = function() {
        for (let row = 0; row < 3; row++) { // Don't repeat yourself??
            for (let column = 0; column < 3; column++) {
                document.getElementById(`${row}${column}`).textContent = board[row][column]
            }
        }
    }

    const makeMove = function(player, row, column) {
        if (board[row][column] === "") {
        board[row][column] = player.symbol;
        drawBoard();
        } else {
            console.log("Cell is taken")
            // alert("Cell is already taken")
        }
    }

    const clearBoard = function() {
        board = freshBoard;
    }

    // const getBoard = () => board;
    return {makeMove, drawBoard};
})();

const player = function(symbol) {
    return {symbol}
}

const controller = (function() {
    let rowCol; // Scopes it within the controller module.

    document.getElementsByClassName("UI")[0].addEventListener('click', function(e) {
        let clickedCell = e.target.closest(".cell");
        rowCol = clickedCell.children[0].id;
        controller.playRound();
        // gameBoard.makeMove(controller.player1, rowCol[0], rowCol[1]);
})
    const player1 = player("X");
    const player2 = player("O");
    let turn = player1;
    const playRound = function() {
        gameBoard.makeMove(turn, rowCol[0], rowCol[1]);
        if (turn === player1) {
            turn = player2;
        } else {turn = player1}
    }

    return {playRound, player1, player2}
})();

gameBoard.makeMove(controller.player1, 1, 1);

// If i get the player turn logic in the controller, i can make a function that adds the event listener and uses the current turn.
