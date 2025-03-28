const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    standard: { type: String, required: true },
    subjects: {
        type: [{ subjectName: String, marksObtained: Number, totalMarks: Number }],
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: "Subjects array must contain at least one subject."
        },
        required: true
    },
    examType: { type: String, required: true },
});


module.exports = mongoose.model("Marks", marksSchema);
