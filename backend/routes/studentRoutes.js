const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

async function addStudentIds() {
    const students = await Student.find();
    console.log(`Found ${students.length} students in the database.`);

    for (const [index, student] of students.entries()) {
        if (!student.studentId) {
            console.log(`Processing student: ${student.name} (ID: ${student._id})`);
            if (!student.parentName) {
                console.error(`Skipping student with ID ${student._id} because parentName is missing.`);
                continue;
            }
            student.studentId = `STU${index + 1}`;
            try {
                await student.save();
                console.log(`Student ID added for ${student.name}: ${student.studentId}`);
            } catch (error) {
                console.error(`Error saving student ${student.name}:`, error.message);
            }
        } else {
            console.log(`Student ${student.name} already has a studentId: ${student.studentId}`);
        }
    }
    console.log("Student IDs added successfully!");
}

addStudentIds(); 

// Refactored populateMissingParentNames
async function populateMissingParentNames() {
    const students = await Student.find({ $or: [{ parentName: { $exists: false } }, { studentId: { $exists: false } }] });
    for (const [index, student] of students.entries()) {
        if (!student.parentName) {
            student.parentName = "Unknown Parent";
        }
        if (!student.studentId) {
            student.studentId = `STU${index + 1}`;
        }
        try {
            await student.save();
            console.log(`Updated student: ${student.name}`);
        } catch (error) {
            console.error(`Error updating student ${student.name}:`, error.message);
        }
    }
    console.log("Missing parent names and student IDs populated successfully!");
}

// populateMissingParentNames(); // Commented out


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


async function checkMissingStudentIds() {
    const students = await Student.find({ studentId: { $exists: false } });
    if (students.length > 0) {
        console.log("Students missing studentId:", students);
    } else {
        console.log("All students have a studentId.");
    }
}

// checkMissingStudentIds(); // Commented out

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

// Get student by studentId
router.get("/:studentId", async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({
            name: student.name,
            class: student.standard, // Ensure this maps correctly
            attendance: student.attendance, // Ensure this field exists in the schema
            marks: student.marks // Ensure this field exists in the schema
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
