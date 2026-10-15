import jwt from "jsonwebtoken";

const auth = (req, res, next) =>{
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : authorization;

    try {
        if (!token) {
            return res.status(401).json({success: false, message: "Authentication required"})
        }
        jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(401).json({success: false, message: "Invalid or expired token"})
    }

    
}
export default auth;