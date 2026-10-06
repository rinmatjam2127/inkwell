import { Router } from "express"; 
import { PostService } from "../services/post.service.js";

const router = Router();

// POST /api/posts - Publish a new post with optional tags
router.post("/posts", async (req, res) => {
  try {
    const { authorId, title, body, tagNames } = req.body;
    const post = await PostService.publish({ authorId, title, body, tagNames });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      error: { code: err.code || "VALIDATION_ERROR", message: err.message },
    });
  }
});

// GET /api/posts - Fetch published posts or perform keyword search
router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page: Number(page) })
      : await PostService.listPublished({ page: Number(page) });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;