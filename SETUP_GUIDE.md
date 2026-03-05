# Setup Guide for Node.js Blog Features

## Email Configuration (Contact Form)

The contact form uses Gmail's SMTP server to send emails. Follow these steps to set it up:

### 1. Get Your Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication if you haven't already
3. Scroll down and click "App Passwords"
4. Select "Mail" and "Windows Computer" (or your device type)
5. Google will generate a 16-character password - **copy this**
6. In your `.env` file, set:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (the 16-character password from Google)
   ```

### 2. Verify Configuration

Test your configuration by:
1. Navigating to `/contact`
2. Filling out the form
3. You should receive a confirmation email at the contact form email address

### Troubleshooting Email Issues

- **"Invalid login"**: Check that you're using an App Password, not your regular Gmail password
- **"Less secure apps"**: This error means you need to use App Passwords instead
- **Port issues**: The default SMTP port 587 is already configured

---

## User Post Management

### User Features

Users can now:
1. **Create Posts**: `/user/add-post` - Write and publish blog posts
2. **Edit Own Posts**: `/user/edit-post/:id` - Modify their published posts
3. **Delete Own Posts**: Click delete button on My Posts page
4. **View All Posts**: `/user/posts` - See all their published posts

### Navigation

From user dashboard:
- Click "My Posts" to see all your posts
- Click "Create New Post" to write a new article
- Click "Edit" on any post to modify it
- Click "Delete" to remove a post (requires confirmation)

---

## Admin Features

### Admin Post Management

Admins can:
1. **Create Posts**: `/admin/add-post` - Create blog posts
2. **Edit Posts**: `/admin/edit-post/:id` - Modify any post
3. **Delete Any Post**: Admins can delete posts from any user or admin
4. **View Dashboard**: `/admin/dashboard` - See all posts

### Key Difference: Admin Power

- **Users** can only edit/delete their own posts
- **Admins** can delete ANY post from any user

---

## Pagination

The blog now has fixed pagination that:
- Validates page numbers (prevents negative pages)
- Shows correct "next page" and "previous page" links
- Home page: 20 posts per page
- Posts page: 10 posts per page

---

## Database Changes

The Post model was updated to include:
- `userId` - Track which user created the post
- `author` - Store author username for display

When upgrading, existing posts will have `null` userId.

---

## Testing

### Create a Test Account
```
Navigate to /register
- Username: testuser
- Email: test@example.com
- Password: password123
```

### Create a Test Post
```
After logging in:
1. Click "Create New Post"
2. Add a title and content
3. Click "Publish Post"
```

### Test Admin Deletion
```
As an admin:
1. Go to /admin/dashboard
2. You'll see all posts from all users
3. You can delete any post with the delete button
```

---

## Troubleshooting

### Contact form not sending emails
- Check `.env` file has GMAIL_USER and GMAIL_PASSWORD set
- Verify you're using an App Password (not regular Gmail password)
- Check Gmail account hasn't blocked the login attempt

### Can't edit another user's post
- This is intentional! Users can only edit their own posts
- Only admins can edit/delete posts from other users

### Pagination showing wrong page
- Clear browser cache
- Page numbers must be positive integers
- Invalid page numbers default to page 1

