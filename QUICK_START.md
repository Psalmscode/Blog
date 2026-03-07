# Quick Start Verification Checklist

## Before You Start

- [ ] Node.js is installed (`node --version` shows v14+)
- [ ] MongoDB is running (local or Atlas account)
- [ ] You have a `.env` file with all required variables
- [ ] All dependencies installed (`npm install` ran successfully)

---

## Startup Verification

### 1. Start the Server

```bash
npm run dev
```

**Expected output**: 
```
Server running on port 5000
```

If you see a database error, check your `MONGODB_URI` in `.env`.

### 2. Test Registration Flow

1. Open browser: `http://localhost:5000/register`
2. Fill form:
   ```
   Username: testuser123
   Email: test123@example.com
   Password: test123456
   Confirm: test123456
   ```
3. Click Register
4. **Expected result**: Redirected to `/dashboard`

**If error**: Check server console for validation errors

### 3. Verify Database Entry

**Using MongoDB Compass**:
1. Connect to your MongoDB
2. Find `users` collection
3. Should see your test user

**In MongoDB Atlas**:
1. Go to Collections
2. Check `users` collection
3. Should see your user document

### 4. Test Profile Update

1. On dashboard, click **"Edit Profile"**
2. Change username to `testuser123_updated`
3. Add bio: `This is my bio`
4. Click **"Save Changes"**
5. **Expected**: See success message and updated info

**Check MongoDB**:
- Go to `users` collection
- Find your user
- Verify `username` and `bio` fields updated

### 5. Test Post Creation

1. Click **"Create New Post"**
2. Title: `My First Post`
3. Content: `This is my first post content`
4. Click **"Publish Post"**
5. **Expected**: Redirected to `/user/posts`

**Check MongoDB**:
- Go to `posts` collection
- Should see new post with:
  - title: "My First Post"
  - author: "testuser123_updated" (your username)
  - userId: (your user ID)

### 6. Test Post Edit

1. Click **"My Posts"**
2. Find your post, click **"Edit"**
3. Change content to: `Updated content`
4. Click **"Save Changes"**
5. **Expected**: Changes persist

**Check MongoDB**:
- Same post should have updated content
- updatedAt should be recent

### 7. Test Post Delete

1. On **"My Posts"** page
2. Click **"Delete"** on any post
3. Confirm deletion
4. **Expected**: Post removed from list

**Check MongoDB**:
- Post should no longer exist in collection

### 8. Test Login/Logout

1. Click **"Logout"** button
2. You're at home page
3. Click **"Login"** 
4. Use your email and password
5. **Expected**: Logged back in to dashboard

---

## Troubleshooting Quick Fixes

### Server Won't Start
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Error
```
Check your MONGODB_URI in .env
Make sure it's correct format:
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Can't Edit/Save Profile
```
1. Check browser console (F12)
2. Check server console for errors
3. Verify method-override is in index.js
4. Clear browser cache
5. Restart server
```

### Posts Not Appearing in Database
```
1. Check MongoDB connection is working
2. Verify you're looking in correct database
3. Check server logs for save errors
4. Try creating post again
```

### Can't Login After Register
```
1. Double-check email spelling
2. Verify user exists in MongoDB
3. Check password is correct
4. Look for server logs about login attempt
```

---

## Files Modified & Created

**Created**:
- ✅ `server/route/userRoutes.js`
- ✅ `views/register.ejs`
- ✅ `views/login.ejs`
- ✅ `views/dashboard.ejs`
- ✅ `views/profile.ejs`
- ✅ `views/user/my-posts.ejs`
- ✅ `views/user/add-post.ejs`
- ✅ `views/user/edit-post.ejs`
- ✅ `.env.example`
- ✅ `SETUP_GUIDE.md`
- ✅ `USER_DASHBOARD_GUIDE.md`
- ✅ `QUICK_START.md` (this file)

**Modified**:
- ✅ `index.js` (added userRoutes)
- ✅ `server/models/user.js` (added fields)
- ✅ `server/models/post.js` (added userId, author)
- ✅ `server/route/main.js` (fixed email)
- ✅ `server/route/admin.js` (updated post creation)

---

## Success Indicators

All of these should be true:

- ✅ Can register new users
- ✅ Users appear in MongoDB
- ✅ Can edit profile and changes save to database
- ✅ Can create posts and they appear in database
- ✅ Can edit your own posts
- ✅ Can delete your own posts
- ✅ Cannot edit other users' posts
- ✅ Can login/logout
- ✅ Dashboard shows current user info

If any of these fail, check the troubleshooting section above!
