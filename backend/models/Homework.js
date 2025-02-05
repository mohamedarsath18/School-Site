const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
    title: { type: String, required: true },  // ✅ Added Title field
    standard: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
});


module.exports = mongoose.model("Homework", homeworkSchema);
