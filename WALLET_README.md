# 💰 Aviator Game - Complete Payment & Wallet System

## 🎉 New Features Added

### 1. **₹50 Signup Bonus**
- Every new user gets ₹50 FREE on signup
- Automatically credited to account
- Must complete 10x wagering (win ₹500) to unlock withdrawals

### 2. **200% Deposit Bonus**
- Deposit ₹100, Get ₹300 Total!
- Deposit ₹500, Get ₹1500 Total!
- Bonus balance shown separately
- Must complete 3x wagering to transfer to main balance

### 3. **UPI Deposit System**
- Pay via Google Pay or PhonePe
- UPI ID: **7011354220-4@ybl**
- Submit transaction ID for verification
- Admin approval required

### 4. **Withdrawal System**
- Minimum: ₹100
- Provide your UPI ID
- Admin approves and sends money
- Wagering must be complete

### 5. **Wagering Requirements**
- **Signup Bonus (₹50)**: Win ₹500 total (10x)
- **Deposit Bonus**: Win 3x bonus amount
- **Only winnings/profits count** toward wagering
- Progress bars show completion status

---

## 📁 New Files Created

| File | Purpose |
|------|---------|
| `wallet.html` | User wallet page |
| `wallet.css` | Wallet styling |
| `wallet.js` | Wallet functionality |
| `admin.html` | Admin transaction approval panel |
| `admin.js` | Admin panel logic |

---

## 🎮 User Flow

### **New User Signup:**
```
1. User signs up → Gets ₹50 free
2. 200% Bonus popup appears
3. User sees wallet with ₹50 balance
4. User plays game
5. Wins count toward wagering
6. Complete ₹500 wagering → Can withdraw
```

### **Deposit Flow:**
```
1. Click "Wallet" button
2. Click "Deposit"
3. Enter amount (min ₹100)
4. Choose payment method
5. Copy UPI ID: 7011354220-4@ybl
6. Send money via Google Pay/PhonePe
7. Enter transaction ID
8. Submit request
9. Admin approves
10. Balance credited (amount + 200% bonus)
```

### **Withdrawal Flow:**
```
1. Complete wagering requirements
2. Click "Withdraw"
3. Enter amount (min ₹100)
4. Enter your UPI ID
5. Submit request
6. Admin approves and sends money
7. Money received in your UPI
```

---

## 🛠️ Admin Panel

### **Access:**
- Open: `http://localhost:8000/admin.html`

### **Features:**
1. **View Pending Deposits**
   - See all deposit requests
   - View transaction IDs
   - Amount, bonus, payment method
   - Approve or reject

2. **View Pending Withdrawals**
   - See withdrawal requests
   - User UPI IDs
   - Amount to send
   - Approve (after sending) or reject

3. **Transaction History**
   - All approved/rejected transactions
   - Complete audit trail

4. **Statistics**
   - Pending deposits count
   - Pending withdrawals count
   - Total approved transactions

---

## 💳 Payment Details

### **Your UPI ID:**
```
7011354220-4@ybl
```

### **How Users Pay:**
1. Open Google Pay or PhonePe
2. Send money to: `7011354220-4@ybl`
3. Copy transaction ID/UTR
4. Submit on deposit page

### **How You Approve:**
1. Check if money received in your UPI
2. Verify transaction ID matches
3. Click "Approve" in admin panel
4. User balance updated automatically

---

## 📊 Wagering System

### **Signup Bonus Wagering:**
- **Requirement:** Win ₹500 total
- **How it works:** Only winnings count
- **Example:**
  - Bet ₹10, win ₹20 → Wagered: ₹10
  - Bet ₹20, win ₹50 → Wagered: ₹30
  - Continue until ₹500 wagered

### **Deposit Bonus Wagering:**
- **Requirement:** Win 3x bonus amount
- **Example:**
  - Deposit ₹100 → Get ₹200 bonus
  - Must win ₹600 (3 × ₹200)
  - Once complete → Bonus moves to main balance

### **Progress Tracking:**
- Real-time progress bars in wallet
- Notifications when complete
- Automatic balance transfer

---

## 🎯 Complete User Journey

