

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
        let legalMove; // To know whether to change turns or not
        if (board[row][column] === "") {
            legalMove = true;
            board[row][column] = player.symbol;
            drawBoard();
        } else {
            legalMove = false;
            console.log("Cell is taken")
            // alert("Cell is already taken")
        }
        return legalMove;
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
})

    const player1 = player("X");
    const player2 = player("O");
    let turn = player1;

    const playRound = function() {
        legalMove = gameBoard.makeMove(turn, rowCol[0], rowCol[1]);
        if (turn === player1 && legalMove) {
            turn = player2;
        } else if (legalMove) {turn = player1}
    }

    return {playRound}
})();
