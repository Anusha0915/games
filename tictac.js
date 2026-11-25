const http = require("http");

const PORT = 3000;

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Tic Tac Toe</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background: #f0f0f0;
            margin: 0;
            padding: 20px;
        }

        h1 {
            color: #333;
        }

        /* Main game border */
        .game-container {
            max-width: 450px;
            margin: 20px auto;
            padding: 25px;
            border: 3px solid #333;
            border-radius: 15px;
            background: white;
            box-sizing: border-box;
        }

        .symbol-choice {
            margin: 15px 0;
            font-size: 18px;
        }

        .symbol-choice select {
            padding: 8px 15px;
            font-size: 16px;
            border-radius: 5px;
        }

        /* Player X and O boxes */
        .players {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }

        .player-box {
            padding: 12px 25px;
            border: 2px solid #333;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            background: white;
        }

        #turnStatus {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
        }

        /* Tic Tac Toe board */
        .board {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            gap: 8px;
            justify-content: center;
            margin: 25px auto;
        }

        /* Empty boxes remain white */
        .cell {
            height: 100px;
            width: 100px;
            font-size: 40px;
            font-weight: bold;
            background: white;
            color: #222;
            border: 2px solid #333;
            cursor: pointer;
            border-radius: 5px;
        }

        /* Only the box clicked by X becomes aqua */
        .cell.x-box {
            background: aqua;
            color: #222;
        }

        /* Only the box clicked by O becomes ocean blue */
        .cell.o-box {
            background: #006994;
            color: white;
        }

        /* Winning boxes become coral */
        .cell.winning {
            background: coral !important;
            color: #222;
            border-color: #e05b3f;
            text-decoration: line-through;
        }

        .cell:disabled {
            cursor: not-allowed;
        }

        button.reset {
            padding: 10px 25px;
            font-size: 16px;
            background: #333;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button.reset:hover {
            background: #555;
        }

        /* Result at bottom-left */
        #result {
            margin-top: 25px;
            text-align: left;
            font-size: 20px;
            font-weight: bold;
            min-height: 25px;
        }

        @media (max-width: 400px) {
            .game-container {
                padding: 15px;
            }

            .board {
                grid-template-columns: repeat(3, 80px);
                gap: 6px;
            }

            .cell {
                width: 80px;
                height: 80px;
            }
        }
    </style>
</head>

<body>

    <h1>Tic Tac Toe Game</h1>

    <div class="game-container">

        <div class="symbol-choice">
            <label for="playerSymbol">
                Choose Player 1 Symbol:
            </label>

            <select id="playerSymbol">
                <option value="X">X</option>
                <option value="O">O</option>
            </select>
        </div>

        <div class="players">
            <div class="player-box">
                Player X
            </div>

            <div class="player-box">
                Player O
            </div>
        </div>

        <p id="turnStatus">Player X's Turn</p>

        <div class="board">
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
            <button class="cell"></button>
        </div>

        <button class="reset" onclick="resetGame()">
            Restart Game
        </button>

        <div id="result"></div>

    </div>

    <script>
        const cells = document.querySelectorAll(".cell");

        const turnStatus = document.getElementById("turnStatus");
        const result = document.getElementById("result");
        const playerSymbol = document.getElementById("playerSymbol");

        let currentPlayer = "X";
        let player1Symbol = "X";
        let gameActive = true;

        let board = ["", "", "", "", "", "", "", "", ""];

        let winningCombination = [];

        const winningPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]
        ];

        // Save game data
        function saveGame() {
            const gameData = {
                board: board,
                currentPlayer: currentPlayer,
                player1Symbol: player1Symbol,
                gameActive: gameActive,
                winningCombination: winningCombination,
                result: result.innerText
            };

            localStorage.setItem(
                "ticTacToeGame",
                JSON.stringify(gameData)
            );
        }

        // Load previous game
        function loadGame() {
            const savedGame = localStorage.getItem("ticTacToeGame");

            if (!savedGame) {
                return false;
            }

            try {
                const gameData = JSON.parse(savedGame);

                if (
                    !Array.isArray(gameData.board) ||
                    gameData.board.length !== 9
                ) {
                    return false;
                }

                board = gameData.board;

                currentPlayer = gameData.currentPlayer;

                player1Symbol = gameData.player1Symbol || "X";

                gameActive = gameData.gameActive;

                winningCombination =
                    gameData.winningCombination || [];

                result.innerText = gameData.result || "";

                playerSymbol.value = player1Symbol;

                renderGame();

                return true;

            } catch (error) {
                return false;
            }
        }

        // Display game
        function renderGame() {

            cells.forEach((cell, index) => {

                cell.innerText = board[index];

                // Remove previous colors
                cell.classList.remove(
                    "x-box",
                    "o-box",
                    "winning"
                );

                cell.disabled =
                    !gameActive || board[index] !== "";

                // X box gets aqua
                if (board[index] === "X") {
                    cell.classList.add("x-box");
                }

                // O box gets ocean blue
                if (board[index] === "O") {
                    cell.classList.add("o-box");
                }

                // Winning boxes get coral
                if (winningCombination.includes(index)) {
                    cell.classList.add("winning");
                }
            });

            if (gameActive) {
                turnStatus.innerText =
                    "Player " + currentPlayer + "'s Turn";
            } else {
                turnStatus.innerText = "Game Finished";
            }
        }

        // Click a box
        cells.forEach((cell, index) => {

            cell.addEventListener("click", () => {

                if (!gameActive || board[index] !== "") {
                    return;
                }

                board[index] = currentPlayer;

                checkWinner();
            });
        });

        // Check winner or draw
        function checkWinner() {

            winningCombination = [];

            for (let pattern of winningPatterns) {

                const [a, b, c] = pattern;

                if (
                    board[a] === currentPlayer &&
                    board[b] === currentPlayer &&
                    board[c] === currentPlayer
                ) {

                    winningCombination = pattern;

                    result.innerText =
                        "Player " + currentPlayer + " Wins!";

                    gameActive = false;

                    renderGame();
                    saveGame();

                    return;
                }
            }

            // Check draw
            const isDraw = board.every(
                cell => cell !== ""
            );

            if (isDraw) {

                result.innerText = "Game Draw!";

                gameActive = false;

                renderGame();
                saveGame();

                return;
            }

            // Change turn
            currentPlayer =
                currentPlayer === "X" ? "O" : "X";

            renderGame();
            saveGame();
        }

        // Restart game
        function resetGame() {

            board = ["", "", "", "", "", "", "", "", ""];

            player1Symbol = playerSymbol.value;

            currentPlayer = player1Symbol;

            gameActive = true;

            winningCombination = [];

            result.innerText = "";

            renderGame();
            saveGame();
        }

        // Change Player 1 symbol
        playerSymbol.addEventListener("change", () => {
            resetGame();
        });

        // Load saved game or start new game
        const loaded = loadGame();

        if (!loaded) {
            resetGame();
        }

    </script>

</body>
</html>
`;

const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/html"
    });

    res.end(html);

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
