// routes/counselingRoutes.js
import express from 'express';
import { 
  getAllCounselingRounds, 
  addCounselingRound, 
  updateCounselingRound, 
  deleteCounselingRound 
} from '../controllers/counselingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Assuming authMiddleware path

const router = express.Router();

// GET all rounds (Public/Student view, or admin list)
router.get('/', getAllCounselingRounds);

// POST new round (Admin only)
router.post('/', authMiddleware(['admin']), addCounselingRound); 

// PUT/PATCH update round (Admin only)
router.put('/:id', authMiddleware(['admin']), updateCounselingRound); 

// DELETE round (Admin only)
router.delete('/:id', authMiddleware(['admin']), deleteCounselingRound);

export default router; 