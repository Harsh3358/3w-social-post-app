import express from "express";
import Post from "../models/post.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();


// POST /api/posts
router.post("/", auth, async (req, res) => {
    console.log("POST /api/posts called");
  console.log("Authorization header:", req.headers.authorization);
  console.log("req.user (from auth):", req.user && req.user.name);
  console.log("req.body:", req.body);
  const { text, imageUrl } = req.body;

  try {
    const post = new Post({
      userId: req.user._id,
      username: req.user.name,
      text,
      imageUrl,
    });

    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    // // DEBUGGING: print the whole error so we can see what's going on
    // console.error("POST /api/posts ERROR:", err && err.message);
    // console.error(err && err.stack);

    return res.status(400).json({ message: err.message });
  }
});

// GET /api/posts?page=1&limit=5
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
});


// PUT /api/posts/:id/like
router.put("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.find(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push({
        userId: req.user._id,
        username: req.user.name,
      });
    }

    await post.save();
    return res.json({ likesCount: post.likes.length, likes: post.likes });
  } catch (err) {
    return res.status(500).json({ message: "Like failed" });
  }
});

// POST /api/posts/:id/comment
router.post("/:id/comment", auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Comment text required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: req.user._id,
      username: req.user.name,
      text,
    });

    await post.save();
    return res.json(post.comments);
  } catch (err) {
    return res.status(500).json({ message: "Comment failed" });
  }
});

export default router;