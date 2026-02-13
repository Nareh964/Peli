import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
const clickDisplay = document.querySelector('.click');
const timeDisplay = document.querySelector('.time');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let click = 0;
let time = 0;
let timerInterval = null;
let gameStarted = false;

const clickSound = new Audio('sound/flip.mp3');
clickSound.preload = 'auto';

function updateClickDisplay() {
    clickDisplay.textContent = `Tries : ${click}`;
}

function updateTimeDisplay() {
    timeDisplay.textContent = `Time : ${time}`;
}

function displayClick(){
    click++;
    updateClickDisplay();
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
        time++;
        updateTimeDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetGame() {
    click = 0;
    time = 0;
    gameStarted = false;
    stopTimer();
    updateClickDisplay();
    updateTimeDisplay();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function createBoard(cardCount) {
    resetGame();
    const selectedCards = allCards.slice(0, cardCount / 2);
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => {
            if (!gameStarted) startTimer();
            if (lockBoard) return;
            flipCard(cardElement, handleCardFlip);
        });
        gameBoard.appendChild(cardElement);
    });
}

function handleCardFlip(cardElement) {
    try { clickSound.currentTime = 0; } catch (e) {}
    clickSound.play();
    if (lockBoard) return;
    if (cardElement === firstCard) return;
    
   

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    lockBoard = true;
    displayClick();
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function checkGameComplete(){
    const allFlipped = document.querySelectorAll(".flipped").length === document.querySelectorAll("[data-card").length;
    if (allFlipped){
        stopTimer();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    checkGameComplete();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

export function getGameState() {
    return { click, time };
}