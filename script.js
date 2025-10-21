// Game State
let gameState = {
    balance: 0,
    bonusBalance: 0,
    currentBet: 0,
    multiplier: 1.00,
    isPlaying: false,
    isCrashed: false,
    crashPoint: 0,
    gameInterval: null,
    roundInterval: null,
    history: [],
    autoCashoutEnabled: false,
    autoCashoutMultiplier: 1.80,
    soundEnabled: true,
    roundPhase: 'waiting', // 'waiting', 'flying', 'crashed'
    waitingTime: 5, // seconds before next round
    userHasBet: false, // track if user placed bet in current round
    // Statistics
    totalBets: 0,
    totalWins: 0,
    totalLosses: 0
};

// DOM Elements
const elements = {
    balance: document.getElementById('balance'),
    betAmount: document.getElementById('betAmount'),
    placeBetBtn: document.getElementById('placeBetBtn'),
    cashOutBtn: document.getElementById('cashOutBtn'),
    multiplier: document.getElementById('multiplier'),
    gameStatus: document.getElementById('gameStatus'),
    currentBet: document.getElementById('currentBet'),
    potentialWin: document.getElementById('potentialWin'),
    plane: document.getElementById('plane'),
    crashMessage: document.getElementById('crashMessage'),
    historyItems: document.getElementById('historyItems'),
    increaseBet: document.getElementById('increaseBet'),
    decreaseBet: document.getElementById('decreaseBet'),
    autoCashoutToggle: document.getElementById('autoCashoutToggle'),
    autoCashoutControls: document.getElementById('autoCashoutControls'),
    autoCashoutMultiplier: document.getElementById('autoCashoutMultiplier'),
    autoCashoutDisplay: document.getElementById('autoCashoutDisplay'),
    increaseAutoCashout: document.getElementById('increaseAutoCashout'),
    decreaseAutoCashout: document.getElementById('decreaseAutoCashout'),
    particles: document.getElementById('particles'),
    planeTrail: document.getElementById('planeTrail'),
    soundWaves: document.getElementById('soundWaves'),
    speedIndicator: document.getElementById('speedIndicator'),
    speedText: document.getElementById('speedText'),
    // Statistics elements
    totalBetsCount: document.getElementById('totalBetsCount'),
    totalWins: document.getElementById('totalWins'),
    totalLosses: document.getElementById('totalLosses'),
    winRate: document.getElementById('winRate'),
    trendItems: document.getElementById('trendItems')
};

// Pleasant, Non-Annoying Sound System
const GameSounds = {
    playBetSound: function() {
        if (!gameState.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 262; // C note
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    },
    playCashoutSound: function() {
        if (!gameState.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [{ freq: 659, time: 0 }, { freq: 784, time: 0.05 }].forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = note.freq;
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.15, ctx.currentTime + note.time);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + 0.2);
                osc.start(ctx.currentTime + note.time);
                osc.stop(ctx.currentTime + note.time + 0.2);
            });
            if ('vibrate' in navigator) navigator.vibrate(80);
        } catch (e) {}
    },
    playCrashSound: function() {
        if (!gameState.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
            if ('vibrate' in navigator) navigator.vibrate(50);
        } catch (e) {}
    },
    playBigWinSound: function() {
        if (!gameState.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [523, 659, 784, 1047].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
                osc.start(ctx.currentTime + i * 0.08);
                osc.stop(ctx.currentTime + i * 0.08 + 0.15);
            });
            if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        } catch (e) {}
    }
};

// Initialize the game
function init() {
    loadGlobalHistory(); // Load shared history first (all users see same trend)
    loadStatistics(); // Load user-specific stats
    loadGameState(); // Restore game state on refresh
    updateDisplay();
    updateStatistics();
    setupEventListeners();
    setupSoundControl();
    startContinuousGameLoop(); // Start automatic game rounds
}

// Start continuous game loop - plane takes off every 10 seconds automatically
function startContinuousGameLoop() {
    console.log('🎮 Starting continuous game loop - Plane takes off every 10 seconds!');
    
    // Start first round immediately
    setTimeout(() => {
        startNewRound();
    }, 2000);
}

// Start a new round (plane takes off automatically)
function startNewRound() {
    console.log('🛫 NEW ROUND STARTING!');
    
    // Reset round state
    gameState.roundPhase = 'flying';
    gameState.multiplier = 1.00;
    gameState.isCrashed = false;
    
    // Calculate random crash point for this round
    gameState.crashPoint = calculateCrashPoint();
    console.log('🎯 This round will crash at: ' + gameState.crashPoint + 'x');
    
    // Save game state
    saveGameState();
    
    // Update UI for flying
    elements.multiplier.textContent = '1.00x';
    elements.gameStatus.textContent = '✈️ Round Started! Flying...';
    elements.gameStatus.style.color = '#667eea';
    elements.plane.classList.add('flying');
    elements.crashMessage.classList.remove('show');
    
    // DISABLE betting during flight - only during countdown!
    elements.placeBetBtn.disabled = true;
    elements.placeBetBtn.textContent = 'Betting Closed (Round in Progress)';
    
    // Show cash out button if user has bet
    if (gameState.userHasBet && gameState.isPlaying) {
        elements.cashOutBtn.style.display = 'block';
        elements.gameStatus.textContent = '💰 Flying! Cash out anytime!';
    }
    
    // Start multiplier increase
    startMultiplierIncrease();
}

