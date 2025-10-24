// routes/courseRoutes.js
import express from 'express';
import { getAllCourses, addCourse, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

// GET /api/courses
router.get('/', getAllCourses);

// POST /api/courses/add (Matches frontend AdminDashboard.jsx)
router.post('/add', addCourse); 

// DELETE /api/courses/:id
router.delete('/:id', deleteCourse);

export default router;