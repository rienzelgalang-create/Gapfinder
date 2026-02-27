const Exam = require('../model/Exam');
const Quiz = require('../model/Quiz');

// 1. Create a New Exam (Container)
exports.createExam = async (req, res) => {
    try {
        const { title, description, gradeLevel } = req.body;
        const newExam = new Exam({ title, description, gradeLevel });
        await newExam.save();
        res.status(201).json({ message: "Exam created!", exam: newExam });
    } catch (error) {
        res.status(500).json({ message: "Error creating exam" });
    }
};

// 2. Get All Exams (For Admin List)
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams" });
    }
};

// 3. Add Question to a Specific Exam
exports.addQuestionToExam = async (req, res) => {
    try {
        const { examId, questionText, options, correctAnswerIndex, gradeLevel, topic } = req.body;
        
        const newQuestion = new Quiz({
            examId, // Link to the exam
            questionText,
            options,
            correctAnswerIndex,
            gradeLevel,
            topic
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question added to exam!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding question" });
    }
};

// 4. Get Questions for a Specific Exam (For Student Taking the Test)
exports.getExamQuestions = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Quiz.find({ examId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions" });
    }
};