// Start multiplier increase for current round
function startMultiplierIncrease() {
    let animationProgress = 0;
    const animationDuration = Math.random() * 4000 + 4000;
    
    gameState.gameInterval = setInterval(() => {
        if (gameState.isCrashed) {
            clearInterval(gameState.gameInterval);
            return;
        }
        
        // Increase multiplier randomly
        const randomSpeed = Math.random() * 0.03 + 0.01;
        gameState.multiplier += randomSpeed;
        
        // Update plane position
        animationProgress += 100;
        updatePlanePosition(animationProgress, animationDuration);
        
        // Update display
        elements.multiplier.textContent = gameState.multiplier.toFixed(2) + 'x';
        
        // Update potential win if user has bet
        if (gameState.userHasBet) {
            elements.potentialWin.textContent = '₹' + (gameState.currentBet * gameState.multiplier).toFixed(0);
            
            // Check for auto cashout
            if (gameState.autoCashoutEnabled && gameState.multiplier >= gameState.autoCashoutMultiplier) {
                autoCashOut();
                return;
            }
        }
        
        // Save game state every second (10 intervals = 1 second)
        if (Math.random() < 0.1) {
            saveGameState();
        }
        
        // Check if crash point reached
        if (gameState.multiplier >= gameState.crashPoint) {
            crashRound();
        }
    }, 100);
}

// Crash the current round
function crashRound() {
    gameState.isCrashed = true;
    gameState.roundPhase = 'crashed';
    
    clearInterval(gameState.gameInterval);
    
    // If user had bet and didn't cash out, they lose
    if (gameState.userHasBet && gameState.isPlaying) {
        gameState.isPlaying = false;
        
        // Track loss
        gameState.totalLosses++;
        
        // Save loss
        saveUserBalance();
        updateWageringProgress(0);
        
        console.log('USER LOST! Did not cash out before crash');
    }
    
    // Show crash animation
    elements.plane.classList.remove('flying');
    elements.crashMessage.classList.add('show');
    elements.gameStatus.textContent = `💥 Crashed at ${gameState.crashPoint.toFixed(2)}x!`;
    elements.gameStatus.style.color = '#dc2626';
    
    // Play crash sound
    GameSounds.playCrashSound();
    
    // Add to history
    addToHistory(gameState.crashPoint, false);
    
    // Update statistics display
    updateStatistics();
    
    // Hide cash out button if visible
    elements.cashOutBtn.style.display = 'none';
    
    // Wait 5 seconds then start new round
    gameState.waitingTime = 5;
    startWaitingForNextRound();
}

// Start waiting period before next round
function startWaitingForNextRound() {
    gameState.roundPhase = 'waiting';
    
    // Reset user bet state
    gameState.userHasBet = false;
    gameState.currentBet = 0;
    gameState.isPlaying = false;
    
    // Clear saved game state (round is over)
    sessionStorage.removeItem('aviator_game_state');
    
    updateDisplay();
    
    // ENABLE BETTING DURING COUNTDOWN
    if (gameState.balance + gameState.bonusBalance >= 10) {
        elements.placeBetBtn.disabled = false;
        elements.placeBetBtn.style.display = 'block';
        elements.placeBetBtn.textContent = `Place Bet for Next Round (₹${parseInt(elements.betAmount.value) || 10})`;
    }
    elements.cashOutBtn.style.display = 'none';
    
    // Update status with countdown
    const countdownInterval = setInterval(() => {
        gameState.waitingTime--;
        
        if (gameState.waitingTime > 0) {
            elements.gameStatus.textContent = `⏱️ Betting Open! Next round in ${gameState.waitingTime} seconds...`;
            elements.gameStatus.style.color = '#10b981';
        } else {
            clearInterval(countdownInterval);
            resetPlane();
            startNewRound();
        }
    }, 1000);
}

// Reset plane to starting position
function resetPlane() {
    elements.crashMessage.classList.remove('show');
    elements.plane.style.left = '5%';
    elements.plane.style.bottom = '10%';
    elements.plane.style.transform = 'rotate(-15deg)';
    elements.planeTrail.style.width = '0';
}

// Setup sound control
function setupSoundControl() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            gameState.soundEnabled = !gameState.soundEnabled;
            soundToggle.classList.toggle('muted');
            
            if (gameState.soundEnabled) {
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i><span>Sound ON</span>';
            } else {
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i><span>Sound OFF</span>';
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    elements.placeBetBtn.addEventListener('click', placeBet);
    elements.cashOutBtn.addEventListener('click', cashOut);
    elements.increaseBet.addEventListener('click', () => adjustBet(10));
    elements.decreaseBet.addEventListener('click', () => adjustBet(-10));
    elements.betAmount.addEventListener('input', updateBetDisplay);
    
    // Auto cashout event listeners
    elements.autoCashoutToggle.addEventListener('change', toggleAutoCashout);
    elements.autoCashoutMultiplier.addEventListener('input', updateAutoCashoutDisplay);
    elements.increaseAutoCashout.addEventListener('click', () => adjustAutoCashout(0.10));
    elements.decreaseAutoCashout.addEventListener('click', () => adjustAutoCashout(-0.10));
}

