const { verifyAccessToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    // let token = req.cookies.token;
    let token = "";
    
    // Fallback: check Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;   
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid Token: Token is not valid or expired' });
    }
};

module.exports = authMiddleware;
