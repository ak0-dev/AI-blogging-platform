import fs from 'fs'
import mongoose from 'mongoose';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
    let imagePath;
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;
        imagePath = imageFile?.path;

        //Check if all fields are present
        if (!title?.trim() || !description?.trim() || !category?.trim() || !imageFile) {
            return res.status(400).json({ success: false, message: "Required blog fields are missing" })
        }
        const fileBuffer = fs.readFileSync(imageFile.path)

        //upload image to image kit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        //optimise through imagekit url transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' }, //autocompression
                { format: 'webp' }, //convert to modern format
                { width: 1280 } //width resizing
            ]
        })

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })

        res.status(201).json({ success: true, message: "Blog added successfully" })

    } catch (error) {
        res.status(400).json({ success: false, message: "Unable to add blog" })
    } finally {
        if (imagePath) {
            fs.promises.unlink(imagePath).catch(() => {})
        }
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.status(200).json({ success: true, blogs })
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to load blogs" })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" })
        }
        const blog = await Blog.findOne({ _id: blogId, isPublished: true })
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }
        res.status(200).json({ success: true, blog })
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to load blog" })
    }
}
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" })
        }
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" })
        //delete comment

        await Comment.deleteMany({ blog: id });

        res.status(200).json({ success: true, message: "Blog deleted successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid blog ID" })
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" })
        }
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" })
        blog.isPublished = !blog.isPublished
        await blog.save();
        res.status(200).json({ success: true, message: "Blog status updated" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid blog ID" })
    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        if (!mongoose.isValidObjectId(blog) || !name?.trim() || !content?.trim()) {
            return res.status(400).json({ success: false, message: "Valid blog, name, and comment are required" })
        }
        const publishedBlog = await Blog.findOne({ _id: blog, isPublished: true });
        if (!publishedBlog) return res.status(404).json({ success: false, message: "Blog not found" })
        await Comment.create({ blog, name: name.trim(), content: content.trim() });
        res.status(201).json({ success: true, message: 'Comment added for review' })
    } catch (error) {
        res.status(400).json({ success: false, message: "Unable to add comment" })
    }
}


export const getBlogComment = async (req, res) => {
    try {
        const { blogId } = req.body;
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" })
        }
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
        res.status(200).json({ success: true, comments })
    } catch (error) {
        res.status(400).json({ success: false, message: "Unable to load comments" })
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body
        if (typeof prompt !== "string" || prompt.trim().length < 3 || prompt.length > 500) {
            return res.status(400).json({ success: false, message: "Prompt must be between 3 and 500 characters" })
        }
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.status(200).json({ success: true, content })
    } catch (error) {
        res.status(502).json({ success: false, message: "Content generation service unavailable" })
    }
}
