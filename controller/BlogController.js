import Blog from "../models/Blog.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";

// @desc    Upload blog image
// @route   POST /api/blogs/upload
// @access  Private
export const uploadBlogImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const stream = cloudinary.v2.uploader.upload_stream(
            {
                folder: "blogs",
            },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ success: false, message: "Upload failed" });
                }
                res.status(200).json({ success: true, imageUrl: result.secure_url });
            }
        );
        stream.end(req.file.buffer);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Logged-in User)
export const createBlog = async (req, res) => {
    try {
        const { title, shortDescription, content, blogImage, tags } = req.body;
        const { id: userId, name, email } = req.user;

        // Fetch full user details to get profile photo
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!title || !shortDescription || !content || !blogImage) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (title, shortDescription, content, blogImage)",
            });
        }

        const newBlog = new Blog({
            title,
            shortDescription,
            content,
            blogImage,
            tags: tags || [],
            author: userId,
            authorName: user.name,
            authorEmail: user.email,
            authorPhoto: user.profilePhoto, // Auto-fetched from user model
            status: "Pending Approval",
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({
            success: true,
            message: "Blog post submitted and is pending approval.",
            data: savedBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get all approved blogs
// @route   GET /api/blogs
// @access  Public
export const getAllApprovedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: "Approved" })
            .sort({ publishedDate: -1 })
            .populate("author", "name profilePhoto");

        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        console.error("Error fetching approved blogs:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name profilePhoto branch batch");

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Only allow viewing if approved OR if the requester is the author or admin
        if (blog.status !== "Approved") {
            const isAuthor = req.user && req.user.id === blog.author.toString();
            const isAdmin = req.user && req.user.userType === "admin";

            if (!isAuthor && !isAdmin) {
                return res.status(403).json({ success: false, message: "Not authorized to view this blog" });
            }
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get all pending blogs for admin
// @route   GET /api/blogs/admin/pending
// @access  Private (Admin Only)
export const getPendingBlogs = async (req, res) => {
    try {
        if (req.user.userType !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized. Admin only." });
        }

        const blogs = await Blog.find({ status: "Pending Approval" })
            .sort({ createdAt: -1 })
            .populate("author", "name email profilePhoto");

        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        console.error("Error fetching pending blogs:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Approve or Reject a blog
// @route   PATCH /api/blogs/admin/:id/status
// @access  Private (Admin Only)
export const updateBlogStatus = async (req, res) => {
    try {
        if (req.user.userType !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized. Admin only." });
        }

        const { status } = req.body; // Approved, Rejected, or Pending Approval
        if (!["Approved", "Rejected", "Pending Approval"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        blog.status = status;
        if (status === "Approved") {
            blog.publishedDate = new Date();
        }

        await blog.save();

        res.status(200).json({
            success: true,
            message: `Blog ${status.toLowerCase()} successfully`,
            data: blog,
        });
    } catch (error) {
        console.error("Error updating blog status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get blogs by current user
// @route   GET /api/blogs/my-blogs
// @access  Private
export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (Owner or Admin)
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const isAuthor = req.user.id === blog.author.toString();
        const isAdmin = req.user.userType === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
