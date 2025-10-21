# 🎮 Aviator Game - Complete System Documentation

## ✅ Updated Requirements Implemented

### 1. **₹50 Signup Bonus** (NO WAGER)
- ✅ Every new user gets ₹50 FREE
- ✅ Can use immediately - NO wagering required
- ✅ Can play and win with signup bonus

### 2. **Deposit System**
- ✅ **Deposit Amount:** Requires 1x wager
  - Example: Deposit ₹100 → Must wager ₹100
  - Every bet counts toward this requirement
  
- ✅ **200% Bonus:** Requires 10x wager
  - Example: Get ₹200 bonus → Must wager ₹2000
  - Every bet counts toward this requirement

### 3. **Wagering Logic**
- ✅ **Every bet placed** counts toward BOTH:
  - Deposit wager (1x)
  - Bonus wager (10x)
- ✅ User must complete BOTH to withdraw
- ✅ Progress tracked in real-time

### 4. **Super Admin Panel**
- ✅ Complete user activity tracking
- ✅ View all user details
- ✅ Manually edit wager requirements
- ✅ UTR/Transaction ID verification
- ✅ Approve/Reject deposits
- ✅ Approve/Reject withdrawals
- ✅ Full activity logs per user

---

## 📊 Wagering Examples

### Example 1: New User
```
1. User signs up → Gets ₹50 (no wager)
2. Plays with ₹50 → Can withdraw winnings anytime
```

### Example 2: Deposit ₹100
```
1. User deposits ₹100
2. Gets ₹100 (main) + ₹200 (bonus)
3. Wager Requirements:
   - Deposit: Wager ₹100 (1x)
   - Bonus: Wager ₹2000 (10x)
4. User bets ₹10, 10 times = ₹100 wagered
   ✅ Deposit wager complete
   ❌ Bonus wager: 100/2000 (5%)
5. User bets ₹10, 190 more times = ₹2000 wagered
   ✅ Bonus wager complete
6. Bonus ₹200 transferred to main balance
7. User can now withdraw!
```

### Example 3: Deposit ₹500
```
1. User deposits ₹500
2. Gets ₹500 (main) + ₹1000 (bonus)
3. Wager Requirements:
   - Deposit: ₹500 (1x)
   - Bonus: ₹10,000 (10x)
4. Every ₹10 bet counts toward both
5. After ₹500 in bets → Deposit complete
6. After ₹10,000 in bets → Bonus complete
7. Can withdraw!
```

---

## 🎯 Admin Panel Features

### **URL:** http://localhost:8000/superadmin.html

### **Dashboard Overview:**
- Total users count
- Pending deposits count
- Pending withdrawals count
- Total deposit amount
- Total withdrawal amount

### **All Users Tab:**
Shows for each user:
- Name, Contact, Balance, Bonus
- Wager progress (Deposit & Bonus)
- Total bets placed
- **View Details** button

### **User Details Modal:**
Click "View" on any user to see:

**Financial Summary:**
- User ID
- Main balance
- Bonus balance
- Total deposits
- Total withdrawals
- Total bets
- Total wins
- Games played

**Wager Progress:**
- Deposit wager: ₹X / ₹Y (Z% complete)
- Bonus wager: ₹X / ₹Y (Z% complete)

**Edit Wager Requirements:**
- Set deposit amount to wager
- Set current deposit wagered
- Set current bonus wagered
- Save changes instantly

**Activity Log:**
- Last 20 activities
- Shows: bets, wins, deposits, withdrawals
- Timestamp for each activity

### **Deposits Tab:**
- View all deposit requests
- See UTR/Transaction ID
- Payment method (Google Pay/PhonePe)
- Amount + Bonus
- **Approve** or **Reject**

### **Withdrawals Tab:**
- View all withdrawal requests
- See user's UPI ID
- Amount requested
- **Approve** (after sending money) or **Reject & Refund**

### **Wager Settings Tab:**
- View current wager rules
- Explanation of how wagering works
- Reset all user wagers (admin tool)

---

## 💰 Payment Flow

