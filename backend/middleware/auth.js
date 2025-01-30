const jwt = require("jsonwebtoken");
const adminSecretKey = process.env.JWT_SECRET; // Admin authentication

function authenticate(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const tokenValue = token.replace("Bearer ", ""); // Ensure format

        // ✅ Verify only admin token
        const decodedAdmin = jwt.verify(tokenValue, adminSecretKey);
        req.admin = decodedAdmin;
        return next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
}

module.exports = authenticate;
