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

router.get('/admin/data', adminController.getDashboardData);


router.post('/admin/approve', adminController.approveTeacher);


router.post('/admin/assign', adminController.assignStudent);


// ==========================
// 4. EXAM ROUTES (New System)
// ==========================

router.post('/exam/create', examController.createExam);


router.get('/exam/all', examController.getAllExams);


router.post('/exam/add-question', examController.addQuestionToExam);


router.get('/exam/:examId/questions', examController.getExamQuestions);

// ==========================
// 5. TEACHER ROUTES
// ==========================

router.post('/teacher/my-students', teacherController.getMyStudents);


module.exports = router;