const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

const app = express();
connectDB(); // Connect to MongoDB

// Middleware
app.use(express.json());
app.use(cors());

// Sample route
app.get("/", (req, res) => {
    res.send("School Website API is running...");
});

// Importing Routes
const studentRoutes = require("./routes/studentRoutes");
const marksRoutes = require("./routes/marksRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const eventRoutes = require("./routes/eventRoutes");
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require("./routes/adminRoutes");

// Using Routes without authentication
app.use("/api/students", studentRoutes);  // Public access for students
app.use("/api/marks", marksRoutes);      // Public access for marks
app.use("/api/homework", homeworkRoutes); // Public access for homework
app.use("/api/events", eventRoutes);     // Public access for events
app.use("/api/contacts", contactRoutes); // Public access for contacts
app.use("/api/admin", adminRoutes);      // Public access for admin routes

// ✅ Admin Dashboard without authentication
app.get('/api/admin-dashboard', (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard' });
});

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback to index.html for SPA routing (if needed)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});