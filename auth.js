// LocalStorage Database Management
const DB_KEY = 'aviator_users';

// Initialize database
function initDatabase() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
}

// Get all users from database
function getAllUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

// Save users to database
function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Check if email exists
function emailExists(email) {
    const users = getAllUsers();
    return users.some(user => user.email && user.email.toLowerCase() === email.toLowerCase());
}

// Check if phone exists
function phoneExists(phone) {
    const users = getAllUsers();
    return users.some(user => user.phone === phone);
}

// Add new user
function addUser(userData) {
    const users = getAllUsers();
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email || null,
        phone: userData.phone || null,
        password: userData.password,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        // Financial data
        balance: 50, // Free ₹50 signup bonus (NO WAGER)
        bonusBalance: 0,
        depositAmount: 0, // Track deposit amount for 1x wager
        depositWagered: 0, // 1x wager for deposit amount
        bonusWagered: 0, // 10x wager for bonus amount
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalBets: 0,
        totalWins: 0,
        gamesPlayed: 0,
        hasSeenBonusPopup: false,
        upiId: null,
        activityLog: [] // Track all activities
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Authenticate user
function authenticateUser(identifier, password) {
    const users = getAllUsers();
    const user = users.find(u => 
        (u.email && u.email.toLowerCase() === identifier.toLowerCase()) || 
        (u.phone === identifier)
    );
    
    if (user && user.password === password) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers(users);
        return user;
    }
    return null;
}

// Toggle between login and signup forms
function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    hideMessage();
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    hideMessage();
}

// Toggle signup method (email/phone)
function toggleSignupMethod() {
    const method = document.querySelector('input[name="signupMethod"]:checked').value;
    const emailGroup = document.getElementById('emailGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const emailInput = document.getElementById('signupEmail');
    const phoneInput = document.getElementById('signupPhone');
    
    if (method === 'email') {
        emailGroup.classList.remove('hidden');
        phoneGroup.classList.add('hidden');
        emailInput.required = true;
        phoneInput.required = false;
        phoneInput.value = '';
    } else {
        phoneGroup.classList.remove('hidden');
        emailGroup.classList.add('hidden');
        phoneInput.required = true;
        emailInput.required = false;
        emailInput.value = '';
    }
}

// Show message
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.className = 'message-box';
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const method = document.querySelector('input[name="signupMethod"]:checked').value;
    const email = method === 'email' ? document.getElementById('signupEmail').value.trim() : null;
    const phone = method === 'phone' ? document.getElementById('signupPhone').value.trim() : null;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('❌ Passwords do not match!', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showMessage('❌ Password must be at least 6 characters!', 'error');
        return false;
    }
    
    // Check if user already exists
    if (email && emailExists(email)) {
        showMessage('❌ This email is already registered! Please login.', 'error');
        return false;
    }
    
    if (phone && phoneExists(phone)) {
        showMessage('❌ This phone number is already registered! Please login.', 'error');
        return false;
    }
    
    // Create new user
    const newUser = addUser({
        name: name,
        email: email,
        phone: phone,
        password: password
    });
    
    // Save to session
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showMessage('✅ Account created successfully! Redirecting to game...', 'success');
    
    // Redirect to game after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
    
    return false;
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Authenticate
    const user = authenticateUser(identifier, password);
    
    if (user) {
        // Save to session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        showMessage('✅ Login successful! Redirecting to game...', 'success');
        
        // Redirect to game after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage('❌ Invalid email/phone or password!', 'error');
    }
    
    return false;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    
    // Check if user is already logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});