// Adjust bet amount
function adjustBet(amount) {
    const currentValue = parseInt(elements.betAmount.value) || 10;
    const newValue = Math.max(10, currentValue + amount);
    
    if (newValue <= gameState.balance) {
        elements.betAmount.value = newValue;
        updateBetDisplay();
    }
}

// Update bet display
function updateBetDisplay() {
    const betValue = parseInt(elements.betAmount.value) || 10;
    elements.placeBetBtn.textContent = `Place Bet (₹${betValue})`;
}

// Toggle auto cashout
function toggleAutoCashout() {
    gameState.autoCashoutEnabled = elements.autoCashoutToggle.checked;
    elements.autoCashoutControls.style.display = gameState.autoCashoutEnabled ? 'block' : 'none';
    
    if (gameState.autoCashoutEnabled) {
        gameState.autoCashoutMultiplier = parseFloat(elements.autoCashoutMultiplier.value) || 1.80;
        updateAutoCashoutDisplay();
        console.log('🤖 Auto Cashout ENABLED at ' + gameState.autoCashoutMultiplier.toFixed(2) + 'x');
    } else {
        console.log('🔴 Auto Cashout DISABLED');
    }
}

// Adjust auto cashout multiplier
function adjustAutoCashout(amount) {
    const currentValue = parseFloat(elements.autoCashoutMultiplier.value) || 1.80;
    const newValue = Math.max(1.01, Math.min(100, parseFloat((currentValue + amount).toFixed(2))));
    
    elements.autoCashoutMultiplier.value = newValue.toFixed(2);
    updateAutoCashoutDisplay();
}

// Update auto cashout display
function updateAutoCashoutDisplay() {
    const multiplier = parseFloat(elements.autoCashoutMultiplier.value) || 1.80;
    gameState.autoCashoutMultiplier = multiplier;
    elements.autoCashoutDisplay.textContent = multiplier.toFixed(2) + 'x';
    console.log('🎯 Target multiplier updated to: ' + multiplier.toFixed(2) + 'x');
}

// Place bet
// Place bet (only during countdown/waiting phase)
function placeBet() {
    const betAmount = parseInt(elements.betAmount.value);
    
    // Validation
    if (betAmount < 10) {
        alert('Minimum bet is ₹10');
        return;
    }
    
    if (betAmount > gameState.balance + gameState.bonusBalance) {
        alert('Insufficient balance!');
        return;
    }
    
    // Can ONLY bet during waiting/countdown phase
    if (gameState.roundPhase !== 'waiting') {
        alert('❌ Betting closed! Wait for countdown to place next bet.');
        return;
    }
    
    if (gameState.userHasBet) {
        alert('You already placed a bet for the next round!');
        return;
    }
    
    // Play gentle bet sound
    GameSounds.playBetSound();
    
    // Increment total bets counter
    gameState.totalBets++;
    
    // Deduct bet from balance IMMEDIATELY
    gameState.balance -= betAmount;
    gameState.currentBet = betAmount;
    gameState.isPlaying = true;
    gameState.userHasBet = true;
    
    // Save balance and game state immediately
    saveUserBalance();
    saveGameState();
    trackBetActivity(betAmount);
    
    // Update UI
    updateDisplay();
    elements.placeBetBtn.disabled = true;
    elements.placeBetBtn.textContent = `✅ Bet Placed! (₹${betAmount})`;
    
    // Update status
    elements.gameStatus.textContent = `✅ Bet placed for next round! Wait ${gameState.waitingTime}s...`;
    elements.gameStatus.style.color = '#10b981';
    
    console.log(`✅ Bet placed: ₹${betAmount} for next round`);
}

// Calculate crash point - PURE LUCK, COMPLETELY RANDOM, FAIR PLAY
function calculateCrashPoint() {
    // True gambling: crash can happen at ANY multiplier from 1.01x to 100x
    // Most crashes happen early, but jackpots ARE possible - pure luck!
    
    const random = Math.random();
    
    // Exponential distribution for realistic casino feel (like real Aviator)
    // Most losses, but rare big wins possible
    if (random < 0.50) {
        // 50% crash very early 1.01x - 1.50x (user loses fast)
        return parseFloat((1.01 + Math.random() * 0.49).toFixed(2));
    } else if (random < 0.75) {
        // 25% crash early 1.50x - 2.50x
        return parseFloat((1.50 + Math.random() * 1.00).toFixed(2));
    } else if (random < 0.88) {
        // 13% chance 2.50x - 5.00x (decent win)
        return parseFloat((2.50 + Math.random() * 2.50).toFixed(2));
    } else if (random < 0.95) {
        // 7% chance 5.00x - 10.00x (good win)
        return parseFloat((5.00 + Math.random() * 5.00).toFixed(2));
    } else if (random < 0.98) {
        // 3% chance 10.00x - 25.00x (great win!)
        return parseFloat((10.00 + Math.random() * 15.00).toFixed(2));
    } else if (random < 0.995) {
        // 1.5% chance 25.00x - 50.00x (huge jackpot!)
        return parseFloat((25.00 + Math.random() * 25.00).toFixed(2));
    } else {
        // 0.5% chance 50.00x - 100.00x (MEGA JACKPOT!!!)
        return parseFloat((50.00 + Math.random() * 50.00).toFixed(2));
    }
}

