const express = require("express");
const Marks = require("../models/Marks");

const router = express.Router();

// Get all marks
router.get("/", async (req, res) => {  // Removed authenticate
    try {
        const marks = await Marks.find().populate("studentId", "name");
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching marks", error });
    }
});

// Add marks for a student
router.post("/", async (req, res) => {  // No authentication
    try {
        const { studentId, standard, subjects, examType } = req.body;
        const newMarks = new Marks({ studentId, standard, subjects, examType });
        await newMarks.save();
        res.status(201).json(newMarks);
    } catch (error) {
        res.status(400).json({ message: "Error adding marks", error });
    }
});

// Update marks (PUT request)
router.put("/:id", async (req, res) => {  // No authentication
    try {
        const { studentId, standard, subjects, examType } = req.body;
        const updatedMarks = await Marks.findByIdAndUpdate(
            req.params.id,
            { studentId, standard, subjects, examType },
            { new: true }
        );
        res.json(updatedMarks);
    } catch (error) {
        res.status(400).json({ message: "Error updating marks", error });
    }
});

// Improved Delete Route
router.delete("/:id", async (req, res) => {  // No authentication
    try {
        const mark = await Marks.findById(req.params.id);
        if (!mark) {
            return res.status(404).json({ message: "Marks record not found" });
        }
        await Marks.findByIdAndDelete(req.params.id);
        res.json({ message: "Marks deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting marks", error });
    }
});

module.exports = router;
