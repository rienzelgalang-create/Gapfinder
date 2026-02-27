const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Unit 1: Algebra"
    description: { type: String }, // e.g., "Basic addition and subtraction"
    gradeLevel: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);