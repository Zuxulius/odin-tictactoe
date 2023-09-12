

const gameBoard = (function() {
    let turns = 0;
    const freshBoard = [
                    ["","",""],
                    ["","",""],
                    ["","",""]
                ];
    let board = freshBoard.map(row => row.slice());
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
            ++turns;
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

    const checkGameEnd = function(row, col, player) {
        if (
            // For every index in the row, it checks with the arrow function.
            board[row].every((cell) => cell === player.symbol) ||
            // for each row in the board, it takes the index of col and adds it to a new array. Then it checks each index in that array with the arrow function.
            board.map((row) => row[col]).every((cell) => cell === player.symbol)
            ) {
                alert(`${player.symbol} wins!`)
        } else if (
            // Check diagonals
            // If row and col are the same we're in the main diagonal (0,0 1,1 2,2)
            row === col &&
            // Creates an array from 0-2, checks the board at 0,0 1,1 2,2
            [...Array(board.length).keys()].every((i) => board[i][i] === player.symbol) ||
            // If row + col = row length - 1 (2) we're in the anti-diagonal (0,2 1,1 2,0)
            row + col === (board.length - 1) &&
            // Creates an array from 0-2, checks the board at 0,2 1,1 2,0
            [...Array(board.length).keys()].every((i) => board[i][board.length - 1 - i] === player.symbol)
        ) {
            alert(`${player.symbol} wins!`)
        } else if (turns === 9) {
            // game is finished with a draw
            alert("IT'S A DRAW")
        } else {return false}
    }

    const clearBoard = function() {
        board = freshBoard.map(row => row.slice());
        turns = 0;
        drawBoard();
    }

    const restart = function() {
        clearBoard();
    }

    // const getBoard = () => board;
    return {makeMove, drawBoard, checkGameEnd, restart};

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
            gameBoard.checkGameEnd(rowCol[0], rowCol[1], turn);
            turn = player2;
        } else if (legalMove) {
            gameBoard.checkGameEnd(rowCol[0], rowCol[1], turn);
            turn = player1;
        }
    }
    let pause = document.getElementsByClassName("pause")[0];
    let restart = document.getElementsByClassName("restart")[0];
    let exit = document.getElementsByClassName("exit")[0];

    // pause element toggle
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" || event.code === 27) {
            if (pause.style.visibility !== "hidden") {
                pause.style.visibility = "hidden";
            } else {pause.style.visibility = "visible"}
        }
    })
    restart.addEventListener("click", gameBoard.restart)
    // exit.addEventListener("click", gameBoard.restart, )

    return {playRound}
})();

// const pause = (function() {
//     let pause = document.getElementsByClassName("pause")[0];
//     let restart = document.getElementsByClassName("restart")[0];
//     let exit = document.getElementsByClassName("exit")[0];

//     // pause element toggle
//     document.addEventListener("keydown", function(event) {
//         if (event.key === "Escape" || event.code === 27) {
//             if (pause.style.display !== "none") {
//                 pause.style.display = "none";
//             } else {pause.style.display = "block"}
//         }
//     })

//     restart.addEventListener("click", gameBoard.restart)
//     // exit.addEventListener("click", gameBoard.exit())
// })();
