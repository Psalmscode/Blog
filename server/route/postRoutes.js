const express = require("express");
// Double check: if your folder is still named 'modals', change this to '../modals/post'
const Post = require("../models/post"); 

const router = express.Router();

// 1. CHANGE TO .get TO TEST IN BROWSER
router.get("/test", async (req, res) => {
  try {
    // This creates a new post every time you refresh the page
    const newPost = new Post({
      title: "Hello MongoDB",
      content: "If you see this, it worked 🎉"
    });

    await newPost.save();
    
    // This sends back the post we just saved so you can see it in the browser
    res.status(201).json({
      message: "Data saved to MongoDB successfully!",
      data: newPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. ADD A ROUTE TO SEE ALL POSTS
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;