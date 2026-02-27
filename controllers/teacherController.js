const User = require('../model/User');

// Get students assigned to a specific teacher
exports.getMyStudents = async (req, res) => {
    try {
        const { teacherId } = req.body; // We will send the logged-in ID
        
        // Find all users who have the role 'student' AND are assigned to this teacherId
        const myStudents = await User.find({ role: 'student', assignedTutor: teacherId });
        
        res.status(200).json(myStudents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
};