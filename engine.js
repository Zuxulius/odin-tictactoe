
const gameBoard = (function() {
    let gameEnd;
    let turns = 0;
    let alert = document.getElementsByClassName("alert")[0];
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
            displayAlert("Cell is taken.", 1000);
            legalMove = false;
        }
        return legalMove;
    }

    const displayAlert = function(text, time) {
        alert.style.visibility = "visible";
        alert.textContent = text;
        setTimeout( () => {
            alert.style.visibility = "hidden";
        }, time);
    }

    const checkGameEnd = function(row, col, player) {
        if (
            // For every index in the row, it checks with the arrow function.
            board[row].every((cell) => cell === player.symbol) ||
            // for each row in the board, it takes the index of col and adds it to a new array. Then it checks each index in that array with the arrow function.
            board.map((row) => row[col]).every((cell) => cell === player.symbol)
            ) {
                controller.pause.style.visibility = "visible";
                displayAlert(`${player.name} wins!`.toUpperCase(), 3000);
                gameEnd = true;
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
                controller.pause.style.visibility = "visible";
                displayAlert(`${player.name} wins!`.toUpperCase(), 3000);
                gameEnd = true;
        } else if (turns === 9) {
                // game is finished with a draw
                controller.pause.style.visibility = "visible";
                displayAlert("IT'S A DRAW!", 3000);
                gameEnd = true;
        } else {return false}
    }

    const clearBoard = function() {
        board = freshBoard.map(row => row.slice());
        gameEnd = false;
        turns = 0;
        drawBoard();
    }

    const getBoard = () => board;
    const getGameEnd = () => gameEnd;

    return {getGameEnd, getBoard, makeMove, drawBoard, checkGameEnd, clearBoard};

})();

const player = function(symbol, type, name) {
    if (name === "easy") {name = "Finn"}
    else if (name === "hard") {name = "Baldr"}
    else if (name === "impossible") {name = "Agatha"}
    else if (name === "") {name = symbol}
    return {symbol, type, name}
}

