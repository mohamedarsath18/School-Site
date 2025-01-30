const express = require("express");
const Homework = require("../models/Homework");

const router = express.Router();

// Get all homework assignments
router.get("/", async (req, res) => {  // No authentication
    try {
        const homework = await Homework.find();
        res.json(homework.map(h => ({
            _id: h._id,
            title: h.title,  // ✅ Ensure title is sent to the frontend
            standard: h.standard,
            subject: h.subject,
            description: h.description,
            dueDate: h.dueDate.toISOString().split("T")[0]
        })));
    } catch (error) {
        res.status(500).json({ message: "Error fetching homework", error });
    }
});

// Add a homework assignment
router.post("/", async (req, res) => {  // No authentication
    try {
        const { standard, subject, description, dueDate } = req.body;
        const newHomework = new Homework({ standard, subject, description, dueDate });
        await newHomework.save();
        res.status(201).json(newHomework);
    } catch (error) {
        res.status(400).json({ message: "Error adding homework", error });
    }
});

// Update homework (PATCH request)
router.patch("/:id", async (req, res) => {  // No authentication
    try {
        const updatedHomework = await Homework.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHomework);
    } catch (error) {
        res.status(400).json({ message: "Error updating homework", error });
    }
});

// Delete homework (DELETE request)
router.delete("/:id", async (req, res) => {  // No authentication
    try {
        await Homework.findByIdAndDelete(req.params.id);
        res.json({ message: "Homework deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting homework", error });
    }
});

module.exports = router;