// Start the game loop - PURE RANDOM, NO PREDICTION POSSIBLE
function startGame() {
    let animationProgress = 0;
    const animationDuration = Math.random() * 4000 + 4000; // Random 4-8 seconds
    let engineVariationCounter = 0;
    
    console.log('🎰 PURE LUCK GAME - Crash will happen at: ' + gameState.crashPoint + 'x');
    
    gameState.gameInterval = setInterval(() => {
        if (gameState.isCrashed) {
            clearInterval(gameState.gameInterval);
            return;
        }
        
        // Multiplier increases at COMPLETELY RANDOM RATES - no pattern!
        // Sometimes fast, sometimes slow, TOTALLY UNPREDICTABLE
        const randomSpeed = Math.random() * 0.03 + 0.01; // Between 0.01 and 0.04 per tick
        gameState.multiplier += randomSpeed;
        
        // Update plane position at constant smooth speed (NO correlation to multiplier)
        animationProgress += 100;
        updatePlanePosition(animationProgress, animationDuration);
        
        // Update display
        elements.multiplier.textContent = gameState.multiplier.toFixed(2) + 'x';
        elements.potentialWin.textContent = '₹' + (gameState.currentBet * gameState.multiplier).toFixed(0);
        
        // Update speed indicator (visual feedback)
        if (elements.speedText) {
            const speed = Math.floor(gameState.multiplier * 100);
            elements.speedText.textContent = speed + ' km/h';
        }
        
        // Check for auto cashout
        if (gameState.autoCashoutEnabled && gameState.multiplier >= gameState.autoCashoutMultiplier) {
            console.log('🎉 AUTO CASHOUT TRIGGERED! Current: ' + gameState.multiplier.toFixed(2) + 'x, Target: ' + gameState.autoCashoutMultiplier.toFixed(2) + 'x');
            autoCashOut();
            return;
        }
        
        // Check if crash point reached - PURE LUCK!
        if (gameState.multiplier >= gameState.crashPoint) {
            crash();
        }
    }, 100); // Update every 100ms
}

// Update plane position with smooth constant animation (no correlation to multiplier)
function updatePlanePosition(progress, duration) {
    const animationPercent = Math.min(progress / duration, 1);
    
    // Smooth constant movement along a curved path
    const maxLeft = 75; // percentage
    const maxBottom = 65; // percentage
    
    // Add some curve to the flight path for realism
    const left = 5 + (animationPercent * maxLeft) + Math.sin(animationPercent * Math.PI) * 5;
    const bottom = 10 + (animationPercent * maxBottom) + Math.cos(animationPercent * Math.PI * 2) * 3;
    
    elements.plane.style.left = left + '%';
    elements.plane.style.bottom = bottom + '%';
    
    // Update trail
    const trailLength = Math.min(animationPercent * 200, 150);
    elements.planeTrail.style.width = trailLength + 'px';
    elements.planeTrail.style.left = (left - 2) + '%';
    elements.planeTrail.style.bottom = (bottom + 2) + '%';
    
    // Update sound waves position
    if (elements.soundWaves) {
        elements.soundWaves.style.left = left + '%';
        elements.soundWaves.style.bottom = bottom + '%';
    }
    
    // Slight rotation for realism
    const rotation = -15 + (animationPercent * 10);
    elements.plane.style.transform = `rotate(${rotation}deg)`;
}

