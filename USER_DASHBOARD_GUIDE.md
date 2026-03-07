# User Dashboard - Complete Setup & Troubleshooting Guide

## ✅ What Should Be Working

After the updates, your user dashboard should support:
1. ✓ User Registration
2. ✓ User Login
3. ✓ View Dashboard
4. ✓ Edit Profile (username & bio)
5. ✓ Create Posts
6. ✓ Edit Own Posts
7. ✓ Delete Own Posts
8. ✓ View All Own Posts

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Verify Environment Variables

Make sure your `.env` file has these variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority

# Session & JWT
SESSION_SECRET=your-random-secret-key-here
JWT_SECRET=your-jwt-secret-key-here

# Optional: Gmail for contact form
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# App Config
NODE_ENV=development
PORT=5000
BLOG_NAME=My Blog
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Server

```bash
npm run dev
# or
npm start
```

---

## 🧪 Testing User Features

### Test 1: Register a New User

1. Go to `http://localhost:5000/register`
2. Fill in the form:
   - **Username**: testuser
   - **Email**: test@example.com
   - **Password**: password123
   - **Confirm Password**: password123
3. Click "Register"
4. You should be redirected to `/dashboard`

### Test 2: Verify Data in Database

Use MongoDB Compass or your MongoDB provider:

```
Database: your_db_name
Collection: users
```

Check if your user appears with:
- ✓ username
- ✓ email
- ✓ password (hashed)
- ✓ bio
- ✓ createdAt

### Test 3: Edit Profile

1. On dashboard, click "Edit Profile"
2. Change your username and add a bio
3. Click "Save Changes"
4. You should see a success message
5. Check MongoDB - username and bio should be updated
6. Go back to dashboard - changes should appear immediately

### Test 4: Create a Post

1. On dashboard, click "Create New Post"
2. Add title: "My First Post"
3. Add content: "This is my first blog post"
4. Click "Publish Post"
5. Check MongoDB Posts collection - post should exist with:
   - ✓ title
   - ✓ content
   - ✓ author (your username)
   - ✓ userId (your user ID)
   - ✓ createdAt

### Test 5: Edit Your Post

1. Click "My Posts" on dashboard
2. Find your post and click "Edit"
3. Change content
4. Click "Save Changes"
5. Verify in MongoDB the post was updated

### Test 6: Delete Your Post

1. On "My Posts" page
2. Click "Delete" on a post
3. Confirm deletion
4. Post should be removed from database

---

## ❌ Common Issues & Fixes

### Issue 1: "Database connection failed"

**Problem**: Cannot connect to MongoDB

**Solution**:
- Check `MONGODB_URI` in `.env` is correct
- Verify database IP whitelist on MongoDB Atlas
- Make sure you used the correct username/password
- Test with MongoDB Compass first

### Issue 2: Profile changes not saving

**Problem**: Click save but changes don't appear

**Check**:
1. Check browser console for errors (F12)
2. Check server console for error messages
3. Verify `method-override` is working:
   ```javascript
   // In index.js, check you have:
   app.use(methodOverride('_method'));
   ```
4. Verify form has `?_method=PUT` in action
5. Check MongoDB - data might be there but page not refreshing

**Fix**:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart server
- Try incognito/private window

### Issue 3: Cannot login after registering

**Problem**: Registration works, but login fails

**Check**:
1. Go to `/login` with registered email
2. Check server logs for password comparison errors
3. Verify user exists in MongoDB users collection

**Common cause**: Typo in email or password during login

### Issue 4: Profile displays old data

**Problem**: Edit profile but dashboard shows old info

**Solution**:
```bash
# Clear browser cache
# Restart browser
# Hard refresh: Ctrl+Shift+R (Windows)
```

### Issue 5: "You do not have permission to modify this post"

**Problem**: Cannot edit your own posts

**Causes**:
- Post doesn't have `userId` field (posts created before update)
- User ID in JWT doesn't match post's userId

**Fix for old posts**:
```javascript
// Add userId to existing posts in MongoDB:
db.posts.updateMany(
    { userId: null },
    { $set: { userId: ObjectId("your-user-id") } }
)
```

### Issue 6: Routes returning 404

**Problem**: Routes like `/user/posts` return 404

**Check**:
1. Verify routes are registered in `index.js`:
   ```javascript
   app.use('/', require('./server/route/userRoutes'));
   ```
2. Restart server after any changes

---

## 📁 File Structure Check

Verify all files exist:

```
nodejs-blog/
├── server/
│   ├── route/
│   │   ├── userRoutes.js        ✓ Created
│   │   ├── main.js              ✓ Updated
│   │   ├── admin.js             ✓ Updated
│   │   └── postRoutes.js
│   ├── models/
│   │   ├── user.js              ✓ Updated
│   │   └── post.js              ✓ Updated
│   └── routerHelpers.js
├── views/
│   ├── dashboard.ejs            ✓ Updated
│   ├── profile.ejs              ✓ Updated
│   ├── register.ejs             ✓ Created
│   ├── login.ejs                ✓ Created
│   ├── user/
│   │   ├── my-posts.ejs         ✓ Created
│   │   ├── add-post.ejs         ✓ Created
│   │   └── edit-post.ejs        ✓ Created
│   └── layouts/
│       └── main.ejs
├── .env                         ✓ Add your variables
├── .env.example                 ✓ Reference
├── index.js                     ✓ Updated
└── package.json
```

---

## 🔍 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  bio: String (default: ""),
  avatar: String or null,
  createdAt: Date,
  updatedAt: Date (auto-added if you update)
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: String,
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Checklist

- ✓ Passwords hashed with bcrypt
- ✓ JWT tokens expire in 24 hours
- ✓ Cookies are httpOnly (safe from XSS)
- ✓ Users can only edit their own posts
- ✓ Admin can delete any post
- ✓ Protected routes require authentication

---

## 📝 API Endpoints Summary

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /register | GET | Show register form |
| /register | POST | Create new account |
| /login | GET | Show login form |
| /login | POST | Login user |
| /logout | GET | Logout user |

### User Dashboard
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /dashboard | GET | User dashboard |
| /profile | GET | Edit profile form |
| /profile | PUT | Update profile |

### User Posts
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /user/posts | GET | View user's posts |
| /user/add-post | GET | Add post form |
| /user/add-post | POST | Create post |
| /user/edit-post/:id | GET | Edit post form |
| /user/edit-post/:id | PUT | Update post |
| /user/delete-post/:id | DELETE | Delete post |

---

## 💡 Tips for Debugging

1. **Check Server Console**: Look for errors/logs when you perform actions
2. **Check Browser Console**: Go to DevTools (F12) and check for JavaScript errors
3. **Check Network Tab**: See if requests succeed (status 200) or fail (400/500)
4. **MongoDB Data**: Use MongoDB Compass to verify data is saved
5. **Clear Cache**: Sometimes old cached data causes issues

---

## 🆘 Need More Help?

If something still isn't working:

1. Check the server console output when you perform an action
2. Verify the action appears in the Network tab (DevTools)
3. Check if data appears in MongoDB
4. Restart the server
5. Clear browser cache
6. Try incognito/private window

Post the error message and I can help debug specific issues!
