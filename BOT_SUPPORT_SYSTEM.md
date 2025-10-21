# 🤖 Intelligent Bot Support System

## Overview
Enhanced live support with AI-like bot that categorizes issues and provides automated responses before connecting to admin.

## Features

### 1. Issue Categorization
Users select from 5 categories:
- **Deposit** - Money not credited issues
- **Withdrawal** - Cash out problems
- **Bonus** - Bonus related queries
- **Referral** - Referral program help
- **Other** - Any other issue

### 2. Bot Responses

#### Deposit Issues
- **Bot Action**: Asks for transaction details
- **Required Info**: UTR/Transaction ID, Amount, Screenshot
- **Admin Alert**: Yes - Forwarded immediately
- **User Can**: Upload payment screenshot

#### Withdrawal Issues
- **Bot Action**: Provides status information
- **Auto Response**: "Processing time: 5-30 min, Max: 24 hours"
- **Admin Alert**: No (unless > 24 hours)
- **User Experience**: Reassurance message

#### Bonus/Referral/Other
- **Bot Action**: Contextual welcome message
- **Admin Alert**: Yes - Requires human assistance
- **User Can**: Describe issue in detail

### 3. Image Upload
- **Feature**: Attachment button (📎)
- **Use Case**: Upload payment screenshots
- **File Size**: Max 5MB
- **Format**: All image types
- **Display**: Clickable thumbnail, opens full size

### 4. Admin View Enhancements
- **Issue Tag**: Shows category badge on each chat
- **Bot Messages**: Highlighted in yellow
- **Image Preview**: Inline thumbnails
- **Click to Enlarge**: Opens images in new tab

## User Flow

```
1. User enters email
   ↓
2. Clicks "Start Chat"
   ↓
3. Selects issue category
   ↓
4. Bot provides relevant response
   ↓
5. User describes issue / uploads screenshot
   ↓
6. Admin receives notification (if needed)
   ↓
7. Admin responds
   ↓
8. User can click "Menu" to go back and select different category
```

## Navigation Features

### Back to Menu Button
- **Location**: Top-right of chat header
- **Icon**: 📋 Menu
- **Function**: Returns to category selection
- **Confirmation**: Asks user before navigating
- **Chat Preservation**: Current chat is saved
- **Use Case**: User picked wrong category or wants different help

## Bot Logic

### Withdrawal Auto-Response
```javascript
if (issueType === 'withdrawal') {
  // Bot handles automatically
  message = "Processing time: 5-30 min, Max: 24 hours"
  requiresAdmin = false  // No alert to admin
}
```

### Deposit Issue
```javascript
if (issueType === 'deposit') {
  // Bot asks for details
  message = "Please provide: UTR, Amount, Screenshot"
  requiresAdmin = true  // Alert admin immediately
}
```

## Benefits

### For Users
✅ Instant response for common issues
✅ Clear guidance on what information to provide
✅ Can upload screenshots easily
✅ Knows expected wait time (withdrawal)

### For Admin
✅ Pre-categorized issues
✅ Users provide required info upfront
✅ Less time spent asking for details
✅ Can see screenshots immediately
✅ Withdrawal queries auto-handled

## Data Structure

```javascript
{
  id: "chat_123",
  email: "user@example.com",
  issueType: "deposit",  // NEW
  status: "active",
  messages: [
    {
      sender: "bot",  // NEW
      text: "Bot message...",
      timestamp: "..."
    },
    {
      sender: "user",
      text: "My issue...",
      image: "data:image/png;base64...",  // NEW
      timestamp: "..."
    }
  ]
}
```

## Usage

### For Users
1. Go to support page
2. Enter email
3. Select issue type from 5 options
4. Read bot response
5. Type message or click 📎 to upload image
6. Wait for admin response

### For Admin
1. Open admin-support.html
2. See issue type tag on each chat
3. View bot messages (yellow background)
4. See uploaded images inline
5. Click images to view full size
6. Respond as needed

## Technical Details

### Image Handling
- Stored as base64 data URLs
- Embedded in message object
- No server upload required
- Works with localStorage

### Bot Message Types
- Welcome messages per category
- Automated status updates
- Required information prompts
- Time estimates

### Admin Filtering
- Bot messages clearly marked
- Issue tags visible in chat list
- Can prioritize by issue type

## Impact

**Before:**
- All issues treated equally
- Users didn't know what info to provide
- Admin spent time asking for details
- No image support

**After:**
- Issues pre-categorized
- Bot guides users on what to provide
- Users upload screenshots upfront
- Withdrawal queries auto-answered
- Faster resolution time

## Future Enhancements
- Multiple image uploads
- Quick reply templates for admin
- Auto-close resolved chats
- Chat satisfaction rating
- Analytics by issue type