// Crash the plane - USER LOST (didn't cash out in time)
function crash() {
    gameState.isCrashed = true;
    gameState.isPlaying = false;
    
    clearInterval(gameState.gameInterval);
    
    // Track loss
    gameState.totalLosses++;
    
    // CRITICAL: Save balance to database - bet money is LOST FOREVER
    saveUserBalance();
    
    // Track the loss in wagering (bets count toward wager even if lost)
    updateWageringProgress(0); // 0 profit, but bet is tracked
    
    // Play crash sound
    GameSounds.playCrashSound();
    
    // Create explosion particles
    createExplosion();
    
    // Show crash animation
    elements.plane.classList.remove('flying');
    elements.crashMessage.classList.add('show');
    elements.gameStatus.textContent = `💥 Crashed at ${gameState.crashPoint.toFixed(2)}x - You Lost ₹${gameState.currentBet}!`;
    elements.gameStatus.style.color = '#dc2626';
    elements.cashOutBtn.style.display = 'none';
    
    // Hide speed indicator
    if (elements.speedIndicator) {
        elements.speedIndicator.classList.remove('active');
    }
    
    console.log('❌ LOST! Crashed at ' + gameState.crashPoint.toFixed(2) + 'x - Bad luck!');
    console.log('💸 ₹' + gameState.currentBet + ' lost forever. Balance now: ₹' + gameState.balance);
    
    // Record loss in history
    addToHistory(gameState.crashPoint, false);
    
    // Update statistics display
    updateStatistics();
    
    // Reset after 3 seconds
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Create explosion particles
function createExplosion() {
    const planeRect = elements.plane.getBoundingClientRect();
    const gameAreaRect = elements.particles.getBoundingClientRect();
    
    const centerX = planeRect.left - gameAreaRect.left + planeRect.width / 2;
    const centerY = planeRect.top - gameAreaRect.top + planeRect.height / 2;
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.background = ['#ff0000', '#ff6600', '#ffaa00', '#ffff00'][Math.floor(Math.random() * 4)];
        
        elements.particles.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Cash out - USER WON!
function cashOut() {
    if (!gameState.isPlaying || gameState.isCrashed) {
        return;
    }
    
    performCashOut(false);
}

// Auto cash out - AUTOMATIC WIN!
function autoCashOut() {
    if (!gameState.isPlaying || gameState.isCrashed) {
        return;
    }
    
    performCashOut(true);
}

// Perform cash out (plane continues flying independently!)
function performCashOut(isAuto) {
    // Calculate winnings
    const winAmount = Math.floor(gameState.currentBet * gameState.multiplier);
    const profit = winAmount - gameState.currentBet;
    
    // Track win
    gameState.totalWins++;
    
    // Update balance
    gameState.balance += winAmount;
    
    // Update wagering progress (only count winnings/profit)
    if (profit > 0) {
        updateWageringProgress(profit);
    }
    
    // Save to user data
    saveUserBalance();
    
    // Play cashout sound
    if (profit >= gameState.currentBet * 5) {
        GameSounds.playBigWinSound(); // Big win!
    } else {
        GameSounds.playCashoutSound(); // Regular win
    }
    
    // Mark user as cashed out (but plane continues!)
    gameState.isPlaying = false;
    
    // Update UI - plane keeps flying!
    const cashoutType = isAuto ? '🤖 Auto Cashed Out' : '✅ Cashed out';
    elements.gameStatus.textContent = `${cashoutType} at ${gameState.multiplier.toFixed(2)}x! Won ₹${winAmount}`;
    elements.gameStatus.style.color = '#16a34a';
    elements.cashOutBtn.style.display = 'none';
    
    console.log(`✅ WON! ${isAuto ? 'Auto ' : ''}Cashed out at ` + gameState.multiplier.toFixed(2) + 'x');
    
    // Record win in history
    addToHistory(gameState.multiplier, true);
    
    // Update statistics display
    updateStatistics();
    
    // Show quick success message (non-blocking)
    showQuickWinMessage(winAmount, profit, isAuto);
    
    // NOTE: Plane continues flying! Round is NOT affected by user cashout
}

// Show quick win message (doesn't block game)
function showQuickWinMessage(amount, profit, isAuto = false) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    const autoLabel = isAuto ? '<div style="font-size: 1.2em; color: #f59e0b; margin-bottom: 5px;">🤖 AUTO</div>' : '';
    successMsg.innerHTML = `
        ${autoLabel}
        <div style="font-size: 2em; color: #10b981;">🎉 WON!</div>
        <div style="font-size: 1.8em; color: #16a34a; margin-top: 5px;">+₹${profit}</div>
    `;
    successMsg.style.cssText = `
        position: absolute;
        top: 20%;
        right: 20px;
        background: rgba(16, 185, 129, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 25;
        animation: slideInRight 0.5s ease-out, fadeOutRight 0.5s ease-out 2s forwards;
        text-align: center;
    `;
    
    document.querySelector('.game-area').appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 2500);
}

// Add CSS animations
const winAnimStyle = document.createElement('style');
winAnimStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes fadeOutRight {
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }
`;
document.head.appendChild(winAnimStyle);

// Create win particles
function createWinParticles() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const startX = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 200;
            const ty = -100 - Math.random() * 100;
            
            particle.style.left = startX + '%';
            particle.style.top = '100%';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.background = ['#10b981', '#16a34a', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 4)];
            
            elements.particles.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 30);
    }
}

// Show success message
function showSuccessMessage(amount, profit, isAuto = false) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    const autoLabel = isAuto ? '<div style="font-size: 1.5em; color: #f59e0b; margin-bottom: 5px;">🤖 AUTO CASHOUT</div>' : '';
    successMsg.innerHTML = `
        ${autoLabel}
        <div style="font-size: 3em; color: #10b981;">🎉 YOU WON! 🎉</div>
        <div style="font-size: 2.5em; color: #16a34a; margin-top: 10px;">+₹${profit}</div>
        <div style="font-size: 1.5em; color: #059669; margin-top: 5px;">Total: ₹${amount}</div>
    `;
    successMsg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        z-index: 25;
        animation: fadeUp 3s ease-out forwards;
        text-align: center;
    `;
    
    document.querySelector('.game-area').appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Add CSS animation for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%);
        }
    }
