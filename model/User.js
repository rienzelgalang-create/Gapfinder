const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
    
    isApproved: { type: Boolean, default: true }, // Students are auto-approved, Tutors are NOT
    assignedTutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // For Students: who is their teacher?
});

module.exports = mongoose.model('User', UserSchema);