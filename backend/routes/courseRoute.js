// // routes/courseRoutes.js
// import express from 'express';
// import { getAllCourses, addCourse, deleteCourse } from '../controllers/courseController.js';

// const router = express.Router();

// // GET /api/courses
// router.get('/', getAllCourses);

// // POST /api/courses/add (Matches frontend AdminDashboard.jsx)
// router.post('/add', addCourse); 

// // DELETE /api/courses/:id
// router.delete('/:id', deleteCourse);

// export default router;



// backend/routes/courseRoutes.js (FINAL)

// import express from 'express';
// // 🚨 FIX: Import the new controller function
// import { 
//   getAllCourses, 
//   addCourse, 
//   deleteCourse,
//   getAllCoursesWithDetails // MUST be added
// } from '../controllers/courseController.js';

// const router = express.Router();

// // GET /api/courses
// router.get('/', getAllCourses);

// // 🚨 FIX: Add the required route for the StudentPreferenceForm
// // GET /api/courses/details
// router.get('/details', getAllCoursesWithDetails); 

// // POST /api/courses/add
// router.post('/add', addCourse); 

// // DELETE /api/courses/:id
// router.delete('/:id', deleteCourse);

// export default router;

// backend/routes/courseRoutes.js (VERIFIED FIX)

import express from 'express';
// 🚨 Ensure you import the detailed fetch function
import { 
  getAllCourses, 
  addCourse, 
  deleteCourse,
  getAllCoursesWithDetails // Assuming this is imported from your controller
} from '../controllers/courseController.js'; 

const router = express.Router();

// GET /api/courses
router.get('/', getAllCourses);

// 🚨 CRITICAL FIX: Maps the frontend call /api/courses/details
router.get('/details', getAllCoursesWithDetails); 

// POST /api/courses/add
router.post('/add', addCourse); 

// DELETE /api/courses/:id
router.delete('/:id', deleteCourse);

export default router;