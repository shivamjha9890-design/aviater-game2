# Aviator Crash Game - Complete Authentication System

## 🎮 Features

### 1. **Authentication System**
- ✅ User Signup with Email or Phone Number
- ✅ User Login
- ✅ Unique Email/Phone validation (no duplicates)
- ✅ Secure password system
- ✅ Session management
- ✅ Logout functionality

### 2. **User Database**
- ✅ LocalStorage-based database
- ✅ Stores user information:
  - Name
  - Email or Phone Number
  - Password
  - Registration date
  - Last login timestamp
- ✅ Persistent data storage

### 3. **Admin Dashboard**
- ✅ View all registered users
- ✅ Statistics:
  - Total users
  - Email signups
  - Phone signups
- ✅ Export user data to CSV
- ✅ Real-time updates
- ✅ Auto-refresh every 30 seconds

### 4. **Game Features**
- ✅ Airplane crash gambling game
- ✅ Auto Cashout feature
- ✅ Sound effects and animations
- ✅ User balance tracking
- ✅ Game history

## 📁 File Structure

```
aviater/
├── auth.html          # Login/Signup page (ENTRY POINT)
├── auth.css           # Authentication styles
├── auth.js            # Authentication logic
├── index.html         # Main game page
├── style.css          # Game styles
├── script.js          # Game logic
├── dashboard.html     # Admin dashboard
└── README.md          # This file
```

## 🚀 How to Use

### For Users:

1. **First Time Setup:**
   - Open `http://localhost:8000/auth.html`
   - Click "Sign Up"
   - Choose signup method (Email or Phone)
   - Enter your details
   - Create a password (min 6 characters)
   - Click "Sign Up"

2. **Login:**
   - Open `http://localhost:8000/auth.html`
   - Enter your email or phone number
   - Enter your password
   - Click "Login"

3. **Play Game:**
   - After login, you'll be redirected to the game
   - Your name appears in the top header
   - Place bets and enjoy!

4. **Logout:**
   - Click the "Logout" button in the header

### For Admins:

1. **View Dashboard:**
   - Open `http://localhost:8000/dashboard.html`
   - See all registered users
   - View statistics

2. **Export Data:**
   - Click "Export CSV" button
   - CSV file will download with all user data

## 🔒 Security Features

1. **No Duplicate Accounts:**
   - Email addresses are unique
   - Phone numbers are unique
   - System checks before allowing signup

2. **Password Protection:**
   - Minimum 6 characters required
   - Confirmation required during signup

3. **Session Management:**
   - User sessions are tracked
   - Auto-redirect if not logged in
   - Logout clears session

## 📊 Database Structure

Users are stored in LocalStorage with this format:

```javascript
{
  id: 1234567890,           // Unique timestamp ID
  name: "John Doe",         // Full name
  email: "john@email.com",  // Email (or null)
  phone: "9876543210",      // Phone (or null)
  password: "123456",       // Password
  createdAt: "2025-10-21T...", // Registration date
  lastLogin: "2025-10-21T..."  // Last login time
}
```

## 🎯 User Flow

```
1. User visits site
   ↓
2. Sees auth.html (Login/Signup)
   ↓
3. Signs up or logs in
   ↓
4. Redirected to index.html (Game)
   ↓
5. Plays game with authenticated session
   ↓
6. Can logout anytime
```

## 💾 Data Persistence

- All user data is stored in browser's LocalStorage
- Data persists across browser sessions
- Data is stored under key: `aviator_users`
- To clear all data: Open browser console and run `localStorage.clear()`

## 🔧 Testing

### Test Signup:
1. Email: `test@example.com` | Password: `123456`
2. Phone: `9876543210` | Password: `123456`

### View All Users:
- Check dashboard: `http://localhost:8000/dashboard.html`

## 📱 Responsive Design

- Works on desktop and mobile devices
- Touch-friendly controls
- Responsive layouts

## ⚠️ Important Notes

1. **Entry Point:** Users MUST start at `auth.html` (not `index.html`)
2. **Data Storage:** Uses browser LocalStorage (not a real database)
3. **Security:** This is a demo - not production-ready security
4. **Server:** Keep `python -m http.server 8000` running

## 🌐 URLs

- **Login/Signup:** http://localhost:8000/auth.html
- **Game:** http://localhost:8000/index.html
- **Dashboard:** http://localhost:8000/dashboard.html

## 🎮 Start Playing!

1. Make sure server is running: `python -m http.server 8000`
2. Open: http://localhost:8000/auth.html
3. Create account or login
4. Enjoy the game!

---

**Created for Aviator Crash Game** 🛩️