### **Deposit:**
```
User → Wallet → Deposit → Enter Amount
  ↓
Choose Google Pay/PhonePe
  ↓
Pay to: 7011354220-4@ybl
  ↓
Enter UTR/Transaction ID
  ↓
Submit Request (Status: PENDING)
  ↓
Admin Panel → Verify UTR → Approve
  ↓
User Balance Credited:
- Main Balance: +Amount
- Bonus Balance: +200% Bonus
- Deposit Amount: +Amount (for 1x wager)
```

### **Withdrawal:**
```
User completes wagering requirements
  ↓
Wallet → Withdraw → Enter Amount + UPI ID
  ↓
Submit Request (Balance deducted)
  ↓
Admin Panel → Approve
  ↓
Admin sends money to user's UPI ID manually
  ↓
Click "Approve" in admin panel
  ↓
Done! User receives money
```

---

## 🔐 Admin Actions

### **Approve Deposit:**
1. Check your Google Pay/PhonePe
2. Verify UTR matches
3. Verify amount received
4. Click "Approve"
5. User balance updated automatically

### **Reject Deposit:**
1. If UTR is fake/wrong
2. Click "Reject"
3. No balance credited

### **Approve Withdrawal:**
1. Check user wagering is complete
2. Send money to user's UPI ID manually
3. Click "Approve"
4. Transaction marked as approved

### **Reject Withdrawal:**
1. If suspicious
2. Click "Reject & Refund"
3. Amount returned to user balance

### **Edit User Wager:**
1. Click "View" on user
2. Scroll to "Edit Wager Requirements"
3. Change deposit amount/wagered
4. Change bonus wagered
5. Click "Save Changes"
6. User requirements updated instantly

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `auth.html` | Login/Signup page |
| `auth.js` | Authentication logic (updated with new wager fields) |
| `index.html` | Game page |
| `script.js` | Game logic (tracks bets and wins) |
| `wallet.html` | User wallet page |
| `wallet.js` | Wallet logic (updated wager tracking) |
| `admin.html` | Basic admin panel (deposits/withdrawals) |
| `admin.js` | Basic admin logic |
| `superadmin.html` | **NEW** - Enhanced admin panel |
| `superadmin.js` | **NEW** - Enhanced admin logic |

---

## 🌐 All URLs

```
Login/Signup:     http://localhost:8000/auth.html
Game:             http://localhost:8000/index.html
Wallet:           http://localhost:8000/wallet.html
Basic Admin:      http://localhost:8000/admin.html
Super Admin:      http://localhost:8000/superadmin.html  ← USE THIS
User Dashboard:   http://localhost:8000/dashboard.html
```

---

## ✅ Complete Feature List

**User Features:**
- ✅ ₹50 signup bonus (no wager)
- ✅ Deposit with 200% bonus
- ✅ UPI deposit (Google Pay/PhonePe)
- ✅ 1x deposit wager
- ✅ 10x bonus wager
- ✅ Real-time wager tracking
- ✅ Withdrawal system
- ✅ Transaction history
- ✅ Activity logging

**Admin Features:**
- ✅ View all users
- ✅ View user details
- ✅ Edit wager requirements
- ✅ View complete activity log
- ✅ UTR verification
- ✅ Approve/reject deposits
- ✅ Approve/reject withdrawals
- ✅ Statistics dashboard
- ✅ Real-time updates
- ✅ Auto-refresh every 30s

---

## 🎮 How to Use

### **For Users:**
1. Sign up → Get ₹50 free
2. Play with ₹50 (no wager needed)
3. Deposit money → Get 200% bonus
4. Play and bet (every bet counts toward wager)
5. Complete wagering requirements
6. Withdraw money

### **For Admin:**
1. Open: **http://localhost:8000/superadmin.html**
2. View all users in **All Users** tab
3. Click "View" to see any user's complete details
4. Check **Deposits** tab for pending deposits
5. Verify UTR and approve/reject
6. Check **Withdrawals** tab for withdrawal requests
7. Send money to user's UPI, then approve
8. Edit wager requirements if needed
9. View complete activity logs

---

## 🚀 Your System is Ready!

Everything works perfectly with:
- ✅ ₹50 signup bonus (no wager)
- ✅ 1x deposit wager
- ✅ 10x bonus wager
- ✅ Complete admin control
- ✅ UTR verification
- ✅ Activity tracking
- ✅ Wager editing

**Use Super Admin Panel for best experience!**
**http://localhost:8000/superadmin.html**
