

// // backend/controllers/studentController.js
// import db from '../config/db.js';

// // Helper function to get student_id based on authenticated user's email
// const getStudentIdFromUser = async (user_email) => {
//     const [studentRows] = await db.query("SELECT student_id FROM Student WHERE email = ?", [user_email]);
//     return studentRows.length > 0 ? studentRows[0].student_id : null;
// };

// // --- 1. PROFILE SUBMISSION (POST /students/profile) ---
// export const submitStudentProfile = async (req, res) => {
//     // Assuming authMiddleware populates req.user.email from the JWT
//     const { email } = req.user; 
//     const { name, phone_number, category } = req.body;
    
//     if (!name || !phone_number || !email) {
//         return res.status(400).json({ message: "Name, Phone, and Email are required." });
//     }

//     try {
//         const existingStudentId = await getStudentIdFromUser(email);
        
//         if (existingStudentId) {
//             // Update existing student profile
//             await db.query(
//                 "UPDATE Student SET name = ?, phone_number = ?, category = ? WHERE student_id = ?",
//                 [name, phone_number, category, existingStudentId]
//             );
//             return res.status(200).json({ message: "Profile updated successfully." });
//         } else {
//             // Insert new student profile
//             const [result] = await db.query(
//                 "INSERT INTO Student (name, phone_number, email, category) VALUES (?, ?, ?, ?)",
//                 [name, phone_number, category, email]
//             );
//             return res.status(201).json({ message: "Profile saved successfully.", student_id: result.insertId });
//         }
//     } catch (err) {
//         console.error("Error submitting profile:", err);
//         res.status(500).json({ Error: "Database error during profile submission" });
//     }
// };

// // --- 2. MARKS SUBMISSION (POST /students/marks) ---
// export const submitStudentMarks = async (req, res) => {
//     const { email } = req.user;
//     const marksData = req.body; // Array of {exam_id, exam_rank, score, percentile}

//     try {
//         const student_id = await getStudentIdFromUser(email);
//         if (!student_id) return res.status(400).json({ message: "Student profile required before submitting marks." });

//         await db.query("START TRANSACTION");
//         // Clear old results to accept new data
//         await db.query("DELETE FROM Exam_Result WHERE student_id = ?", [student_id]);

//         for (const mark of marksData) {
//             // Note: Uses the correct Exam_Result schema columns
//             await db.query(
//                 "INSERT INTO Exam_Result (student_id, exam_id, exam_rank, score, percentile) VALUES (?, ?, ?, ?, ?)",
//                 [student_id, mark.exam_id, mark.exam_rank, mark.score, mark.percentile]
//             );
//         }

//         await db.query("COMMIT");
//         res.status(200).json({ message: "Marks submitted successfully." });
//     } catch (err) {
//         await db.query("ROLLBACK");
//         console.error("Error submitting marks:", err);
//         res.status(500).json({ Error: "Database error during mark submission" });
//     }
// };

// // --- 3. PREFERENCE SUBMISSION (POST /students/preferences) ---
// export const submitStudentPreferences = async (req, res) => {
//     const { email } = req.user;
//     const preferencesData = req.body; // Array of {college_id, course_id, priority_rank}

//     try {
//         const student_id = await getStudentIdFromUser(email);
//         if (!student_id) return res.status(400).json({ message: "Student profile required before choosing preferences." });

//         await db.query("START TRANSACTION");
//         // Clear old preferences
//         await db.query("DELETE FROM Preference WHERE student_id = ?", [student_id]);

//         for (const pref of preferencesData) {
//             // Note: Uses the correct Preference schema columns
//             await db.query(
//                 "INSERT INTO Preference (student_id, college_id, course_id, priority_rank) VALUES (?, ?, ?, ?)",
//                 [student_id, pref.college_id, pref.course_id, pref.priority_rank]
//             );
//         }

