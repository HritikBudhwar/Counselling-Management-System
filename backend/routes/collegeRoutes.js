import express from 'express';
import { getAllCollege, getCollegeById, AddCollege, updateCollege, deleteCollege } from '../controllers/collegecontroller.js';

const router=express.Router();

router.get('/',getAllCollege);
router.get('/:id',getCollegeById);
router.post('/',AddCollege);
router.put('/:id',updateCollege);
router.delete('/:id',deleteCollege);

export default router;