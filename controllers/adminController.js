const User = require('../model/User');

// 1. GET ALL DATA FOR DASHBOARD
exports.getDashboardData = async (req, res) => {
    try {
        // A. Find Teachers who are waiting for approval
        const pendingTeachers = await User.find({ role: 'tutor', isApproved: false });

        // B. Find All Approved Tutors (to populate the dropdown)
        const allTutors = await User.find({ role: 'tutor', isApproved: true });

        // C. Find All Students and "Populate" their tutor's name
        // "populate" is a Mongoose trick: it looks up the ID in 'assignedTutor' 
        // and automatically grabs that person's name for us.
        const allStudents = await User.find({ role: 'student' })
            .populate('assignedTutor', 'name'); 

        res.status(200).json({ pendingTeachers, allTutors, allStudents });

    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};

// 2. APPROVE A TEACHER
exports.approveTeacher = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Find the user and set isApproved to true
        await User.findByIdAndUpdate(userId, { isApproved: true });
        
        res.status(200).json({ message: "Teacher Approved Successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error approving teacher" });
    }
};

// 3. PAIR STUDENT WITH TEACHER
exports.assignStudent = async (req, res) => {
    try {
        const { studentId, tutorId } = req.body;

        // Find the student and update their 'assignedTutor' field
        await User.findByIdAndUpdate(studentId, { assignedTutor: tutorId });

        res.status(200).json({ message: "Student assigned successfully!" });

    } catch (error) {
        console.error("Error pairing student:", error);
        res.status(500).json({ message: "Error assigning student" });
    }
};