//         await db.query("COMMIT");
//         res.status(200).json({ message: "Preferences submitted successfully." });
//     } catch (err) {
//         await db.query("ROLLBACK");
//         console.error("Error submitting preferences:", err);
//         res.status(500).json({ Error: "Database error during preference submission" });
//     }
// };

// // --- 4. DATA RETRIEVAL (GET /students/data) ---
// export const getStudentData = async (req, res) => {
//     const { email } = req.user;

//     try {
//         const [studentRows] = await db.query("SELECT student_id, name, phone_number, category FROM Student WHERE email = ?", [email]);
//         const student = studentRows[0];
        
//         // If no student profile exists, prompt them to register
//         if (!student) {
//              return res.status(200).json({ profile: { email: email }, marks: [], preferences: [], allocation: null });
//         }

//         // Fetch Exam Results
//         const [marks] = await db.query("SELECT exam_id, exam_rank, score, percentile FROM Exam_Result WHERE student_id = ?", [student.student_id]);

//         // Fetch Preferences (Joined with Course/College details for readability)
//         const [preferences] = await db.query(`
//             SELECT 
//                 P.priority_rank, 
//                 P.course_id, 
//                 P.college_id,
//                 CR.course_name, 
//                 C.name AS college_name
//             FROM Preference P
//             JOIN Course CR ON P.course_id = CR.course_id
//             JOIN College C ON P.college_id = C.college_id
//             WHERE P.student_id = ?
//             ORDER BY P.priority_rank ASC
//         `, [student.student_id]);

//         // Fetch Final Allocation 
//         const [allocationResult] = await db.query(`
//             SELECT 
//                 SA.round_no, SA.status, 
//                 CR.course_name, C.name AS college_name
//             FROM Seat_Allocation SA
//             JOIN Course CR ON SA.course_id = CR.course_id
//             JOIN College C ON SA.college_id = C.college_id
//             WHERE SA.student_id = ? AND SA.status = 'Allocated'
//             ORDER BY SA.round_no DESC LIMIT 1
//         `, [student.student_id]);


//         res.status(200).json({
//             profile: student,
//             marks: marks,
//             preferences: preferences,
//             allocation: allocationResult[0] || null,
//         });

//     } catch (err) {
//         console.error("Error fetching student data:", err);
//         res.status(500).json({ Error: "Server error retrieving dashboard data." });
//     }
// };





import db from '../config/db.js';

const getStudentIdFromUser = async (user_email) => {
    const [studentRows] = await db.query("SELECT student_id FROM Student WHERE email = ?", [user_email]);
    return studentRows.length > 0 ? studentRows[0].student_id : null;
};

// --- 1. PROFILE SUBMISSION (POST /students/profile) ---
export const submitStudentProfile = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ message: "Authentication error: User email not found in token." });
    }
    
    const { email } = req.user; 
    const { name, phone_number, category } = req.body;
    
    // Check fields submitted by the form
    if (!name || !phone_number || !category) {
        return res.status(400).json({ message: "Name, Phone Number, and Category are required." });
    }

    try {
        const existingStudentId = await getStudentIdFromUser(email);
        
        if (existingStudentId) {
            // Update existing student profile
            await db.query(
                "UPDATE Student SET name = ?, phone_number = ?, category = ? WHERE student_id = ?",
                // 🚨 FIX: Correct parameter order for UPDATE: [name, phone_number, category, student_id]
                [name, phone_number, category, existingStudentId] 
            );
            return res.status(200).json({ message: "Profile updated successfully." });
        } else {
            // Insert new student profile
            const [result] = await db.query(
                "INSERT INTO Student (name, phone_number, email, category) VALUES (?, ?, ?, ?)",
                // 🚨 FIX APPLIED: Correct parameter order: [name, phone_number, email, category]
                [name, phone_number, email, category] 
            );
            return res.status(201).json({ message: "Profile saved successfully.", student_id: result.insertId });
        }
    } catch (err) {
        console.error("Error submitting profile:", err);
        res.status(500).json({ Error: "Database error during profile submission" });
    }
};

