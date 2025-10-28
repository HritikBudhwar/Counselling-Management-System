// backend/routes/eligibilityRoutes.js (NEW FILE)
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import { getAllCriteria, linkCourseEligibility, setCourseSeats } from '../controllers/eligibilityController.js';

const router = express.Router();

router.get('/criteria', getAllCriteria); // Publicly fetch list of criteria names
router.post('/link', authMiddleware(['admin']), linkCourseEligibility); // Admin links eligibility to course
router.post('/seats', authMiddleware(['admin']), setCourseSeats);     // Admin sets seat capacity

export default router;