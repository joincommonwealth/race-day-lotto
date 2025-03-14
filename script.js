// Constants
const SYMBOLS = ['🐎', '🏆', '🎯', '⭐', '🌟', '💫'];
const SPIN_DURATION = 2000; // 2 seconds
const TOTAL_PASSES = 10;
const WIN_PROBABILITY = 0.1; // 10% chance to win

// DOM Elements
const spinButton = document.getElementById('spinButton');
const slots = document.querySelectorAll('.slot-content');
const resultContainer = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const winnerDetails = document.getElementById('winnerDetails');
const consolationOffer = document.getElementById('consolationOffer');

// State
let isSpinning = false;
let remainingPasses = TOTAL_PASSES;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('name') || 'there';
    const email = urlParams.get('email') || '';

    // Update UI with user's name if available
    if (firstName) {
        resultMessage.textContent = `Hey ${firstName}!`;
    }
});

// Slot Machine Animation
function animateSlot(slot, duration) {
    const symbols = [...SYMBOLS];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
        slot.textContent = symbols[currentIndex];
        currentIndex = (currentIndex + 1) % symbols.length;
    }, 100);

    return new Promise(resolve => {
        setTimeout(() => {
            clearInterval(interval);
            resolve();
        }, duration);
    });
}

// Generate Random Result
function generateResult() {
    return Math.random() < WIN_PROBABILITY;
}

// Update Winner Details
function updateWinnerDetails() {
    const passDate = new Date();
    passDate.setDate(passDate.getDate() + 7); // Pass valid for next 7 days

    document.getElementById('passDate').textContent = passDate.toLocaleDateString();
    document.getElementById('passLocation').textContent = 'Main Paddock Area';
    document.getElementById('passTime').textContent = '2 hours before race time';
}

// Show Result
function showResult(isWinner) {
    resultContainer.classList.remove('hidden');
    resultTitle.textContent = isWinner ? '🎉 Congratulations! 🎉' : 'Better Luck Next Time!';
    
    if (isWinner) {
        winnerDetails.classList.remove('hidden');
        consolationOffer.classList.add('hidden');
        updateWinnerDetails();
    } else {
        winnerDetails.classList.add('hidden');
        consolationOffer.classList.remove('hidden');
    }
}

// Handle Spin
async function handleSpin() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;

    // Animate slots sequentially
    for (let i = 0; i < slots.length; i++) {
        await animateSlot(slots[i], SPIN_DURATION / slots.length);
    }

    // Generate and show result
    const isWinner = generateResult();
    showResult(isWinner);

    isSpinning = false;
    spinButton.disabled = false;
}

// Event Listeners
spinButton.addEventListener('click', handleSpin);

// Download Pass Handler
document.getElementById('downloadPass').addEventListener('click', () => {
    // Here you would typically generate and download a PDF pass
    alert('Your paddock pass will be downloaded shortly!');
}); 