// --- 2. MARKS SUBMISSION (POST /students/marks) ---
export const submitStudentMarks = async (req, res) => {
    if (!req.user || !req.user.email) return res.status(401).json({ message: "Authentication required." });
    const { email } = req.user;
    const marksData = req.body; 

    try {
        const student_id = await getStudentIdFromUser(email);
        if (!student_id) return res.status(400).json({ message: "Profile creation required before submitting marks." });

        await db.query("START TRANSACTION");
        await db.query("DELETE FROM Exam_Result WHERE student_id = ?", [student_id]);

        for (const mark of marksData) {
            await db.query(
                "INSERT INTO Exam_Result (student_id, exam_id, exam_rank, score, percentile) VALUES (?, ?, ?, ?, ?)",
                [student_id, mark.exam_id, mark.exam_rank, mark.score, mark.percentile]
            );
        }

        await db.query("COMMIT");
        res.status(200).json({ message: "Marks submitted successfully." });
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("Error submitting marks:", err);
        res.status(500).json({ Error: "Database error during mark submission" });
    }
};

// --- 3. PREFERENCE SUBMISSION (POST /students/preferences) ---
export const submitStudentPreferences = async (req, res) => {
    if (!req.user || !req.user.email) return res.status(401).json({ message: "Authentication required." });
    const { email } = req.user;
    const preferencesData = req.body; 

    try {
        const student_id = await getStudentIdFromUser(email);
        if (!student_id) return res.status(400).json({ message: "Profile creation required before choosing preferences." });

        await db.query("START TRANSACTION");
        await db.query("DELETE FROM Preference WHERE student_id = ?", [student_id]);

        for (const pref of preferencesData) {
            await db.query(
                "INSERT INTO Preference (student_id, college_id, course_id, priority_rank) VALUES (?, ?, ?, ?)",
                [student_id, pref.college_id, pref.course_id, pref.priority_rank]
            );
        }

        await db.query("COMMIT");
        res.status(200).json({ message: "Preferences submitted successfully." });
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("Error submitting preferences:", err);
        res.status(500).json({ Error: "Database error during preference submission" });
    }
};

// --- 4. DATA RETRIEVAL (GET /students/data) ---
export const getStudentData = async (req, res) => {
    if (!req.user || !req.user.email) return res.status(401).json({ message: "Authentication required." });
    const { email } = req.user;

    try {
        const [studentRows] = await db.query("SELECT student_id, name, phone_number, category FROM Student WHERE email = ?", [email]);
        const student = studentRows[0];
        
        if (!student) {
             return res.status(200).json({ 
                 profile: { email: email, name: req.user.username }, 
                 marks: [], preferences: [], allocation: null 
             });
        }
        
        const [marks] = await db.query("SELECT exam_id, exam_rank, score, percentile FROM Exam_Result WHERE student_id = ?", [student.student_id]);
        const [preferences] = await db.query(`
            SELECT P.priority_rank, P.course_id, P.college_id, CR.course_name, C.name AS college_name
            FROM Preference P
            JOIN Course CR ON P.course_id = CR.course_id
            JOIN College C ON P.college_id = C.college_id
            WHERE P.student_id = ?
            ORDER BY P.priority_rank ASC
        `, [student.student_id]);
        const [allocationResult] = await db.query(`
            SELECT SA.round_no, SA.status, CR.course_name, C.name AS college_name
            FROM Seat_Allocation SA JOIN Course CR ON SA.course_id = CR.course_id
            JOIN College C ON SA.college_id = C.college_id
            WHERE SA.student_id = ? AND SA.status = 'Allocated' ORDER BY SA.round_no DESC LIMIT 1
        `, [student.student_id]);


        res.status(200).json({
            profile: student,
            marks: marks,
            preferences: preferences,
            allocation: allocationResult[0] || null,
        });

    } catch (err) {
        console.error("Error fetching student data:", err);
        res.status(500).json({ Error: "Server error retrieving dashboard data." });
    }
};