// Constants
const SCRATCH_RADIUS = 20;
const REVEAL_THRESHOLD = 0.7; // 70% scratched to reveal
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
const canvas = document.getElementById('scratchCard');
const ctx = canvas.getContext('2d');
const prizeContent = document.getElementById('prizeContent');
const resultContainer = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const winnerDetails = document.getElementById('winnerDetails');
const consolationOffer = document.getElementById('consolationOffer');

// State
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hasWon = null;
let scratchedPixels = 0;
let totalPixels = canvas.width * canvas.height;

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

    // Initialize scratch card
    initializeScratchCard();

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

// Initialize Scratch Card
function initializeScratchCard() {
    // Determine if user wins
    hasWon = Math.random() < WIN_PROBABILITY;

    // Set prize content
    prizeContent.innerHTML = hasWon ? 
        '<div style="color: #2563EB; font-weight: bold;">🎉<br>Winner!<br>Paddock Pass</div>' : 
        '<div style="color: #4B5563;">Better luck<br>next time!</div>';

    // Draw scratch-off layer
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some texture/pattern to make it look more like a scratch card
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(x, y, 2, 2);
    }

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;

    e.preventDefault();
    const [x, y] = getCoordinates(e);

    // Create scratch effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw line from last position to current
    ctx.beginPath();
    ctx.lineWidth = SCRATCH_RADIUS * 2;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];

    // Check how much has been scratched
    checkProgress();
}

function stopDrawing() {
    isDrawing = false;
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    startDrawing(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    draw(mouseEvent);
}

// Helper functions
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return [x, y];
}

function checkProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let scratchedPixels = 0;

    // Count scratched pixels (transparent pixels)
    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) scratchedPixels++;
    }

    const scratchedPercentage = scratchedPixels / totalPixels;

    if (scratchedPercentage > REVEAL_THRESHOLD) {
        revealResult();
    }
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
function revealResult() {
    // Remove event listeners
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('mouseleave', stopDrawing);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', stopDrawing);

    // Clear the remaining scratch area with animation
    gsap.to(canvas, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            canvas.style.display = 'none';
            showFinalResult();
        }
    });
}

function showFinalResult() {
    resultContainer.classList.remove('hidden');
    
    // Animate result container
    gsap.from(resultContainer, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    resultTitle.textContent = hasWon ? '🎉 Congratulations! 🎉' : 'Better Luck Next Time!';
    
    if (hasWon) {
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

// Download Pass Handler
document.getElementById('downloadPass')?.addEventListener('click', () => {
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