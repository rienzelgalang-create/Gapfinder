const Quiz = require('../model/Quiz');

// Add a Question
exports.addQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswerIndex, gradeLevel, topic } = req.body;

        const newQuestion = new Quiz({
            questionText,
            options,
            correctAnswerIndex,
            gradeLevel,
            topic
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question added!" });

    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
};

// Get All Questions (For Students)
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Quiz.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions" });
    }
};