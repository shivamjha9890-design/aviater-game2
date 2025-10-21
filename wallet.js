// Database keys
const DB_KEY = 'aviator_users';
const TRANSACTIONS_KEY = 'aviator_transactions';

// Get current user
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'auth.html';
        return null;
    }
    return JSON.parse(userStr);
}

// Update user in database
function updateUser(user) {
    const users = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem(DB_KEY, JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Get all transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
}

// Save transactions
function saveTransactions(transactions) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// Add transaction
function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.unshift(transaction);
    saveTransactions(transactions);
}

// Load wallet data
function loadWalletData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update balances - Show gaming balance (combined)
    const gamingBalance = (user.balance || 0) + (user.bonusBalance || 0);
    document.getElementById('gamingBalance').textContent = '₹' + gamingBalance;
    document.getElementById('mainBalance').textContent = user.balance || 0;
    document.getElementById('bonusBalance').textContent = user.bonusBalance || 0;
    
    // Update wager progress
    updateWagerProgress(user);
    
    // Load transactions
    loadTransactions(user.id);
    
    // Show bonus popup if first time
    if (!user.hasSeenBonusPopup) {
        setTimeout(() => {
            document.getElementById('bonusPopup').classList.add('active');
        }, 500);
    }
}

// Update wager progress bars
function updateWagerProgress(user) {
    // Check if user took bonus with last deposit
    const hasBonus = (user.bonusBalance || 0) > 0;
    const depositAmount = user.depositAmount || 0;
    
    if (hasBonus) {
        // User took 200% bonus - need 10x wagering
        const wagerRequired = (user.bonusBalance || 0) * 10;
        const wagered = user.bonusWagered || 0;
        const progress = wagerRequired > 0 ? Math.min((wagered / wagerRequired) * 100, 100) : 100;
        
        document.getElementById('wagerLabel').innerHTML = '🎁 Bonus Wager (200%)';
        document.getElementById('wagerAmount').textContent = `₹${wagered} / ₹${wagerRequired}`;
        document.getElementById('wagerProgress').style.width = progress + '%';
        document.getElementById('wagerNote').textContent = 'Wager 10x your bonus amount to unlock withdrawal';
    } else if (depositAmount > 0) {
        // User deposited without bonus - need 1x wagering
        const wagerRequired = depositAmount;
        const wagered = user.depositWagered || 0;
        const progress = wagerRequired > 0 ? Math.min((wagered / wagerRequired) * 100, 100) : 100;
        
        document.getElementById('wagerLabel').innerHTML = '💵 Deposit Wager (1x)';
        document.getElementById('wagerAmount').textContent = `₹${wagered} / ₹${wagerRequired}`;
        document.getElementById('wagerProgress').style.width = progress + '%';
        document.getElementById('wagerNote').textContent = 'Wager 1x your deposit amount to unlock withdrawal';
    } else {
        // No wagering requirement (signup bonus only)
        document.getElementById('wagerLabel').innerHTML = '✅ No Wager Required';
        document.getElementById('wagerAmount').textContent = `Complete`;
        document.getElementById('wagerProgress').style.width = '100%';
        document.getElementById('wagerNote').textContent = 'You can withdraw anytime!';
    }
    
    // Calculate withdrawable amount
    const wagerComplete = isWagerComplete(user);
    const withdrawable = wagerComplete ? user.balance : 0;
    document.getElementById('withdrawableAmount').textContent = '₹' + withdrawable;
}

// Check if wager is complete
function isWagerComplete(user) {
    const hasBonus = (user.bonusBalance || 0) > 0;
    const depositAmount = user.depositAmount || 0;
    
    if (hasBonus) {
        // Need to complete 10x bonus wagering
        const wagerRequired = (user.bonusBalance || 0) * 10;
        return (user.bonusWagered || 0) >= wagerRequired;
    } else if (depositAmount > 0) {
        // Need to complete 1x deposit wagering
        return (user.depositWagered || 0) >= depositAmount;
    } else {
        // No requirement (signup bonus only)
        return true;
    }
}

