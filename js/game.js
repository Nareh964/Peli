import { createBoard } from './board.js';

const MIN_CARDS = 4;
const MAX_CARDS = 30;

function showInputModal() {
    const modal = document.getElementById('input-modal');
    const input = document.getElementById('card-input');
    const submitBtn = document.getElementById('card-submit');
    const errorMsg = document.getElementById('error-message');
    
    modal.style.display = 'flex';
    input.value = '';
    input.focus();
    errorMsg.textContent = '';
    
    function handleSubmit() {
        const cardCount = parseInt(input.value, 10);
        
        if (isNaN(cardCount)) {
            errorMsg.textContent = 'Syötä numero.';
            return;
        }
        
        if (cardCount % 2 !== 0) {
            errorMsg.textContent = 'Korttien määrä täytyy olla parillinen luku.';
            return;
        }
        
        if (cardCount < MIN_CARDS || cardCount > MAX_CARDS) {
            errorMsg.textContent = `Korttien määrä täytyy olla ${MIN_CARDS}-${MAX_CARDS} välillä.`;
            return;
        }
        
        modal.style.display = 'none';
        submitBtn.removeEventListener('click', handleSubmit);
        input.removeEventListener('keypress', handleKeyPress);
        startGame(cardCount);
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }
    
    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', handleKeyPress);
}

function startGame(cardCount) {
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        gameBoard.innerHTML = '';
    }
    createBoard(cardCount);
}

document.addEventListener('DOMContentLoaded', () => {
    showInputModal();
    
    const newGameButton = document.querySelector(".new");
    if (newGameButton) {
        newGameButton.addEventListener("click", showInputModal);
    }
});