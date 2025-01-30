const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// Ensure a dummy admin exists when the server starts
async function createDummyAdmin() {
    try {
        const existingAdmin = await Admin.findOne({ username: "admin" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await Admin.create({ username: "admin", password: hashedPassword });
            console.log("Dummy admin created: username = admin, password = admin123");
        }
    } catch (error) {
        console.error("Error creating dummy admin:", error);
    }
}

createDummyAdmin();

// ✅ Admin Login Route (No Authentication Middleware)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // ✅ Generate JWT Token (No Authentication Middleware required here)
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Admin Dashboard without authentication (Public access)
router.get("/dashboard", (req, res) => {
    res.json({ message: "Welcome to the admin dashboard" });
});

module.exports = router;
