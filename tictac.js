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

        .game-container {
            max-width: 450px;
            margin: 20px auto;
            padding: 25px;
            border: 3px solid #333;
            border-radius: 15px;
            background: white;
            box-sizing: border-box;
        }
        
        .exit-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 100;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: transparent;
            border: 2px solid #e53935;
            border-radius: 50%;

            color: #e53935;
            cursor: pointer;
            transition: 0.2s;
        }

        .exit-btn svg {
            width: 25px;
            height: 25px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .exit-btn:hover {
            background: #ffe5e5;
            transform: scale(1.1);
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

        /* X box color */
        .cell.x-box {
            background: aqua;
            color: #222;
        }

        /* O box color */
        .cell.o-box {
            background: #006994;
            color: white;
        }

        /* Scoreboard */
        .scoreboard {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 20px 0;
        }

        .score-card {
            padding: 12px 8px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background: #fafafa;
        }

        .score-card h3 {
            margin: 0 0 8px;
            font-size: 16px;
        }

        .score-card .score {
            font-size: 28px;
            font-weight: bold;
        }

        #scoreX {
            color: #008b8b;
        }
            

        #scoreO {
            color: #006994;
        }

        #scoreDraw {
            color: #666;
        }

        /* Winning cells VFX */
        .cell.winning {
            animation: winningGlow 0.65s ease-in-out infinite alternate;
            background: coral !important;
            color: #222;
            border-color: #e05b3f;
            text-decoration: line-through;
            z-index: 1;
        }

        @keyframes winningGlow {
            from {
                box-shadow: 0 0 5px 2px rgba(255, 127, 80, 0.45);
                transform: scale(1);
            }

            to {
                box-shadow: 0 0 22px 7px rgba(255, 127, 80, 0.9);
                transform: scale(1.06);
            }
        }

        /* Confetti effect */
        .confetti-piece {
            position: fixed;
            top: -12px;
            width: 9px;
            height: 14px;
            z-index: 9999;
            pointer-events: none;
            animation: confettiFall 1.8s linear forwards;
        }

        @keyframes confettiFall {
            to {
                transform: translateY(105vh) rotate(720deg);
                opacity: 0;
            }
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
        position: relative;
    </style>
</head>

<body>

    <h1>Tic Tac Toe Game</h1>

    <div class="game-container">
        <button class="exit-btn" onclick="exitGame()" title="Quit Game">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2v10"></path>
                <path d="M6.5 5.5a9 9 0 1 0 11 0"></path>
            </svg>
        </button>

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

        <!-- Scoreboard -->
        <div class="scoreboard">

            <div class="score-card">
                <h3>Player X</h3>
                <div class="score" id="scoreX">0</div>
                <small>Wins</small>
            </div>

            <div class="score-card">
                <h3>Draws</h3>
                <div class="score" id="scoreDraw">0</div>
                <small>Matches</small>
            </div>

            <div class="score-card">
                <h3>Player O</h3>
                <div class="score" id="scoreO">0</div>
                <small>Wins</small>
            </div>

        </div>

        <!-- Game board -->
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

        const scoreXElement = document.getElementById("scoreX");
        const scoreOElement = document.getElementById("scoreO");
        const scoreDrawElement = document.getElementById("scoreDraw");

        // Scoreboard values
        let scores = {
            X: 0,
            O: 0,
            draws: 0
        };

        // Display scores
        function renderScores() {
            scoreXElement.innerText = scores.X;
            scoreOElement.innerText = scores.O;
            scoreDrawElement.innerText = scores.draws;
        }

        // Winning VFX and confetti
        function showWinVFX() {

            const confettiColors = [
                "#ff6b6b",
                "#ffd93d",
                "#6bcB77",
                "#4d96ff",
                "#b967ff"
            ];

            for (let i = 0; i < 65; i++) {

                const piece = document.createElement("span");

                piece.className = "confetti-piece";

                piece.style.left = Math.random() * 100 + "vw";

                piece.style.backgroundColor =
                    confettiColors[
                        Math.floor(Math.random() * confettiColors.length)
                    ];

                piece.style.animationDelay =
                    Math.random() * 0.45 + "s";

                piece.style.transform =
                    "rotate(" + Math.random() * 360 + "deg)";

                document.body.appendChild(piece);

                setTimeout(() => {
                    piece.remove();
                }, 2400);
            }
        }

        let currentPlayer = "X";
        let player1Symbol = "X";
        let gameActive = true;

        let board = ["", "", "", "", "", "", "", "", ""];

        let winningCombination = [];

        // Winning patterns
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
                scores: scores,
                result: result.innerText
            };

            localStorage.setItem(
                "ticTacToeGame",
                JSON.stringify(gameData)
            );
        }

        // Load previous game
        function loadGame() {

            const savedGame =
                localStorage.getItem("ticTacToeGame");

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

                // Load saved scores
                scores = gameData.scores || {
                    X: 0,
                    O: 0,
                    draws: 0
                };

                scores.X = Number(scores.X) || 0;
                scores.O = Number(scores.O) || 0;
                scores.draws = Number(scores.draws) || 0;

                renderScores();

                result.innerText = gameData.result || "";

                playerSymbol.value = player1Symbol;

                renderGame();

                return true;

            } catch (error) {
                return false;
            }
        }

        // Display game board
        function renderGame() {

            cells.forEach((cell, index) => {

                cell.innerText = board[index];

                // Remove previous colors and effects
                cell.classList.remove(
                    "x-box",
                    "o-box",
                    "winning"
                );

                cell.disabled =
                    !gameActive || board[index] !== "";

                // X box becomes aqua
                if (board[index] === "X") {
                    cell.classList.add("x-box");
                }

                // O box becomes blue
                if (board[index] === "O") {
                    cell.classList.add("o-box");
                }

                // Only winning boxes get VFX
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

            renderScores();
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

                    // Increase winner's score
                    scores[currentPlayer]++;

                    renderScores();

                    // Show winning VFX
                    showWinVFX();

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

                // Increase draw score
                scores.draws++;

                renderScores();

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

        // Restart current round
        function exitGame() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.close();
            }
        }

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
    console.log("hello");
});