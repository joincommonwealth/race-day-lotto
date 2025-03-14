// Constants
const SYMBOLS = ['🎠', '🏆', '🎯', '⭐', '🌟', '💫'];
const SPIN_DURATION = 2000; // 2 seconds
const TOTAL_PASSES = 10;
const WIN_PROBABILITY = 0.1; // 10% chance to win

// Colors from Commonwealth branding
const COLORS = {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    textColor: '#1F2937',
    textSecondary: '#4B5563',
    background: '#F3F4F6'
};

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

    // Add initial animations
    gsap.from('header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.lottery-container', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
});

// Slot Machine Animation
function animateSlot(slot, duration) {
    const symbols = [...SYMBOLS];
    let currentIndex = 0;
    
    // Add glow effect
    gsap.to(slot.parentElement, {
        boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
        duration: 0.5
    });
    
    const interval = setInterval(() => {
        slot.textContent = symbols[currentIndex];
        currentIndex = (currentIndex + 1) % symbols.length;
    }, 100);

    return new Promise(resolve => {
        setTimeout(() => {
            clearInterval(interval);
            // Remove glow effect
            gsap.to(slot.parentElement, {
                boxShadow: 'none',
                duration: 0.5
            });
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
    
    // Animate result container
    gsap.from(resultContainer, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    resultTitle.textContent = isWinner ? '🎉 Congratulations! 🎉' : 'Better Luck Next Time!';
    
    if (isWinner) {
        winnerDetails.classList.remove('hidden');
        consolationOffer.classList.add('hidden');
        updateWinnerDetails();
        
        // Animate winner details
        gsap.from('#winnerDetails', {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
            ease: 'back.out'
        });
    } else {
        winnerDetails.classList.add('hidden');
        consolationOffer.classList.remove('hidden');
        
        // Animate consolation offer
        gsap.from('#consolationOffer', {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
            ease: 'back.out'
        });
    }
}

// Handle Spin
async function handleSpin() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;

    // Add button press animation
    gsap.to(spinButton, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });

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
    // Add button press animation
    gsap.to('#downloadPass', {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
            alert('Your paddock pass will be downloaded shortly!');
        }
    });
}); 