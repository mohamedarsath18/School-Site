const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    standard: { type: String, required: true },
    rollNumber: { type: Number, required: true, unique: true },
    parentName: { type: String },
    parentEmail: { type: String },
    studentId: { type: String },
    attendance: { type: Number, default: 0 }, // Add attendance field
    marks: { type: String, default: "N/A" } // Add marks field
});

module.exports = mongoose.model("Student", studentSchema);