const controller = (function() {
    let rowCol; // Scopes it within the controller module.
    let menu = document.getElementsByClassName("menu")[0];
    let pause = document.getElementsByClassName("pause")[0];
    let restart = document.getElementsByClassName("restart")[0];
    let exit = document.getElementsByClassName("exit")[0];
    let start = document.getElementsByClassName("start")[0];
    let player1;
    let player2;
    let turn;

    // Clicking on a cell functionality
    document.getElementsByClassName("UI")[0].addEventListener('click', function(e) {
        if (!(player1.type === "bot" && player2.type === "bot")) {
            // It only works to click on cells if one of the players are human
            let clickedCell = e.target.closest(".cell");
            rowCol = clickedCell.children[0].id;
            controller.playRound();
            if (turn.type === "bot") {
                // Computer checks if last round was a win for the other player
                if (gameBoard.checkGameEnd(rowCol[0], rowCol[1], player1.type === 'bot' ? player2 : player1) === false) {
                    computer();
                }
            }
        }
    })

    // Player or Bot menu functionality
    document.getElementById('player1-type').addEventListener('change', (e) => {
        const isBot = e.target.value === 'bot';
        document.getElementById('player1-name').style.display = isBot ? 'none' : '';
        document.getElementById('player1-difficulty').style.display = isBot ? '' : 'none';
    });
    document.getElementById('player2-type').addEventListener('change', (e) => {
        const isBot = e.target.value === 'bot';
        document.getElementById('player2-name').style.display = isBot ? 'none' : '';
        document.getElementById('player2-difficulty').style.display = isBot ? '' : 'none';
    });

    const startGame = function() {
        // Get values from player-setup and start game
        menu.style.visibility = "hidden";
        let player1Type = document.getElementById("player1-type").value;
        let player2Type = document.getElementById("player2-type").value;
        // Get written name or bot difficulty as name
        let player1Name = player1Type !== 'bot' ? document.getElementById("player1-name").value : document.getElementById("player1-difficulty").value;
        let player2Name = player2Type !== 'bot' ? document.getElementById("player2-name").value : document.getElementById("player2-difficulty").value;
        player1 = player("❌", player1Type, player1Name);
        player2 = player("⭕️", player2Type, player2Name);
        turn = player1;
        if (player1Type === 'bot') {
            setTimeout( () => {
            computer();
            }, 100);
        }
    }

    start.addEventListener("click", () => {
        startGame();
    });

    const computer = function() {
        let currentBoard = gameBoard.getBoard();
        if (turn.name === "Finn") {
            easyMode();
        }
        if (turn.name === "Baldr") {
            hardMode();
        }

        // Easymode code
        function easyMode() {
            let moves = [];
            for (let i=0; i<3; i++) {
                for (let j=0; j<3; j++) {
                    // Every empty cell is a legal move, so we append its indices to the moves array
                    if (currentBoard[i][j] === "") {moves.push(`${i}${j}`)}
                }
            }
            let move = Math.floor(Math.random() * moves.length);
            rowCol = moves[move]
            playRound();
        }

        // Hardmode code
        function hardMode() {
            let minOrMax = turn.symbol === "❌" ? true : false;
            let bestScore = minOrMax === false ? -Infinity : Infinity;
            let bestMove;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (currentBoard[i][j] === "") {
                        currentBoard[i][j] = turn.symbol;
                        let score = minimax(currentBoard, minOrMax);
                        currentBoard[i][j] = "";
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = { i, j };
                        }
                    }
                }
            }
            if (bestMove) {
                rowCol = `${bestMove.i}${bestMove.j}`;
                // currentBoard[bestMove.i][bestMove.j] = turn.symbol;
                playRound()
            }
        }

        // If both are bots
        if (player1.type === "bot" && player2.type === "bot") {
            if (!gameBoard.getGameEnd()) { // Without this, spamming restart is more likely to cause delayed functions to be executed.
                setTimeout(() => {
                    computer();
                }, 1000)
            }
        }
    }

    const minimax = function(board, isMaximizing) {
        let scores = { "❌": -1, "⭕️": 1, draw: 0 };

        let winner = checkWinner(board);
        if (winner) {
            return scores[winner];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = "⭕️";
                        let score = minimax(board, false);
                        board[i][j] = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        }

        else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = "❌";
                        let score = minimax(board, true);
                        board[i][j] = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    const checkWinner = function(board) {
        let winner = null;

        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== "" && board[i].every((cell) => cell === board[i][0])) {
                winner = board[i][0];
                break;
            }
            if (board[0][i] !== "" && board.every((row) => row[i] === board[0][i])) {
                winner = board[0][i];
                break;
            }
        }

        // Check diagonals
        if (
            winner === null &&
            board[0][0] !== "" &&
            board[0][0] === board[1][1] &&
            board[1][1] === board[2][2]
        ) {
            winner = board[0][0];
        }

        if (
            winner === null &&
            board[0][2] !== "" &&
            board[0][2] === board[1][1] &&
            board[1][1] === board[2][0]
        ) {
            winner = board[0][2];
        }

        // If a winner is found, return the winner
        if (winner !== null) {
            return winner;
        }

        // Check for a draw
        let allCellsFilled = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    allCellsFilled = false;
                    break;
                }
            }
        }

        if (allCellsFilled) {
            return "draw";
        }

        // If function hasn't returned yet, game is not finished
        return null;
    }

    const playRound = function() {
        // Don't allow rounds to be played if game is ended.
        if (!gameBoard.getGameEnd()) {
            legalMove = gameBoard.makeMove(turn, rowCol[0], rowCol[1]);
            if (turn === player1 && legalMove) {
                gameBoard.checkGameEnd(rowCol[0], rowCol[1], turn);
                turn = player2;
            } else if (legalMove) {
                gameBoard.checkGameEnd(rowCol[0], rowCol[1], turn);
                turn = player1;
            }
        }
    }

    // pause element toggle
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            if (window.getComputedStyle(menu).visibility !== "visible") {
                if (window.getComputedStyle(pause).visibility !== "hidden") {
                    pause.style.visibility = "hidden";
                } else {pause.style.visibility = "visible"}
            }
        }
    })
    restart.addEventListener("click", () => {
        gameBoard.clearBoard();
        turn = player1;
        pause.style.visibility = "hidden";
        if (player1.type === 'bot') {
            setTimeout( () => {
            computer();
            }, 100);
        }
    })
    exit.addEventListener("click", () => {
        gameBoard.clearBoard();
        menu.style.visibility = "visible";
        pause.style.visibility = "hidden";
    })

    return {playRound, pause}
})();

// Implement minimax algorithm
// Refactor the messy ass code
