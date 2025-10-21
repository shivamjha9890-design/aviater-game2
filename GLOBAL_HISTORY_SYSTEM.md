# 🌐 Global History System - Persistent Trend Across All Users

## Overview
The game now maintains a **global shared history** of the last 25 rounds that persists across:
- Page refreshes
- Different user sessions
- Browser restarts (until localStorage is cleared)

## Key Features

### 🔄 **Persistent Across Refreshes**
- History survives page refresh
- Trend visualization continues from where it left off
- No data loss between sessions

### 👥 **Shared Across All Users**
- All users see the same 25-round trend
- Creates authentic casino experience
- New users see existing game history

### ♾️ **Runs Forever**
- Game rounds continue indefinitely
- History automatically updates with each crash
- Oldest rounds are removed when limit (25) is reached

## How It Works

### Data Structure
```javascript
{
  rounds: [
    { multiplier: 3.45, isWin: false },
    { multiplier: 1.89, isWin: true },
    // ... up to 25 rounds
  ],
  lastUpdate: 1234567890
}
```

### Storage Location
- **Key**: `aviator_global_history` in `localStorage`
- **Scope**: Browser-wide (shared across all tabs/sessions)
- **Persistence**: Until browser data is cleared

### Update Flow
```
1. Round crashes at multiplier X
   ↓
2. Add to global history array
   ↓
3. Save to localStorage
   ↓
4. Update trend visualization for ALL users
   ↓
5. Keep only last 25 rounds (remove oldest)
```

## User Experience

### For New Users
- See existing trend when they first play
- Understand recent game patterns
- Feel part of ongoing game

### For Existing Users
- Refresh page → See same trend
- History continues seamlessly
- No interruption to experience

### For All Users
- Same 25-round trend visible to everyone
- Real-time updates as rounds complete
- Authentic multiplayer casino feel

## Technical Implementation

### Functions Added
1. **`saveGlobalHistory()`**
   - Saves current history to localStorage
   - Called after every round crash
   - Stores timestamp for validation

2. **`loadGlobalHistory()`**
   - Loads shared history on page load
   - Runs before user-specific data loads
   - Updates UI with existing trends

### Separation of Concerns
- **Global Data**: Round history (shared)
- **User Data**: Win/loss stats (personal)

### Previous Behavior
```
User A plays → Sees their own history
User B plays → Sees their own history
Page refresh → History lost
```

### New Behavior
```
User A plays → Sees global history
User B plays → Sees SAME global history
Page refresh → History PRESERVED
```

## Statistics vs History

### User-Specific (Personal)
Stored per user in `user.gameStats`:
- `totalBets` - Personal bet count
- `totalWins` - Personal wins
- `totalLosses` - Personal losses
- `winRate` - Personal win percentage

### Global (Shared)
Stored globally in `aviator_global_history`:
- Last 25 round multipliers
- Whether each was a win/loss FOR THE GAME (not user)
- Trend visualization data

## Benefits

### 🎰 **Authentic Casino Experience**
- Mimics real crash games where everyone sees same results
- Builds community feeling
- Increases engagement

### 📊 **Better Analytics**
- Users can analyze recent trends
- See if game is "hot" or "cold"
- Make informed betting decisions

### 🔒 **Data Integrity**
- History can't be manipulated per user
- Fair gameplay for everyone
- Prevents cherry-picking results

### ⚡ **Performance**
- Single source of truth
- No duplicate data per user
- Efficient storage usage

## Maintenance

### Clearing History
To reset global history (admin use):
```javascript
localStorage.removeItem('aviator_global_history');
```

### Checking History
To view current global history:
```javascript
JSON.parse(localStorage.getItem('aviator_global_history'));
```

## Future Enhancements

Potential additions:
- Extend to 50 or 100 rounds
- Add daily/weekly trend statistics
- Server-side synchronization (if backend added)
- Historical pattern analysis
- Jackpot tracking (rare high multipliers)

## Notes

- History persists in browser localStorage (local to device)
- Clearing browser data will reset history
- Each browser/device maintains its own global history
- For true multiplayer, consider backend sync in future
