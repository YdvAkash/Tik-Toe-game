document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('reset');
    const congratulations = document.getElementById('congratulations');
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const handleCellClick = (e) => {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        board[cellIndex] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer);

        checkWinner();
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    };

    const checkWinner = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.innerText = `Player ${currentPlayer} has won!`;
            congratulations.classList.add('show');
            gameActive = false;
            return;
        }

        if (!board.includes('')) {
            message.innerText = 'Game is a draw!';
            gameActive = false;
            return;
        }
    };

    const handleResetGame = () => {
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        message.innerText = '';
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('X', 'O');
        });
        congratulations.classList.remove('show');
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleResetGame);
});
