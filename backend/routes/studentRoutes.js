// backend/routes/studentRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'; 
// 🚨 FIX: Corrected casing (Controller) and added file extension (.js)
import { 
    submitStudentProfile, 
    submitStudentMarks, 
    submitStudentPreferences,
    getStudentData 
} from '../controllers/studentcontroller.js'; 


const router = express.Router();

// POST route for basic profile details (Step 1)
router.post('/profile', authMiddleware(['student']), submitStudentProfile);

// POST route for exam results (Step 2)
router.post('/marks', authMiddleware(['student']), submitStudentMarks);

// POST route for college preferences (Step 3)
router.post('/preferences', authMiddleware(['student']), submitStudentPreferences);

// GET route for fetching all student dashboard data (Step 4, pre-fill, results)
router.get('/data', authMiddleware(['student']), getStudentData); 

export default router;