`;
document.head.appendChild(style);

// Reset game for next round
function resetGame() {
    gameState.currentBet = 0;
    gameState.multiplier = 1.00;
    gameState.isCrashed = false;
    
    // Reset UI
    elements.multiplier.textContent = '1.00x';
    elements.gameStatus.textContent = '🎰 Place your bet - Pure Luck Game!';
    elements.gameStatus.style.color = '#555';
    elements.currentBet.textContent = '₹0';
    elements.potentialWin.textContent = '₹0';
    elements.placeBetBtn.disabled = false;
    elements.placeBetBtn.style.display = 'block';
    elements.cashOutBtn.style.display = 'none';
    elements.crashMessage.classList.remove('show');
    elements.plane.style.left = '5%';
    elements.plane.style.bottom = '10%';
    elements.plane.style.transform = 'rotate(-15deg)';
    elements.planeTrail.style.width = '0';
    
    updateDisplay();
    
    // Check if user is out of money
    if (gameState.balance + gameState.bonusBalance < 10) {
        elements.gameStatus.textContent = '❌ Insufficient Balance';
        elements.gameStatus.style.color = '#dc2626';
        elements.placeBetBtn.disabled = true;
        showTopUpPopup();
    }
}

// Show animated top-up popup (instead of boring alert)
function showTopUpPopup() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 25px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        text-align: center;
        color: white;
        max-width: 450px;
        animation: slideInBounce 0.5s ease-out;
        position: relative;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4em; margin-bottom: 20px;">💰</div>
        <h2 style="font-size: 2.2em; margin-bottom: 15px; font-weight: 900;">Out of Balance!</h2>
        <p style="font-size: 1.3em; margin-bottom: 10px; opacity: 0.9;">You need at least ₹10 to play</p>
        <p style="font-size: 1.5em; margin-bottom: 30px; font-weight: bold;">Current Balance: ₹${(gameState.balance + gameState.bonusBalance).toFixed(0)}</p>
        
        <div style="background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
            <p style="font-size: 1.1em; margin-bottom: 10px;">💡 Add funds to continue playing!</p>
            <p style="font-size: 0.95em; opacity: 0.8;">Quick deposits available</p>
        </div>
        
        <button id="topUpBtn" style="
            width: 100%;
            padding: 18px;
            font-size: 1.4em;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
        ">
            💳 Add Money Now
        </button>
        
        <button id="closePopupBtn" style="
            width: 100%;
            padding: 15px;
            font-size: 1.1em;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            Maybe Later
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add hover effects
    const topUpBtn = popup.querySelector('#topUpBtn');
    topUpBtn.addEventListener('mouseenter', () => {
        topUpBtn.style.transform = 'translateY(-3px)';
        topUpBtn.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.6)';
    });
    topUpBtn.addEventListener('mouseleave', () => {
        topUpBtn.style.transform = 'translateY(0)';
        topUpBtn.style.boxShadow = '0 5px 20px rgba(16, 185, 129, 0.4)';
    });
    
    const closeBtn = popup.querySelector('#closePopupBtn');
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        closeBtn.style.transform = 'scale(1.02)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1)';
    });
    
    // Button actions
    topUpBtn.addEventListener('click', () => {
        window.location.href = 'wallet.html';
    });
    
    closeBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Play sound
    GameSounds.playCrashSound();
}

// Add animations to style
const popupAnimations = document.createElement('style');
popupAnimations.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideInBounce {
        0% {
            transform: translateY(-100px) scale(0.8);
            opacity: 0;
        }
        60% {
            transform: translateY(10px) scale(1.02);
            opacity: 1;
        }
        100% {
            transform: translateY(0) scale(1);
        }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(popupAnimations);

// Add to history
function addToHistory(multiplier, isWin) {
    gameState.history.unshift({ multiplier, isWin });
    
    // Keep only last 25 results for trend
    if (gameState.history.length > 25) {
        gameState.history.pop();
    }
    
    // Save global history to localStorage (shared across all users)
    saveGlobalHistory();
    
    // Update history display (last 10)
    const recentHistory = gameState.history.slice(0, 10);
    elements.historyItems.innerHTML = recentHistory.map(item => `
        <div class="history-item ${item.isWin ? 'win' : 'loss'}">
            ${item.multiplier.toFixed(2)}x
        </div>
    `).join('');
    
    // Update trend visualization
    updateTrendVisualization();
}

// Save global history (shared across all users and sessions)
function saveGlobalHistory() {
    try {
        const historyData = {
            rounds: gameState.history,
            lastUpdate: Date.now()
        };
        localStorage.setItem('aviator_global_history', JSON.stringify(historyData));
    } catch (e) {
        console.error('Error saving global history:', e);
    }
}

// Load global history (runs on page load for all users)
function loadGlobalHistory() {
    try {
        const savedHistory = localStorage.getItem('aviator_global_history');
        if (savedHistory) {
            const historyData = JSON.parse(savedHistory);
            if (historyData.rounds && Array.isArray(historyData.rounds)) {
                gameState.history = historyData.rounds;
                console.log(`📊 Loaded ${gameState.history.length} rounds from global history`);
                
                // Update displays
                const recentHistory = gameState.history.slice(0, 10);
                if (elements.historyItems) {
                    elements.historyItems.innerHTML = recentHistory.map(item => `
                        <div class="history-item ${item.isWin ? 'win' : 'loss'}">
                            ${item.multiplier.toFixed(2)}x
                        </div>
                    `).join('');
                }
                
                updateTrendVisualization();
            }
        }
    } catch (e) {
        console.error('Error loading global history:', e);
        gameState.history = [];
    }
}

// Update trend visualization
function updateTrendVisualization() {
    if (!elements.trendItems) return;
    
    // Get category for multiplier
    const getCategory = (multiplier) => {
        if (multiplier >= 5.00) return 'high';
        if (multiplier >= 2.00) return 'medium';
        return 'low';
    };
    
    // Calculate bar height based on multiplier (normalized)
    const getBarHeight = (multiplier) => {
        const minHeight = 40;
        const maxHeight = 150;
        const normalizedValue = Math.min(multiplier / 10, 1); // Cap at 10x for visualization
        return minHeight + (normalizedValue * (maxHeight - minHeight));
    };
    
    // Render trend bars
    elements.trendItems.innerHTML = gameState.history.map((item, index) => {
        const category = getCategory(item.multiplier);
        const height = getBarHeight(item.multiplier);
        const roundNumber = gameState.history.length - index;
        
        return `
            <div class="trend-item" title="Round ${roundNumber}: ${item.multiplier.toFixed(2)}x">
                <div class="trend-bar ${category}" style="height: ${height}px;">
                    ${item.multiplier.toFixed(2)}x
                </div>
                <div class="trend-multiplier">#${roundNumber}</div>
            </div>
        `;
    }).reverse().join(''); // Reverse to show oldest first (left to right)
}

// Update statistics display
function updateStatistics() {
    if (!elements.totalBetsCount) return;
    
    const totalBets = gameState.totalWins + gameState.totalLosses;
    const winRate = totalBets > 0 ? ((gameState.totalWins / totalBets) * 100).toFixed(1) : 0;
    
    elements.totalBetsCount.textContent = totalBets;
    elements.totalWins.textContent = gameState.totalWins;
    elements.totalLosses.textContent = gameState.totalLosses;
    elements.winRate.textContent = winRate + '%';
}

// Update all displays
function updateDisplay() {
    // Show combined gaming balance (main + bonus)
    const totalGamingBalance = gameState.balance + gameState.bonusBalance;
    elements.balance.textContent = '₹' + totalGamingBalance;
    elements.currentBet.textContent = '₹' + gameState.currentBet;
    elements.potentialWin.textContent = '₹' + (gameState.currentBet * gameState.multiplier).toFixed(0);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    init();
    
    // Auto-sync balance every 5 seconds to detect admin approvals
    setInterval(syncBalanceFromDatabase, 5000);
});

// Sync balance from database (in case admin approved deposit)
function syncBalanceFromDatabase() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    
    // Get latest data from localStorage (database)
    const users = JSON.parse(localStorage.getItem('aviator_users') || '[]');
    const updatedUser = users.find(u => u.id === user.id);
    
    if (!updatedUser) return;
    
    // Check if balance changed (admin approved deposit)
    const oldBalance = user.balance || 0;
    const oldBonusBalance = user.bonusBalance || 0;
    const newBalance = updatedUser.balance || 0;
    const newBonusBalance = updatedUser.bonusBalance || 0;
    
    if (newBalance !== oldBalance || newBonusBalance !== oldBonusBalance) {
        // Balance changed! Update game state
        gameState.balance = newBalance;
        gameState.bonusBalance = newBonusBalance;
        
        // Update session storage
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update display
        updateDisplay();
        
        // Show notification if balance increased (deposit approved)
        const totalOld = oldBalance + oldBonusBalance;
        const totalNew = newBalance + newBonusBalance;
        
        if (totalNew > totalOld) {
            const increase = totalNew - totalOld;
            showDepositNotification(increase);
        }
        
        console.log('✅ Balance synced! Old: ₹' + totalOld + ' → New: ₹' + totalNew);
    }
}

// Show deposit notification
function showDepositNotification(amount) {
    const notification = document.createElement('div');
    notification.className = 'deposit-notification';
    notification.innerHTML = `
        <div style="font-size: 2em;">🎉</div>
        <div style="font-size: 1.5em; font-weight: bold; color: #10b981;">Deposit Approved!</div>
        <div style="font-size: 1.8em; margin-top: 10px;">+₹${amount}</div>
        <div style="font-size: 1em; margin-top: 5px; opacity: 0.8;">Added to your gaming balance</div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: slideInScale 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Play sound
    playSound(sounds.win);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Add CSS animations for notification
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInScale {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(notificationStyle);

// Check if user is logged in
function checkAuthentication() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Redirect to login page
        window.location.href = 'auth.html';
        return;
    }
    
    // Display user info
    const user = JSON.parse(currentUser);
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.name;
    }
    
    // Load user balance
    gameState.balance = user.balance || 0;
    gameState.bonusBalance = user.bonusBalance || 0;
    updateDisplay();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }
}

