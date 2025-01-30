const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    standard: { type: String, required: true }, // Changed from "Class" in frontend
    rollNumber: { type: String, required: true, unique: true },
    parentEmail: { type: String, required: true },
    parentName: { type: String, required: true }, // ADDED FIELD TO MATCH FRONTEND
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
