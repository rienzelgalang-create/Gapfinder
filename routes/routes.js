const express = require('express');
const router = express.Router();

// Import ALL Controllers here
const authController = require('../controllers/authController');
const quizController = require('../controllers/quizController');
const adminController = require('../controllers/adminController'); // NEW
const examController = require('../controllers/examController');   // NEW
const teacherController = require('../controllers/teacherController'); // NEW IMPORT

// ==========================
// 1. AUTHENTICATION ROUTES
// ==========================
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);


// ==========================
// 2. QUIZ ROUTES (Legacy / Simple Questions)
// ==========================
router.post('/quiz/add', quizController.addQuestion);
router.get('/quiz/all', quizController.getQuestions);


// ==========================
// 3. ADMIN ROUTES (Approvals & Pairing)
// ==========================
// Full URL: http://localhost:3000/api/admin/data
router.get('/admin/data', adminController.getDashboardData);

// Full URL: http://localhost:3000/api/admin/approve
router.post('/admin/approve', adminController.approveTeacher);

// Full URL: http://localhost:3000/api/admin/assign
router.post('/admin/assign', adminController.assignStudent);


// ==========================
// 4. EXAM ROUTES (New System)
// ==========================
// Full URL: http://localhost:3000/api/exam/create
router.post('/exam/create', examController.createExam);

// Full URL: http://localhost:3000/api/exam/all
router.get('/exam/all', examController.getAllExams);

// Full URL: http://localhost:3000/api/exam/add-question
router.post('/exam/add-question', examController.addQuestionToExam);

// Full URL: http://localhost:3000/api/exam/:examId/questions
router.get('/exam/:examId/questions', examController.getExamQuestions);

// ==========================
// 5. TEACHER ROUTES
// ==========================
// Full URL: http://localhost:3000/api/teacher/my-students
router.post('/teacher/my-students', teacherController.getMyStudents);


module.exports = router;