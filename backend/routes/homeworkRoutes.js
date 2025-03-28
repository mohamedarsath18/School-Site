const express = require("express");
const Homework = require("../models/Homework");

const router = express.Router();

// ========================= Routes =========================

// Get all homework assignments
router.get("/", async (req, res) => {
    try {
        const homework = await Homework.find().sort({ dueDate: 1 }); // Sort by due date
        res.json(homework.map(h => ({
            class: h.class, // Class the homework is assigned to
            title: h.title, // Title of the homework
            description: h.description, // Details about the homework
            dueDate: h.dueDate ? h.dueDate.toISOString().split("T")[0] : "No due date" // Format due date
        })));
    } catch (error) {
        res.status(500).json({ message: "Error fetching homework", error });
    }
});

// Add homework for a specific class
router.post("/", async (req, res) => {
    try {
        const { class: className, title, description, dueDate } = req.body;

        // Validate required fields
        if (!className || !title || !description) {
            return res.status(400).json({ message: "Class, title, and description are required." });
        }

        // Create and save new homework
        const newHomework = new Homework({ class: className, title, description, dueDate });
        await newHomework.save();

        res.status(201).json({ message: "Homework added successfully", homework: newHomework });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid data provided", error: error.message });
        }
        res.status(500).json({ message: "Error adding homework", error });
    }
});

// Get homework for a specific class
router.get("/:class", async (req, res) => {
    try {
        const className = req.params.class;

        // Fetch homework for the specified class
        const homework = await Homework.find({ class: className }).sort({ dueDate: 1 });

        if (!homework.length) {
            return res.status(404).json({ message: "No homework found for this class." });
        }

        res.json(homework.map(h => ({
            class: h.class,
            title: h.title,
            description: h.description,
            dueDate: h.dueDate ? h.dueDate.toISOString().split("T")[0] : "No due date"
        })));
    } catch (error) {
        res.status(500).json({ message: "Error fetching homework", error });
    }
});

// Update homework for a specific class and title
router.put("/:class/:title", async (req, res) => {
    try {
        const { class: className, title } = req.params;
        const { description, dueDate } = req.body;

        // Validate required fields
        if (!description) {
            return res.status(400).json({ message: "Description is required." });
        }

        // Update homework by class and title
        const updatedHomework = await Homework.findOneAndUpdate(
            { class: className, title },
            { description, dueDate },
            { new: true, runValidators: true } // Ensure validation is applied
        );

        if (!updatedHomework) {
            return res.status(404).json({ message: "Homework not found" });
        }

        res.json({ message: "Homework updated successfully", homework: updatedHomework });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid data provided", error: error.message });
        }
        res.status(500).json({ message: "Error updating homework", error });
    }
});

// Delete homework for a specific class and title
router.delete("/:class/:title", async (req, res) => {
    try {
        const { class: className, title } = req.params;

        // Delete homework by class and title
        const deletedHomework = await Homework.findOneAndDelete({ class: className, title });

        if (!deletedHomework) {
            return res.status(404).json({ message: "Homework not found" });
        }

        res.json({ message: "Homework deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting homework", error });
    }
});

module.exports = router;