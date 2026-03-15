const mongoose = require('mongoose');

const ResultsSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    examTitle: { type: String, required: true },
    score: { type: Number, required: true },    
});

module.exports = mongoose.model('Results', ResultsSchema);