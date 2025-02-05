const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {  // Removed authenticate
    try {
        const students = await Student.find();
        res.json(students.map(student => ({
            _id: student._id,
            name: student.name,
            standard: student.standard,
            rollNumber: student.rollNumber,
            parentName: student.parentName,
            parentEmail: student.parentEmail
        })));              
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
});

// Add a new student
// Add a new student
router.post("/", async (req, res) => {
    try {
        const { name, standard, rollNumber, parentEmail, parentName } = req.body;

        // Check if a student with the same roll number already exists
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Roll number already exists" });
        }

        const newStudent = new Student({ name, standard, rollNumber, parentEmail, parentName });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: "Error adding student", error });
    }
});


// Update a student
router.put("/:id", async (req, res) => {  // No authentication
    try {
        const { name, standard, rollNumber, parentEmail, parentName } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, standard, rollNumber, parentEmail, parentName },
            { new: true }
        );        
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: "Error updating student", error });
    }
});

// Delete a student
router.delete("/:id", async (req, res) => {  // No authentication
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error });
    }
});

module.exports = router;
