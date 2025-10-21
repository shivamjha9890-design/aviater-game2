// Database keys
const DB_KEY = 'aviator_users';
const TRANSACTIONS_KEY = 'aviator_transactions';

let currentViewUserId = null;

// Get all data
function getAllUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
}

function saveTransactions(transactions) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show tab
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Load all data
function loadAllData() {
    const users = getAllUsers();
    const transactions = getTransactions();
    
    // Update stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('pendingDeposits').textContent = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
    document.getElementById('pendingWithdrawals').textContent = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').length;
    
    const totalDeposits = users.reduce((sum, u) => sum + (u.totalDeposits || 0), 0);
    const totalWithdrawals = users.reduce((sum, u) => sum + (u.totalWithdrawals || 0), 0);
    document.getElementById('totalDepositsAmount').textContent = '₹' + totalDeposits;
    document.getElementById('totalWithdrawalsAmount').textContent = '₹' + totalWithdrawals;
    
    // Load each section
    loadUsersTable();
    loadDepositsTab();
    loadWithdrawalsTab();
    loadWagerSettings();
}

// Load users table
function loadUsersTable() {
    const users = getAllUsers();
    const tbody = document.getElementById('usersTable');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map((user, index) => {
        const depositWager = `${user.depositWagered || 0}/${user.depositAmount || 0}`;
        const bonusWager = `${user.bonusWagered || 0}/${(user.bonusBalance || 0) * 10}`;
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email || user.phone}</td>
                <td>₹${user.balance || 0}</td>
                <td>₹${user.bonusBalance || 0}</td>
                <td>
                    <small>Deposit: ${depositWager}</small><br>
                    <small>Bonus: ${bonusWager}</small>
                </td>
                <td>₹${user.totalBets || 0}</td>
                <td>
                    <button class="btn btn-view" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// View user details
function viewUserDetails(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentViewUserId = userId;
    document.getElementById('modalUserName').textContent = user.name + ' - Complete Profile';
    
    const depositWagerPct = user.depositAmount > 0 ? ((user.depositWagered || 0) / user.depositAmount * 100).toFixed(1) : 0;
    const bonusWagerReq = (user.bonusBalance || 0) * 10;
    const bonusWagerPct = bonusWagerReq > 0 ? ((user.bonusWagered || 0) / bonusWagerReq * 100).toFixed(1) : 0;
    
    const content = `
        <div class="user-detail-grid">
            <div class="detail-card">
                <div class="detail-label">User ID</div>
                <div class="detail-value">${user.id}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Main Balance</div>
                <div class="detail-value">₹${user.balance || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Bonus Balance</div>
                <div class="detail-value">₹${user.bonusBalance || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Total Deposits</div>
                <div class="detail-value">₹${user.totalDeposits || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Total Withdrawals</div>
                <div class="detail-value">₹${user.totalWithdrawals || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Total Bets</div>
                <div class="detail-value">₹${user.totalBets || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Total Wins</div>
                <div class="detail-value">₹${user.totalWins || 0}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Games Played</div>
                <div class="detail-value">${user.gamesPlayed || 0}</div>
            </div>
        </div>
        
        <h3>Wagering Progress</h3>
        <div class="user-detail-grid">
            <div class="detail-card">
                <div class="detail-label">Deposit Wager (1x)</div>
                <div class="detail-value">₹${user.depositWagered || 0} / ₹${user.depositAmount || 0}</div>
                <small>${depositWagerPct}% Complete</small>
            </div>
            <div class="detail-card">
                <div class="detail-label">Bonus Wager (10x)</div>
                <div class="detail-value">₹${user.bonusWagered || 0} / ₹${bonusWagerReq}</div>
                <small>${bonusWagerPct}% Complete</small>
            </div>
        </div>
        
        <div class="wager-edit-form">
            <h3>Edit Wager Requirements</h3>
            <label>Deposit Amount to Wager:</label>
            <input type="number" id="editDepositAmount" value="${user.depositAmount || 0}" placeholder="Amount">
            
            <label>Deposit Wagered (Current):</label>
            <input type="number" id="editDepositWagered" value="${user.depositWagered || 0}" placeholder="Wagered">
            
            <label>Bonus Wagered (Current):</label>
            <input type="number" id="editBonusWagered" value="${user.bonusWagered || 0}" placeholder="Wagered">
            
            <button class="btn btn-edit" onclick="saveWagerEdit()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
        
        <h3>Recent Activity (Last 20)</h3>
        <div class="activity-log">
            ${user.activityLog && user.activityLog.length > 0 ? 
                user.activityLog.slice(0, 20).map(activity => `
                    <div class="activity-item">
                        <strong>${activity.type.toUpperCase()}</strong> - 
                        ₹${activity.amount} 
                        ${activity.multiplier ? `at ${activity.multiplier}x` : ''}
                        <br>
                        <small>${formatDate(activity.timestamp)}</small>
                    </div>
                `).join('') : 
                '<p>No activity recorded</p>'
            }
        </div>
    `;
    
    document.getElementById('userDetailsContent').innerHTML = content;
    document.getElementById('userModal').classList.add('active');
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    currentViewUserId = null;
}

// Save wager edit
function saveWagerEdit() {
    if (!currentViewUserId) return;
    
    const users = getAllUsers();
    const user = users.find(u => u.id === currentViewUserId);
    if (!user) return;
    
    user.depositAmount = parseInt(document.getElementById('editDepositAmount').value) || 0;
    user.depositWagered = parseInt(document.getElementById('editDepositWagered').value) || 0;
    user.bonusWagered = parseInt(document.getElementById('editBonusWagered').value) || 0;
    
    saveUsers(users);
    alert('✅ Wager requirements updated!');
    loadAllData();
    closeUserModal();
}

// Load deposits tab
function loadDepositsTab() {
    const transactions = getTransactions();
    const deposits = transactions.filter(t => t.type === 'deposit');
    
    const container = document.getElementById('depositsList');
    
    if (deposits.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">No deposit requests</p>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Bonus</th>
                    <th>UTR/Transaction ID</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${deposits.map(t => {
                    const user = getAllUsers().find(u => u.id === t.userId);
                    const bonusText = t.acceptedBonus ? `₹${t.bonusAmount} ✅` : 'Declined';
                    return `
                        <tr>
                            <td>${t.id}</td>
                            <td>${user ? user.name : 'Unknown'}</td>
                            <td>₹${t.amount}</td>
                            <td>${bonusText}</td>
                            <td><strong>${t.transactionId}</strong></td>
                            <td>${t.paymentMethod === 'googlepay' ? 'Google Pay' : 'PhonePe'}</td>
                            <td>${formatDate(t.createdAt)}</td>
                            <td><span class="status-badge status-${t.status}">${t.status.toUpperCase()}</span></td>
                            <td>
                                ${t.status === 'pending' ? `
                                    <button class="btn btn-approve" onclick="approveDeposit(${t.id})">Approve</button>
                                    <button class="btn btn-reject" onclick="rejectDeposit(${t.id})">Reject</button>
                                ` : '—'}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Load withdrawals tab
function loadWithdrawalsTab() {
    const transactions = getTransactions();
    const withdrawals = transactions.filter(t => t.type === 'withdraw');
    
    const container = document.getElementById('withdrawalsList');
    
    if (withdrawals.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">No withdrawal requests</p>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>UPI ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${withdrawals.map(t => {
                    const user = getAllUsers().find(u => u.id === t.userId);
                    return `
                        <tr>
                            <td>${t.id}</td>
                            <td>${user ? user.name : 'Unknown'}</td>
                            <td>₹${t.amount}</td>
                            <td><strong>${t.upiId}</strong></td>
                            <td>${formatDate(t.createdAt)}</td>
                            <td><span class="status-badge status-${t.status}">${t.status.toUpperCase()}</span></td>
                            <td>
                                ${t.status === 'pending' ? `
                                    <button class="btn btn-approve" onclick="approveWithdrawal(${t.id})">Approve</button>
                                    <button class="btn btn-reject" onclick="rejectWithdrawal(${t.id})">Reject</button>
                                ` : '—'}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Load wager settings
function loadWagerSettings() {
    const container = document.getElementById('wagerSettingsContent');
    container.innerHTML = `
        <div style="background: #f8f9fa; padding: 30px; border-radius: 15px;">
            <h3>Current Wager Rules</h3>
            <ul style="line-height: 2; font-size: 1.1em;">
                <li><strong>Signup Bonus (₹50):</strong> No wager required - User can withdraw immediately</li>
                <li><strong>Deposit WITHOUT Bonus:</strong> 1x wager required (e.g., deposit ₹100 → wager ₹100)</li>
                <li><strong>Deposit WITH 200% Bonus:</strong> 10x wager required on bonus amount (e.g., ₹200 bonus → wager ₹2000)</li>
            </ul>
            
            <h3 style="margin-top: 30px;">How It Works</h3>
            <ul style="line-height: 2;">
                <li><strong>User Deposits ₹100 WITHOUT Bonus:</strong>
                    <ul>
                        <li>Gaming Balance: ₹100</li>
                        <li>Must wager 1x (₹100) to unlock withdrawal</li>
                    </ul>
                </li>
                <li><strong>User Deposits ₹100 WITH 200% Bonus:</strong>
                    <ul>
                        <li>Gaming Balance: ₹300 (₹100 + ₹200 bonus)</li>
                        <li>Must wager 10x of bonus (₹2000) to unlock withdrawal</li>
                    </ul>
                </li>
                <li>Every bet placed counts toward wagering progress</li>
                <li>User can withdraw only when wager requirement is complete</li>
                <li>You can manually adjust wager progress from user details</li>
            </ul>
            
            <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 10px; border: 2px solid #667eea;">
                <h4>Quick Actions</h4>
                <button class="btn btn-edit" onclick="resetAllWagers()">
                    <i class="fas fa-redo"></i> Reset All User Wagers
                </button>
            </div>
        </div>
    `;
}

// Approve deposit
function approveDeposit(transactionId) {
    if (!confirm('Approve this deposit? Make sure you have received the payment!')) return;
    
    const transactions = getTransactions();
    const users = getAllUsers();
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users.find(u => u.id === transaction.userId);
    if (!user) return;
    
    // Update transaction status
    transaction.status = 'approved';
    
    // Credit user balances based on whether they accepted bonus
    user.balance = (user.balance || 0) + transaction.amount; // Main balance always gets deposit
    
    if (transaction.acceptedBonus && transaction.bonusAmount > 0) {
        // User accepted 200% bonus - add to bonus balance
        user.bonusBalance = (user.bonusBalance || 0) + transaction.bonusAmount;
        // Reset previous deposit tracking and set new bonus wager requirement
        user.depositAmount = 0;
        user.depositWagered = 0;
        user.bonusWagered = 0; // Reset bonus wager for new bonus
    } else {
        // User rejected bonus - track for 1x wagering
        user.depositAmount = (user.depositAmount || 0) + transaction.amount;
        user.depositWagered = user.depositWagered || 0; // Keep existing progress
        // Clear any old bonus
        user.bonusBalance = 0;
        user.bonusWagered = 0;
    }
    
    user.totalDeposits = (user.totalDeposits || 0) + transaction.amount;
    
    // Add to activity log
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'deposit_approved',
        amount: transaction.amount,
        bonus: transaction.bonusAmount || 0,
        acceptedBonus: transaction.acceptedBonus,
        timestamp: new Date().toISOString()
    });
    
    // Save everything
    saveTransactions(transactions);
    saveUsers(users);
    
    // Update session if this user is currently logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const sessionUser = JSON.parse(currentUser);
        if (sessionUser.id === user.id) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
    }
    
    // Show appropriate message
    if (transaction.acceptedBonus && transaction.bonusAmount > 0) {
        alert('✅ Deposit Approved!\n\nUser: ' + user.name + '\n\nCredited to Gaming Balance:\n• Deposit: ₹' + transaction.amount + '\n• Bonus (200%): ₹' + transaction.bonusAmount + '\n• Total: ₹' + (transaction.amount + transaction.bonusAmount) + '\n\nWager Requirement:\n• 10x of bonus: ₹' + (transaction.bonusAmount * 10));
    } else {
        alert('✅ Deposit Approved!\n\nUser: ' + user.name + '\n\nCredited to Gaming Balance:\n• Deposit: ₹' + transaction.amount + '\n\nWager Requirement:\n• 1x of deposit: ₹' + transaction.amount);
    }
    
    loadAllData();
}

// Reject deposit
function rejectDeposit(transactionId) {
    if (!confirm('Reject this deposit?')) return;
    
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    transaction.status = 'rejected';
    saveTransactions(transactions);
    
    alert('❌ Deposit Rejected');
    loadAllData();
}

// Approve withdrawal
function approveWithdrawal(transactionId) {
    if (!confirm('Approve withdrawal? Send ₹' + 'to user UPI first!')) return;
    
    const transactions = getTransactions();
    const users = getAllUsers();
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users.find(u => u.id === transaction.userId);
    if (!user) return;
    
    transaction.status = 'approved';
    user.totalWithdrawals = (user.totalWithdrawals || 0) + transaction.amount;
    
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'withdrawal_approved',
        amount: transaction.amount,
        timestamp: new Date().toISOString()
    });
    
    saveTransactions(transactions);
    saveUsers(users);
    
    alert('✅ Withdrawal Approved!\nSend ₹' + transaction.amount + ' to: ' + transaction.upiId);
    loadAllData();
}

// Reject withdrawal
function rejectWithdrawal(transactionId) {
    if (!confirm('Reject and refund this withdrawal?')) return;
    
    const transactions = getTransactions();
    const users = getAllUsers();
    
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users.find(u => u.id === transaction.userId);
    if (!user) return;
    
    transaction.status = 'rejected';
    user.balance = (user.balance || 0) + transaction.amount; // Refund to gaming balance
    
    // Add to activity log
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
        type: 'withdrawal_rejected',
        amount: transaction.amount,
        timestamp: new Date().toISOString()
    });
    
    saveTransactions(transactions);
    saveUsers(users);
    
    // Update session if user is logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const sessionUser = JSON.parse(currentUser);
        if (sessionUser.id === user.id) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
    }
    
    alert('❌ Withdrawal Rejected!\n\nAmount ₹' + transaction.amount + ' has been refunded to user\'s gaming balance.');
    loadAllData();
}

// Reset all wagers
function resetAllWagers() {
    if (!confirm('Reset wager progress for ALL users? This cannot be undone!')) return;
    
    const users = getAllUsers();
    users.forEach(user => {
        user.depositWagered = 0;
        user.bonusWagered = 0;
    });
    
    saveUsers(users);
    alert('✅ All user wagers have been reset!');
    loadAllData();
}

// Initialize
document.addEventListener('DOMContentLoaded', loadAllData);

// Auto refresh every 30 seconds
setInterval(loadAllData, 30000);