// Save user balance to database
function saveUserBalance() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    user.balance = gameState.balance;
    user.bonusBalance = gameState.bonusBalance;
    
    // Save user-specific statistics (NOT global history)
    user.gameStats = {
        totalBets: gameState.totalBets,
        totalWins: gameState.totalWins,
        totalLosses: gameState.totalLosses
    };
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('aviator_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('aviator_users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Load statistics from user data
function loadStatistics() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    
    if (user.gameStats) {
        gameState.totalBets = user.gameStats.totalBets || 0;
        gameState.totalWins = user.gameStats.totalWins || 0;
        gameState.totalLosses = user.gameStats.totalLosses || 0;
        // Note: history is now global, loaded separately
        
        // Update displays
        updateStatistics();
    }
}

// Save current game state (for refresh persistence)
function saveGameState() {
    const gameStateData = {
        balance: gameState.balance,
        bonusBalance: gameState.bonusBalance,
        currentBet: gameState.currentBet,
        multiplier: gameState.multiplier,
        isPlaying: gameState.isPlaying,
        roundPhase: gameState.roundPhase,
        userHasBet: gameState.userHasBet,
        crashPoint: gameState.crashPoint,
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('aviator_game_state', JSON.stringify(gameStateData));
}

// Load game state on refresh
function loadGameState() {
    const savedState = sessionStorage.getItem('aviator_game_state');
    if (!savedState) return;
    
    try {
        const state = JSON.parse(savedState);
        const now = Date.now();
        const timeDiff = now - state.timestamp;
        
        // If saved state is less than 30 seconds old, restore it
        if (timeDiff < 30000) {
            gameState.currentBet = state.currentBet || 0;
            gameState.multiplier = state.multiplier || 1.00;
            gameState.isPlaying = state.isPlaying || false;
            gameState.roundPhase = state.roundPhase || 'waiting';
            gameState.userHasBet = state.userHasBet || false;
            gameState.crashPoint = state.crashPoint || 0;
            
            // Update UI to reflect restored state
            if (elements.multiplier) {
                elements.multiplier.textContent = gameState.multiplier.toFixed(2) + 'x';
            }
            
            if (gameState.isPlaying && gameState.currentBet > 0) {
                elements.currentBet.textContent = '₹' + gameState.currentBet;
                elements.potentialWin.textContent = '₹' + (gameState.currentBet * gameState.multiplier).toFixed(0);
            }
            
            console.log('🔄 Game state restored from refresh!');
        } else {
            // State too old, clear it
            sessionStorage.removeItem('aviator_game_state');
        }
    } catch (e) {
        console.error('Error loading game state:', e);
        sessionStorage.removeItem('aviator_game_state');
    }
}

// Track bet activity
function trackBetActivity(betAmount) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'bet',
        amount: betAmount,
        timestamp: new Date().toISOString()
    });
    
    // Update total bets
    user.totalBets = (user.totalBets || 0) + betAmount;
    
    // Save
    const users = JSON.parse(localStorage.getItem('aviator_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('aviator_users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Update wagering progress
function updateWageringProgress(profit) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    
    // Update deposit amount wagering (1x)
    const depositWagerRequired = user.depositAmount || 0;
    if (depositWagerRequired > 0 && (user.depositWagered || 0) < depositWagerRequired) {
        user.depositWagered = Math.min((user.depositWagered || 0) + gameState.currentBet, depositWagerRequired);
        
        if (user.depositWagered >= depositWagerRequired) {
            alert('🎉 Congratulations!\n\nYou have completed deposit wagering!\nYou can now withdraw your deposit amount.');
        }
    }
    
    // Update bonus wagering (10x of bonus amount)
    const bonusWagerRequired = (user.bonusBalance || 0) * 10;
    if (bonusWagerRequired > 0 && (user.bonusWagered || 0) < bonusWagerRequired) {
        user.bonusWagered = Math.min((user.bonusWagered || 0) + gameState.currentBet, bonusWagerRequired);
        
        if (user.bonusWagered >= bonusWagerRequired) {
            alert('🎉 Congratulations!\n\nYou have completed bonus wagering!\nBonus will be transferred to main balance.');
            // Transfer bonus to main balance
            user.balance += user.bonusBalance;
            user.bonusBalance = 0;
            user.bonusWagered = 0;
            gameState.balance = user.balance;
            gameState.bonusBalance = 0;
        }
    }
    
    // Track activity
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'win',
        amount: profit,
        multiplier: gameState.multiplier.toFixed(2),
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 activities
    if (user.activityLog.length > 50) {
        user.activityLog = user.activityLog.slice(0, 50);
    }
    
    // Update stats
    user.totalWins = (user.totalWins || 0) + profit;
    user.gamesPlayed = (user.gamesPlayed || 0) + 1;
    
    // Save updated user
    const users = JSON.parse(localStorage.getItem('aviator_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('aviator_users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
}
