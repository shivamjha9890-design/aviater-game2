# Updated Aviator Gaming System - Complete Guide

## 🎮 What Changed?

### **Gaming Balance Display**
- Users now see **one combined "Gaming Balance"** instead of separate main/bonus balances
- Gaming Balance = Main Balance + Bonus Balance
- In wallet, there's a small breakdown showing the split

### **Deposit System with Optional Bonus**

#### **Option 1: Deposit WITHOUT Bonus**
- User deposits ₹100
- Gaming Balance shows: ₹100
- **Wager Requirement: 1x** (must bet ₹100 total)
- Can withdraw after betting ₹100

#### **Option 2: Deposit WITH 200% Bonus**
- User deposits ₹100 and accepts bonus
- Gaming Balance shows: ₹300 (₹100 + ₹200 bonus)
- **Wager Requirement: 10x of bonus** (must bet ₹2000 total)
- Can withdraw after betting ₹2000

### **Withdrawal System**
- **Withdrawal button is DISABLED** until wager requirement is complete
- User must complete wagering first:
  - If they took bonus: Complete 10x wagering
  - If they declined bonus: Complete 1x wagering
- Minimum withdrawal: ₹100
- If admin **rejects** withdrawal → Money **refunds to gaming balance**

### **Signup Bonus**
- New users get ₹50 free
- **No wagering requirement** on signup bonus
- Can be withdrawn immediately (after any deposit if needed)

---

## 📊 How It Works for Users

### **Example 1: User Deposits ₹100 WITHOUT Bonus**
1. User goes to Wallet → Deposit
2. Enters ₹100
3. **Unchecks** "I want 200% bonus"
4. Sees preview: "You'll receive ₹100 (No bonus)"
5. Pays via UPI and submits request
6. **Admin approves** → Gaming Balance becomes ₹100
7. Wager Progress shows: "0 / ₹100 (1x)"
8. User plays and bets ₹100 total
9. Wager complete! Can now withdraw

### **Example 2: User Deposits ₹100 WITH Bonus**
1. User goes to Wallet → Deposit
2. Enters ₹100
3. **Checks** "I want 200% bonus" (default checked)
4. Sees preview: "You'll receive ₹300 (₹100 + ₹200 bonus)"
5. Pays via UPI and submits request
6. **Admin approves** → Gaming Balance becomes ₹300
7. Wager Progress shows: "0 / ₹2000 (10x)"
8. User plays and bets ₹2000 total
9. Wager complete! Can now withdraw

### **Example 3: Withdrawal Rejection**
1. User requests withdrawal of ₹500
2. Admin clicks **Reject**
3. ₹500 **refunds to user's gaming balance** immediately
4. User can use it to play again or request withdrawal later

---

## 🔧 Admin Panel Changes

### **Deposit Approval**
When viewing deposit requests, you'll see:
- **Bonus column** shows: "₹200 ✅" (accepted) or "Declined" (rejected)
- When you click **Approve**:
  - **WITH Bonus**: Credits ₹100 to main + ₹200 to bonus = ₹300 gaming balance, 10x wager
  - **WITHOUT Bonus**: Credits ₹100 to main = ₹100 gaming balance, 1x wager
- Confirmation message shows exact breakdown

### **Withdrawal Rejection**
- Click **Reject** on withdrawal request
- Money automatically refunds to user's gaming balance
- User gets notified (can see in transaction history)
- User can play or request withdrawal again

### **User Details View**
- Shows gaming balance breakdown
- Shows current wager requirement (1x or 10x)
- Shows wager progress with percentage
- Can manually edit wager amounts if needed

### **Wager Settings Tab**
Updated to show new rules:
- Signup bonus: No wager
- Deposit without bonus: 1x wager
- Deposit with 200% bonus: 10x wager

---

## 💡 Key Benefits

### **For Users:**
1. **Flexibility**: Choose between quick 1x wager or big bonus with 10x wager
2. **Transparency**: Clear gaming balance display
3. **Safety**: Rejected withdrawals refund automatically
4. **Control**: Can opt out of bonus if they want faster withdrawals

### **For Admin:**
1. **Clear tracking**: See whether user accepted bonus or not
2. **Automatic calculation**: System handles wager requirements automatically
3. **Better control**: Manual wager editing still available
4. **Honest system**: Users know exactly what they're getting

---

## 🎯 Wagering Logic

### **How Bets Count Toward Wagering:**
- Every bet placed counts toward the active wager requirement
- System tracks progress automatically
- When complete, user sees success message

### **Wager Completion:**
- **Without Bonus**: User bets must total 1x deposit amount
- **With Bonus**: User bets must total 10x bonus amount
- Example: ₹200 bonus requires ₹2000 in total bets (win or lose)

### **Withdrawal Eligibility:**
User can withdraw when:
1. Wager requirement is 100% complete, AND
2. They have at least ₹100 balance

---

## 📱 URLs

- **User Landing**: `http://localhost:8000/home.html`
- **Game**: `http://localhost:8000/index.html`
- **Wallet**: `http://localhost:8000/wallet.html`
- **Admin Panel**: `http://localhost:8000/superadmin.html`

---

## 🚀 Testing Guide

### **Test Scenario 1: Deposit Without Bonus**
1. Create new user account
2. Go to wallet
3. Deposit ₹100, uncheck bonus
4. Admin approves
5. Check gaming balance = ₹100
6. Play until ₹100 wagered
7. Withdrawal unlocks

### **Test Scenario 2: Deposit With Bonus**
1. Create new user account
2. Go to wallet
3. Deposit ₹100, keep bonus checked
4. Admin approves
5. Check gaming balance = ₹300
6. Play until ₹2000 wagered
7. Withdrawal unlocks

### **Test Scenario 3: Withdrawal Rejection**
1. User requests withdrawal
2. Admin rejects it
3. Check user's gaming balance increased by refund amount
4. User can play or request again

---

## ⚠️ Important Notes

1. **Old deposits**: Any old pending deposits will be treated as "bonus accepted" for backward compatibility
2. **Session sync**: When admin approves/rejects, logged-in users see updates immediately
3. **Data persistence**: All data stored in localStorage (consider backend for production)
4. **UPI payments**: Still manual verification via transaction ID/UTR

---

## 🎉 Summary

The new system gives users **choice and clarity**:
- Want to withdraw quickly? → Decline bonus, wager 1x
- Want maximum bonus? → Accept 200% bonus, wager 10x
- See everything in one "Gaming Balance"
- Rejected withdrawals refund automatically
- Admin has full control and visibility

Everything is automated, tracked, and transparent! 🚀
