import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import Comment from '../models/comment.js'

export const adminLogin = async (req,res)=>{
    try {
        const {email, password} = req.body

        if(email!==process.env.ADMIN_EMAIL || password!==process.env.ADMIN_PASSWORD){
            return res.status(401).json({success: false, message: "Invalid Credentials"})
        }

        const token = jwt.sign({email, role: "admin"}, process.env.JWT_SECRET, { expiresIn: "2h" })
        res.status(200).json({success:true, token})
    } catch (error) {
        res.status(500).json({success: false, message: "Unable to log in"})
    }
}

export const getAllBlogsAdmin = async(req,res) =>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1})
        res.json({success:true, blogs})
    } catch (error) {
        res.status(500).json({success: false, message: "Unable to load blogs"})
    }
}

export const getAllComments = async(req,res)=>{
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt:-1})
        res.json({success:true, comments})
    } catch (error) {
        res.status(500).json({success: false, message: "Unable to load comments"})
    }
}
export const getDashboard = async(req,res)=>{
    try {
       const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
       const blogs = await Blog.countDocuments();
       const comments = await Comment.countDocuments();
       const drafts = await Blog.countDocuments({isPublished: false});
       const dashboardData = {
        blogs, comments, drafts, recentBlogs
       }
       res.json({success: true, dashboardData})
    } catch (error) {
        res.status(500).json({success: false, message: "Unable to load dashboard"})
    }
}

export const deleteCommentById = async(req,res) =>{
    try {
        const {id} = req.body;
        if (!id) return res.status(400).json({success: false, message: "Comment ID is required"})
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) return res.status(404).json({success: false, message: "Comment not found"})
        res.status(200).json({success:true, message:"Comment deleted successfully"})
        
    } catch (error) {
        res.status(400).json({success: false, message: "Invalid comment ID"})
    }
}
export const approveCommentById = async(req,res) =>{
    try {
        const {id} = req.body;
        if (!id) return res.status(400).json({success: false, message: "Comment ID is required"})
        const comment = await Comment.findByIdAndUpdate(id, {isApproved:true});
        if (!comment) return res.status(404).json({success: false, message: "Comment not found"})
        res.status(200).json({success:true, message:"Comment approved successfully"})
    } catch (error) {
        res.status(400).json({success: false, message: "Invalid comment ID"})
    }
}

