// Database keys
const DB_KEY = 'aviator_users';
const TRANSACTIONS_KEY = 'aviator_transactions';

// Get all users
function getAllUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Get all transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
}

// Save transactions
function saveTransactions(transactions) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get user name by ID
function getUserName(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
}

// Show tab
function showTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Load all transactions
function loadAllTransactions() {
    const transactions = getTransactions();
    
    // Update stats
    const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
    const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length;
    const approved = transactions.filter(t => t.status === 'approved').length;
    
    document.getElementById('pendingDeposits').textContent = pendingDeposits;
    document.getElementById('pendingWithdrawals').textContent = pendingWithdrawals;
    document.getElementById('totalApproved').textContent = approved;
    
    // Load deposits
    loadDeposits();
    
    // Load withdrawals
    loadWithdrawals();
    
    // Load history
    loadHistory();
}

// Load deposits
function loadDeposits() {
    const transactions = getTransactions();
    const deposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
    
    const container = document.getElementById('depositsList');
    
    if (deposits.length === 0) {
        container.innerHTML = '<div class="no-transactions"><i class="fas fa-inbox"></i><br>No pending deposits</div>';
        return;
    }
    
    container.innerHTML = deposits.map(t => `
        <div class="transaction-card">
            <div class="transaction-header">
                <span class="transaction-id">Deposit #${t.id}</span>
                <span class="transaction-status status-${t.status}">${t.status.toUpperCase()}</span>
            </div>
            <div class="transaction-details">
                <div class="detail-item">
                    <div class="detail-label">User</div>
                    <div class="detail-value">${getUserName(t.userId)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">₹${t.amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Bonus (200%)</div>
                    <div class="detail-value">₹${t.bonusAmount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Credit</div>
                    <div class="detail-value">₹${t.amount + t.bonusAmount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Payment Method</div>
                    <div class="detail-value">${t.paymentMethod === 'googlepay' ? 'Google Pay' : 'PhonePe'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Transaction ID</div>
                    <div class="detail-value">${t.transactionId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">UPI Paid To</div>
                    <div class="detail-value">${t.upiId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${formatDate(t.createdAt)}</div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-approve" onclick="approveDeposit(${t.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectTransaction(${t.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
}

// Load withdrawals
function loadWithdrawals() {
    const transactions = getTransactions();
    const withdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');
    
    const container = document.getElementById('withdrawalsList');
    
    if (withdrawals.length === 0) {
        container.innerHTML = '<div class="no-transactions"><i class="fas fa-inbox"></i><br>No pending withdrawals</div>';
        return;
    }
    
    container.innerHTML = withdrawals.map(t => `
        <div class="transaction-card">
            <div class="transaction-header">
                <span class="transaction-id">Withdrawal #${t.id}</span>
                <span class="transaction-status status-${t.status}">${t.status.toUpperCase()}</span>
            </div>
            <div class="transaction-details">
                <div class="detail-item">
                    <div class="detail-label">User</div>
                    <div class="detail-value">${getUserName(t.userId)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">₹${t.amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">User UPI ID</div>
                    <div class="detail-value">${t.upiId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${formatDate(t.createdAt)}</div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-approve" onclick="approveWithdrawal(${t.id})">
                    <i class="fas fa-check"></i> Approve & Send Money
                </button>
                <button class="btn-reject" onclick="rejectTransaction(${t.id})">
                    <i class="fas fa-times"></i> Reject & Refund
                </button>
            </div>
        </div>
    `).join('');
}

// Load history
function loadHistory() {
    const transactions = getTransactions();
    const history = transactions.filter(t => t.status !== 'pending');
    
    const container = document.getElementById('historyList');
    
    if (history.length === 0) {
        container.innerHTML = '<div class="no-transactions"><i class="fas fa-inbox"></i><br>No transaction history</div>';
        return;
    }
    
    container.innerHTML = history.map(t => `
        <div class="transaction-card">
            <div class="transaction-header">
                <span class="transaction-id">${t.type === 'deposit' ? 'Deposit' : 'Withdrawal'} #${t.id}</span>
                <span class="transaction-status status-${t.status}">${t.status.toUpperCase()}</span>
            </div>
            <div class="transaction-details">
                <div class="detail-item">
                    <div class="detail-label">User</div>
                    <div class="detail-value">${getUserName(t.userId)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">₹${t.amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${formatDate(t.createdAt)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Approve deposit
function approveDeposit(transactionId) {
    if (!confirm('Approve this deposit?')) return;
    
    const transactions = getTransactions();
    const users = getAllUsers();
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users.find(u => u.id === transaction.userId);
    if (!user) return;
    
    // Update transaction status
    transaction.status = 'approved';
    saveTransactions(transactions);
    
    // Credit user balance
    user.balance = (user.balance || 0) + transaction.amount;
    user.bonusBalance = (user.bonusBalance || 0) + transaction.bonusAmount;
    user.depositAmount = (user.depositAmount || 0) + transaction.amount; // Track for 1x wager
    user.totalDeposits = (user.totalDeposits || 0) + transaction.amount;
    
    // Add to activity log
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'deposit_approved',
        amount: transaction.amount,
        bonus: transaction.bonusAmount,
        transactionId: transaction.transactionId,
        timestamp: new Date().toISOString()
    });
    
    saveUsers(users);
    
    alert('✅ Deposit approved!\nUser: ' + user.name + '\nCredited: ₹' + transaction.amount + '\nBonus: ₹' + transaction.bonusAmount + '\n\nWager requirements:\n- Deposit (1x): ₹' + transaction.amount + '\n- Bonus (10x): ₹' + (transaction.bonusAmount * 10));
    
    loadAllTransactions();
}

// Approve withdrawal
function approveWithdrawal(transactionId) {
    if (!confirm('Approve this withdrawal?\nMake sure you have sent money to the user\'s UPI ID!')) return;
    
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) return;
    
    // Update transaction status
    transaction.status = 'approved';
    saveTransactions(transactions);
    
    alert('✅ Withdrawal approved!\nAmount: ₹' + transaction.amount + '\nUPI ID: ' + transaction.upiId + '\n\nPlease send money to this UPI ID now!');
    
    loadAllTransactions();
}

// Reject transaction
function rejectTransaction(transactionId) {
    if (!confirm('Reject this transaction?')) return;
    
    const transactions = getTransactions();
    const users = getAllUsers();
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Update transaction status
    transaction.status = 'rejected';
    saveTransactions(transactions);
    
    // If withdrawal, refund the amount
    if (transaction.type === 'withdraw') {
        const user = users.find(u => u.id === transaction.userId);
        if (user) {
            user.balance = (user.balance || 0) + transaction.amount;
            saveUsers(users);
        }
    }
    
    alert('❌ Transaction rejected!');
    
    loadAllTransactions();
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadAllTransactions);

// Auto refresh every 30 seconds
setInterval(loadAllTransactions, 30000);
