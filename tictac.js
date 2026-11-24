
const http = require("http");

const PORT = 3000;

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Tic Tac Toe</title>

    <style>
        body {
            font-family: Arial;
            text-align: center;
            background: #f0f0f0;
        }

        h1 {
            color: #333;
        }

        .board {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            gap: 8px;
            justify-content: center;
            margin: 30px auto;
        }

        .cell {
            height: 100px;
            width: 100px;
            font-size: 40px;
            font-weight: bold;
            background: white;
            border: 2px solid #333;
            cursor: pointer;
        }

        .cell:hover {
            background: #ddd;
        }

        #status {
            font-size: 22px;
            font-weight: bold;
        }

        button.reset {
            padding: 10px 25px;
            font-size: 16px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>

<body>

    <h1>Tic Tac Toe Game</h1>

    <p id="status">Player X's Turn</p>

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

    <script>
        const cells = document.querySelectorAll(".cell");
        const status = document.getElementById("status");

        let currentPlayer = "X";
        let gameActive = true;

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

        cells.forEach((cell) => {
            cell.addEventListener("click", () => {

                if (cell.innerText !== "" || !gameActive) {
                    return;
                }

                cell.innerText = currentPlayer;

                checkWinner();
            });
        });

        function checkWinner() {

            let winner = false;

            for (let pattern of winningPatterns) {

                const [a, b, c] = pattern;

                if (
                    cells[a].innerText === currentPlayer &&
                    cells[b].innerText === currentPlayer &&
                    cells[c].innerText === currentPlayer
                ) {
                    winner = true;
                    break;
                }
            }

            if (winner) {
                status.innerText = "Player " + currentPlayer + " Wins!";
                gameActive = false;
                return;
            }

            const isDraw = [...cells].every(
                cell => cell.innerText !== ""
            );

            if (isDraw) {
                status.innerText = "Game Draw!";
                gameActive = false;
                return;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";

            status.innerText = "Player " + currentPlayer + "'s Turn";
        }

        function resetGame() {

            cells.forEach(cell => {
                cell.innerText = "";
            });

            currentPlayer = "X";
            gameActive = true;

            status.innerText = "Player X's Turn";
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
