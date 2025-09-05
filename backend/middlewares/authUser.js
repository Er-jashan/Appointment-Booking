import jwt from 'jsonwebtoken';

//user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decoded.id;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
export default authUser;