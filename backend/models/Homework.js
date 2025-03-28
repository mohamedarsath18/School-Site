const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
    class: { 
        type: String, 
        required: true, 
        enum: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"], // Allowed class names
        trim: true 
    }, // Class the homework is assigned to
    title: { type: String, required: true, trim: true }, // Title of the homework
    description: { type: String, required: true, trim: true }, // Details about the homework
    dueDate: { 
        type: Date, 
        default: () => new Date(new Date().setDate(new Date().getDate() + 7)) // Default to 7 days from now
    }, // Optional due date
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] // Reference to students (optional)
}, { timestamps: true });

// Add an index for faster queries by class
homeworkSchema.index({ class: 1 });

module.exports = mongoose.model("Homework", homeworkSchema);