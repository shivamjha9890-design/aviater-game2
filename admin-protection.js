// Admin Panel Password Protection
// Add this script to the beginning of all admin pages

(function() {
    'use strict';
    
    // ⚠️ CHANGE THIS PASSWORD! Make it strong and unique
    const ADMIN_PASSWORD = "Admin@Aviator2024!";
    
    // Check if already authenticated in this session
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    const savedTimestamp = sessionStorage.getItem('admin_auth_time');
    
    // Session timeout: 30 minutes
    const SESSION_TIMEOUT = 30 * 60 * 1000;
    
    // Check if session is still valid
    if (savedAuth === ADMIN_PASSWORD && savedTimestamp) {
        const timeDiff = Date.now() - parseInt(savedTimestamp);
        if (timeDiff < SESSION_TIMEOUT) {
            // Still authenticated
            console.log('✅ Admin authenticated');
            return;
        }
    }
    
    // Not authenticated or session expired - ask for password
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    
    while (attempts < MAX_ATTEMPTS) {
        const password = prompt('🔒 Enter Admin Password:');
        
        if (password === null) {
            // User clicked cancel
            alert('❌ Access Denied!');
            window.location.href = 'index.html';
            return;
        }
        
        if (password === ADMIN_PASSWORD) {
            // Correct password
            sessionStorage.setItem('admin_authenticated', password);
            sessionStorage.setItem('admin_auth_time', Date.now().toString());
            console.log('✅ Admin access granted');
            return;
        }
        
        attempts++;
        
        if (attempts < MAX_ATTEMPTS) {
            alert(`❌ Incorrect password. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`);
        }
    }
    
    // Max attempts reached
    alert('🚫 Access Denied! Too many failed attempts.');
    window.location.href = 'index.html';
})();