### **Day 1: Signup**
```
✅ User signs up
✅ Gets ₹50 free
✅ Sees 200% bonus popup
✅ Plays with ₹50
✅ Wagering: 0/500
```

### **Day 2: First Deposit**
```
✅ Deposits ₹100
✅ Gets ₹200 bonus
✅ Total: ₹100 (main) + ₹200 (bonus)
✅ Plays and wins ₹150
✅ Signup wagering: 150/500
✅ Bonus wagering: 150/600
```

### **Day 3: Complete Wagering**
```
✅ Wins ₹350 more
✅ Signup wagering: 500/500 ✓
✅ Bonus wagering: 500/600
✅ Can now withdraw main balance
```

### **Day 4: Withdrawal**
```
✅ Requests withdrawal of ₹200
✅ Admin approves
✅ Money sent to UPI
✅ User receives money
```

---

## 🔐 Security & Fair Play

### **Wagering Rules:**
- ✅ Only **winnings/profits** count
- ✅ If you bet ₹10 and win ₹10 → ₹0 wagered (no profit)
- ✅ If you bet ₹10 and win ₹20 → ₹10 wagered (profit)
- ✅ Progressive tracking
- ✅ Cannot withdraw until complete

### **Admin Controls:**
- ✅ All transactions require approval
- ✅ You verify payment before crediting
- ✅ You can reject fraudulent requests
- ✅ Rejected withdrawals are refunded

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Login/Signup | http://localhost:8000/auth.html |
| Game | http://localhost:8000/index.html |
| Wallet | http://localhost:8000/wallet.html |
| Admin Panel | http://localhost:8000/admin.html |
| Dashboard | http://localhost:8000/dashboard.html |

---

## 📱 Features Breakdown

### **Wallet Page:**
- ✅ Main balance display
- ✅ Bonus balance display
- ✅ Wagering progress bars
- ✅ Deposit button with modal
- ✅ Withdraw button with modal
- ✅ Transaction history
- ✅ 200% bonus banner

### **Deposit Modal:**
- ✅ Amount input (min ₹100)
- ✅ Bonus calculation display
- ✅ Google Pay/PhonePe options
- ✅ UPI ID with copy button
- ✅ Transaction ID field
- ✅ Submit button

### **Withdraw Modal:**
- ✅ Withdrawable amount display
- ✅ Amount input (min ₹100)
- ✅ UPI ID field
- ✅ Validation checks
- ✅ Wagering completion check

---

## 🎊 Bonus Popup

Appears on first login after signup:
```
🎉 Welcome Bonus!
   ₹50 FREE

You've received ₹50 as a signup bonus!

200% Deposit Bonus
Deposit ₹100 and get ₹300 total!

[Start Playing!]
```

---

## 💡 Admin Tips

### **Approving Deposits:**
1. Check your Google Pay/PhonePe
2. Verify amount received
3. Match transaction ID
4. Click "Approve"
5. User gets credited instantly

### **Approving Withdrawals:**
1. Check wagering is complete
2. Send money to user's UPI ID
3. Click "Approve & Send Money"
4. Keep transaction receipt

### **Handling Frauds:**
1. Click "Reject" if suspicious
2. Deposit: No credit given
3. Withdrawal: Amount refunded to user

---

## 🚀 Quick Start

1. **Server Running?**
   ```bash
   python -m http.server 8000
   ```

2. **Create Test User:**
   - Go to `auth.html`
   - Sign up
   - Get ₹50 free

3. **Test Deposit:**
   - Click "Wallet"
   - Click "Deposit"
   - Enter ₹100
   - Submit with fake transaction ID
   - Go to `admin.html`
   - Approve deposit

4. **Test Withdrawal:**
   - Play until ₹500 wagered
   - Click "Withdraw"
   - Enter ₹100 and UPI ID
   - Submit request
   - Approve in admin panel

---

## ✅ Everything is Ready!

Your complete payment system is now live with:
- ✅ Signup bonus (₹50)
- ✅ 200% deposit bonus
- ✅ UPI deposits (Google Pay/PhonePe)
- ✅ UPI withdrawals
- ✅ Wagering system
- ✅ Admin approval panel
- ✅ Transaction tracking
- ✅ Balance management
- ✅ Secure and fair

**Start using it now!** 🎮💰
