// backend/routes/examRoutes.js
import express from 'express';
import { getAllExams } from '../controllers/examController.js';

const router = express.Router();

// GET /api/exams
router.get('/', getAllExams);

export default router;