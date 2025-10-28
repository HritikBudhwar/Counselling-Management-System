// backend/routes/allocationRoutes.js
import express from 'express';
import { 
    runSeatAllocation, 
    getAllAllocations,
    getSeatMatrix 
} from '../controllers/allocationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.get('/matrix', authMiddleware(['admin']), getSeatMatrix);
router.get('/allocations', authMiddleware(['admin']), getAllAllocations);
router.post('/allocate', authMiddleware(['admin']), runSeatAllocation); 

export default router;