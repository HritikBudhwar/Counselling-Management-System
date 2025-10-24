import express from 'express';
import { getAllCollege, getCollegeById, AddCollege, updateCollege, deleteCollege } from '../controllers/collegecontroller.js';
import {authMiddleware} from '../middleware/authMiddleware.js'

const router=express.Router();

router.get('/',getAllCollege);
router.get('/:id',getCollegeById);
router.post("/", authMiddleware(['admin']), AddCollege); // only admin
router.put("/:id", authMiddleware(['admin']), updateCollege); // only admin
router.delete("/:id", authMiddleware(['admin']), deleteCollege); // only admin

export default router;