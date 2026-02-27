const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], 
    correctAnswerIndex: { type: Number, required: true }, 
    gradeLevel: { type: Number, required: true }, 
    topic: { type: String, required: true },
    
    // NEW FIELD: Links this question to a specific Exam
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true } 
});

module.exports = mongoose.model('Quiz', QuizSchema);