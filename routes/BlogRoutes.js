import express from "express";

import {
    createBlog,
    getAllApprovedBlogs,
    getBlogById,
    getPendingBlogs,
    updateBlogStatus,
    getMyBlogs,
    deleteBlog,
    uploadBlogImage,
} from "../controller/BlogController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { optionalAuth } from "../middlewares/isAuthenticated.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Public routes
router.get("/", getAllApprovedBlogs);
router.get("/single/:id", optionalAuth, getBlogById);

// Protected routes (Any logged-in user)
router.post("/", authenticateToken, createBlog);
router.post("/upload", authenticateToken, upload.single("blogImage"), uploadBlogImage);
router.get("/my-blogs", authenticateToken, getMyBlogs);

router.delete("/:id", authenticateToken, deleteBlog);

// Admin routes
router.get("/admin/pending", authenticateToken, getPendingBlogs);
router.patch("/admin/:id/status", authenticateToken, updateBlogStatus);

export default router;