// Load user transactions
function loadTransactions(userId) {
    const allTransactions = getTransactions();
    const userTransactions = allTransactions.filter(t => t.userId === userId);
    
    const container = document.getElementById('transactionList');
    
    if (userTransactions.length === 0) {
        container.innerHTML = '<p class="no-transactions">No transactions yet</p>';
        return;
    }
    
    container.innerHTML = userTransactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-type">
                    ${t.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'}
                </div>
                <div class="transaction-date">${formatDate(t.createdAt)}</div>
                <div class="transaction-date">${t.status}</div>
            </div>
            <div class="transaction-amount status-${t.status.toLowerCase()}">
                ${t.type === 'deposit' ? '+' : '-'}₹${t.amount}
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show/Hide modals
function showDepositModal() {
    document.getElementById('depositModal').classList.add('active');
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.remove('active');
}

function showWithdrawModal() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Check if wagering is complete
    if (!isWagerComplete(user)) {
        const hasBonus = (user.bonusBalance || 0) > 0;
        if (hasBonus) {
            const wagerRequired = (user.bonusBalance || 0) * 10;
            const wagered = user.bonusWagered || 0;
            alert('⚠️ Complete bonus wagering first!\n\nYou need to wager 10x your bonus amount.\n\nRequired: ₹' + wagerRequired + '\nCompleted: ₹' + wagered + '\nRemaining: ₹' + (wagerRequired - wagered));
        } else {
            const wagerRequired = user.depositAmount || 0;
            const wagered = user.depositWagered || 0;
            alert('⚠️ Complete deposit wagering first!\n\nYou need to wager 1x your deposit amount.\n\nRequired: ₹' + wagerRequired + '\nCompleted: ₹' + wagered + '\nRemaining: ₹' + (wagerRequired - wagered));
        }
        return;
    }
    
    if (user.balance < 100) {
        alert('⚠️ Minimum withdrawal is ₹100!\nYour current withdrawable balance: ₹' + user.balance);
        return;
    }
    
    document.getElementById('withdrawModal').classList.add('active');
}

function closeWithdrawModal() {
    document.getElementById('withdrawModal').classList.remove('active');
}

// Close bonus popup
function closeBonusPopup() {
    document.getElementById('bonusPopup').classList.remove('active');
    const user = getCurrentUser();
    if (user) {
        user.hasSeenBonusPopup = true;
        updateUser(user);
    }
}

// Calculate total receive on deposit
document.addEventListener('DOMContentLoaded', function() {
    const depositInput = document.getElementById('depositAmount');
    const acceptBonus = document.getElementById('acceptBonus');
    
    if (depositInput) {
        depositInput.addEventListener('input', updateDepositPreview);
    }
    
    if (acceptBonus) {
        acceptBonus.addEventListener('change', updateDepositPreview);
    }
    
    loadWalletData();
});

function updateDepositPreview() {
    const amount = parseInt(document.getElementById('depositAmount').value) || 0;
    const acceptBonus = document.getElementById('acceptBonus').checked;
    
    if (acceptBonus) {
        const bonus = amount * 2; // 200% bonus
        const total = amount + bonus;
        document.getElementById('totalReceive').textContent = '₹' + total + ' (₹' + amount + ' + ₹' + bonus + ' bonus)';
    } else {
        document.getElementById('totalReceive').textContent = '₹' + amount + ' (No bonus)';
    }
}

// Copy UPI ID
function copyUPI() {
    const upiId = document.getElementById('upiId').textContent;
    navigator.clipboard.writeText(upiId).then(() => {
        alert('✅ UPI ID copied: ' + upiId);
    });
}

// Handle deposit
function handleDeposit(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) return false;
    
    const amount = parseInt(document.getElementById('depositAmount').value);
    const acceptBonus = document.getElementById('acceptBonus').checked;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const transactionId = document.getElementById('transactionId').value.trim();
    
    if (amount < 100) {
        alert('❌ Minimum deposit is ₹100');
        return false;
    }
    
    // Create deposit transaction
    const bonusAmount = acceptBonus ? amount * 2 : 0;
    const transaction = {
        id: Date.now(),
        userId: user.id,
        type: 'deposit',
        amount: amount,
        bonusAmount: bonusAmount,
        acceptedBonus: acceptBonus,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        upiId: '7011354220-4@ybl',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    addTransaction(transaction);
    
    const totalReceive = amount + bonusAmount;
    
    // Show animated waiting screen
    showDepositWaitingScreen(amount, bonusAmount, totalReceive, acceptBonus);
    
    closeDepositModal();
    loadTransactions(user.id);
    
    // Reset form
    document.getElementById('depositForm').reset();
    document.getElementById('totalReceive').textContent = '₹0';
    
    return false;
}

// Show animated waiting screen for deposit approval
function showDepositWaitingScreen(amount, bonusAmount, totalReceive, acceptBonus) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease-out;
    `;
    
    // Create content
    const content = document.createElement('div');
    content.style.cssText = `
        text-align: center;
        color: white;
        max-width: 500px;
        padding: 40px;
        animation: slideInUp 0.6s ease-out;
    `;
    
    content.innerHTML = `
        <div class="loading-spinner" style="
            width: 120px;
            height: 120px;
            border: 8px solid rgba(255, 255, 255, 0.3);
            border-top: 8px solid white;
            border-radius: 50%;
            margin: 0 auto 30px;
            animation: spin 1s linear infinite;
        "></div>
        
        <div style="font-size: 3em; margin-bottom: 20px;">⏳</div>
        
        <h1 style="font-size: 2.5em; margin-bottom: 15px; font-weight: 900;">Deposit Request Submitted!</h1>
        
        <p style="font-size: 1.3em; margin-bottom: 30px; opacity: 0.9;">Waiting for admin approval...</p>
        
        <div style="
            background: rgba(255, 255, 255, 0.2);
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        ">
            <div style="margin-bottom: 15px;">
                <span style="font-size: 1.1em; opacity: 0.8;">Deposit Amount</span>
                <div style="font-size: 2em; font-weight: bold; margin-top: 5px;">₹${amount}</div>
            </div>
            ${bonusAmount > 0 ? `
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 1.1em; opacity: 0.8;">200% Bonus</span>
                    <div style="font-size: 1.8em; font-weight: bold; margin-top: 5px; color: #10b981;">+₹${bonusAmount}</div>
                </div>
            ` : ''}
            <div style="padding-top: 15px; border-top: 2px solid rgba(255, 255, 255, 0.3);">
                <span style="font-size: 1.1em; opacity: 0.8;">Total You'll Receive</span>
                <div style="font-size: 2.2em; font-weight: bold; margin-top: 5px; color: #fbbf24;">₹${totalReceive}</div>
            </div>
        </div>
        
        <div style="
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            border-left: 4px solid #10b981;
        ">
            <div style="font-size: 1.1em; margin-bottom: 10px;">💡 <strong>What happens next?</strong></div>
            <div style="font-size: 0.95em; line-height: 1.6; opacity: 0.9;">
                ${acceptBonus ? 
                    `✅ Admin will verify your deposit<br>
                     ✅ ₹${amount} added to main balance (1x wager)<br>
                     ✅ ₹${bonusAmount} added to bonus balance (10x wager)<br>
                     ✅ Start playing once approved!` : 
                    `✅ Admin will verify your deposit<br>
                     ✅ ₹${amount} added to your balance (1x wager)<br>
                     ✅ Start playing once approved!`
                }
            </div>
        </div>
        
        <div style="
            font-size: 1.2em;
            margin-bottom: 20px;
            animation: pulse 2s ease-in-out infinite;
        ">
            🎮 Redirecting to game in <span id="countdown" style="font-weight: bold; font-size: 1.3em;">5</span> seconds...
        </div>
        
        <button id="goNowBtn" style="
            padding: 18px 40px;
            font-size: 1.3em;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
        ">
            🎮 Go to Game Now
        </button>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
    
    // Countdown and redirect
    let countdown = 5;
    const countdownEl = content.querySelector('#countdown');
    const interval = setInterval(() => {
        countdown--;
        if (countdownEl) {
            countdownEl.textContent = countdown;
        }
        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
        }
    }, 1000);
    
    // Go Now button
    const goNowBtn = content.querySelector('#goNowBtn');
    goNowBtn.addEventListener('click', () => {
        clearInterval(interval);
        window.location.href = 'index.html';
    });
    
    // Hover effect
    goNowBtn.addEventListener('mouseenter', () => {
        goNowBtn.style.transform = 'translateY(-3px)';
        goNowBtn.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.6)';
    });
    goNowBtn.addEventListener('mouseleave', () => {
        goNowBtn.style.transform = 'translateY(0)';
        goNowBtn.style.boxShadow = '0 5px 20px rgba(16, 185, 129, 0.4)';
    });
}

// Handle withdraw
function handleWithdraw(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) return false;
    
    const amount = parseInt(document.getElementById('withdrawAmount').value);
    const upiId = document.getElementById('withdrawUPI').value.trim();
    
    if (amount < 100) {
        alert('❌ Minimum withdrawal is ₹100');
        return false;
    }
    
    if (amount > user.balance) {
        alert('❌ Insufficient balance!\nAvailable: ₹' + user.balance);
        return false;
    }
    
    // Validate UPI ID format
    if (!upiId.includes('@')) {
        alert('❌ Please enter a valid UPI ID (e.g., yourname@paytm)');
        return false;
    }
    
    // Create withdrawal transaction
    const transaction = {
        id: Date.now(),
        userId: user.id,
        type: 'withdraw',
        amount: amount,
        upiId: upiId,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Deduct from balance immediately
    user.balance -= amount;
    updateUser(user);
    
    addTransaction(transaction);
    
    alert('✅ Withdrawal request submitted!\nAmount: ₹' + amount + '\nUPI ID: ' + upiId + '\n\nYour request is pending approval.');
    
    closeWithdrawModal();
    loadWalletData();
    
    // Reset form
    document.getElementById('withdrawForm').reset();
    
    return false;
}
