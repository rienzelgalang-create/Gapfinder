const User = require('../model/User');

// 1. REGISTER NEW USER
exports.signup = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // --- SECRET ADMIN RULE ---
        // Default: Tutors need approval, Students are auto-approved.
        let isApproved = true; 
        
        if (email === 'admin@gapfinder.com') {
            role = 'admin';       // Force Role to Admin
            isApproved = true;    // Auto-approve Admin
        } else if (role === 'tutor') {
            isApproved = false;   // Tutors still need approval
        }

        const newUser = new User({
            name,
            email,
            password, 
            role,
            isApproved
        });

        await newUser.save();

        res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during signup." });
    }
};

// 2. LOG IN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and password
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // CHECK APPROVAL STATUS (For Tutors)
        if (user.role === 'tutor' && !user.isApproved) {
            return res.status(403).json({ 
                message: "Your account is pending approval. Please wait for an Admin to verify you." 
            });
        }

        // Login Success
        res.status(200).json({ 
            message: "Login successful", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// 3. FORGOT PASSWORD (SIMULATION)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with that email." });
        }

        // Simulation Success
        console.log(`[SIMULATION] Password reset link sent to: ${email}`);
        res.status(200).json({ message: "Reset link sent to your email!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};