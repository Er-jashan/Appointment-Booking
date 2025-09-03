import jwt from 'jsonwebtoken';

//doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const {dtoken} = req.headers;
        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }

        const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.docId = token_decoded.id;
        next();
    } catch (error) {
        console.error('Error in authDoc middleware:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
export default authDoctor;