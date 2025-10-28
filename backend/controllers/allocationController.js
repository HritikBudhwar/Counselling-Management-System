// // backend/controllers/allocationController.js
// import db from '../config/db.js';

// // --- Allocation Logic Assumptions ---
// // 1. Merit Order: Based on the highest 'score' in the 'Exam_Result' table.
// // 2. Seat Matrix: Assumes you have a 'Seats' or similar table defining college/course capacity.
// // 3. Counseling Round: Requires the current round_no from the Counseling table.

// // GET total available seats and allocated/vacant counts per course
// export const getSeatMatrix = async (req, res) => {
//     try {
//         // NOTE: This query requires a 'College_Course_Seats' or similar table to be effective.
//         // Assuming a simpler table named 'Seats' that links college_id, course_id, and total_seats.
//         const [matrix] = await db.query(`
//             SELECT
//                 C.name AS college_name,
//                 CR.course_name,
//                 T.total_seats,
//                 COUNT(SA.allocation_id) AS allocated_seats,
//                 (T.total_seats - COUNT(SA.allocation_id)) AS vacant_seats
//             FROM Course CR
//             JOIN College C ON CR.college_id = C.college_id
//             LEFT JOIN Seats T ON CR.course_id = T.course_id -- Assuming 'Seats' table defines capacity
//             LEFT JOIN Seat_Allocation SA ON CR.course_id = SA.course_id AND SA.status = 'Allocated'
//             GROUP BY C.name, CR.course_name, T.total_seats
//             ORDER BY C.name, CR.course_name
//         `);
//         res.json(matrix);
//     } catch (err) {
//         console.error("Error fetching seat matrix:", err);
//         res.status(500).json({ Error: "Database error fetching seat matrix" });
//     }
// };

// // POST /api/admin/allocate - Runs the central allocation algorithm
// export const runSeatAllocation = async (req, res) => {
//     const { round_no } = req.body; // Admin passes the round number

//     if (!round_no) {
//         return res.status(400).json({ message: "Round number is required to run allocation." });
//     }

//     try {
//         // 1. Fetch Students in Merit Order
//         const [students] = await db.query(`
//             SELECT 
//                 S.student_id, 
//                 ER.score 
//             FROM Student S
//             JOIN Exam_Result ER ON S.student_id = ER.student_id
//             -- You might need a way to filter which exam (e.g., WHERE ER.exam_id = 1)
//             ORDER BY ER.score DESC, S.student_id ASC 
//         `);

//         // 2. Clear previous allocations for this round
//         await db.query("DELETE FROM Seat_Allocation WHERE round_no = ?", [round_no]);

//         // 3. Fetch Seat Matrix (Total Capacity - Needs separate logic/table)
//         const [seatCapacity] = await db.query(`
//             SELECT 
//                 course_id, total_seats 
//             FROM Seats 
//             -- Fetch the total available seats per course
//         `);
//         let availableSeats = {};
//         seatCapacity.forEach(s => availableSeats[s.course_id] = s.total_seats);

//         // 4. Run Allocation Algorithm (Simplified D'Hondt/Merit-Based)
//         let allocationsMade = 0;
        
//         for (const student of students) {
//             // Fetch student's ordered preferences
//             const [preferences] = await db.query(
//                 "SELECT course_id FROM Preference WHERE student_id = ? ORDER BY priority_rank ASC",
//                 [student.student_id]
//             );

//             for (const pref of preferences) {
//                 const course_id = pref.course_id;

//                 // Check if seats are available for this preferred course
//                 if (availableSeats[course_id] > 0) {
//                     // Allocate the seat
//                     await db.query(
//                         "INSERT INTO Seat_Allocation (student_id, course_id, round_no, status) VALUES (?, ?, ?, 'Allocated')",
//                         [student.student_id, course_id, round_no]
//                     );
//                     availableSeats[course_id]--; // Decrement available seats
//                     allocationsMade++;
//                     break; // Move to the next student
//                 }
//             }
//         }

//         res.status(200).json({ 
//             message: `Allocation for Round ${round_no} completed. ${allocationsMade} seats allocated.`,
//             allocations: allocationsMade
//         });
//     } catch (err) {
//         console.error("🔥 ALLOCATION SERVER ERROR:", err);
//         res.status(500).json({ Error: "Server error during seat allocation process." });
//     }
// };

// // GET /api/admin/allocations - Get final detailed allocation list
// export const getAllAllocations = async (req, res) => {
//     try {
//         const [allocations] = await db.query(`
//             SELECT
//                 SA.round_no,
//                 S.name AS student_name,
//                 C.name AS college_name,
//                 CR.course_name,
//                 SA.status
//             FROM Seat_Allocation SA
//             JOIN Student S ON SA.student_id = S.student_id
//             JOIN Course CR ON SA.course_id = CR.course_id
//             JOIN College C ON CR.college_id = C.college_id
//             ORDER BY SA.round_no DESC, S.name ASC
//         `);
//         res.json(allocations);
//     } catch (err) {
//         console.error("Error fetching allocations:", err);
//         res.status(500).json({ Error: "Database error fetching allocations" });
//     }
// };











// backend/controllers/allocationController.js

import db from '../config/db.js';

// GET total available seats and allocated/vacant counts per course
export const getSeatMatrix = async (req, res) => {
    try {
        // FIX: Assumes 'Seats' table now exists
        const [matrix] = await db.query(`
            SELECT
                C.name AS college_name,
                CR.course_name,
                T.total_seats,
                COUNT(SA.allocation_id) AS allocated_seats,
                (T.total_seats - COUNT(SA.allocation_id)) AS vacant_seats
            FROM Course CR
            JOIN College C ON CR.college_id = C.college_id
            LEFT JOIN Seats T ON CR.course_id = T.course_id 
            LEFT JOIN Seat_Allocation SA ON CR.course_id = SA.course_id AND SA.status = 'Allocated'
            GROUP BY C.name, CR.course_name, T.total_seats
            ORDER BY C.name, CR.course_name
        `);
        res.json(matrix);
    } catch (err) {
        console.error("Error fetching seat matrix:", err);
        res.status(500).json({ Error: "Database error fetching seat matrix" });
    }
};

// GET /api/admin/allocations - Get final detailed allocation list
export const getAllAllocations = async (req, res) => {
    try {
        // FIX: Assumes SA.round_no column now exists
        const [allocations] = await db.query(`
            SELECT
                SA.round_no,
                S.name AS student_name,
                C.name AS college_name,
                CR.course_name,
                SA.status
            FROM Seat_Allocation SA
            JOIN Student S ON SA.student_id = S.student_id
            JOIN Course CR ON SA.course_id = CR.course_id
            JOIN College C ON CR.college_id = C.college_id
            ORDER BY SA.round_no DESC, S.name ASC
        `);
        res.json(allocations);
    } catch (err) {
        console.error("Error fetching allocations:", err);
        res.status(500).json({ Error: "Database error fetching allocations" });
    }
};

// POST /api/admin/allocate - Runs the central allocation algorithm
export const runSeatAllocation = async (req, res) => {
    const { round_no } = req.body;

    if (!round_no) return res.status(400).json({ message: "Round number is required." });

    // 1. Check Counseling Round Status (CRITICAL STEP)
    const [counselingRoundResult] = await db.query(
        "SELECT counseling_id, status FROM Counseling WHERE round_no = ?", [round_no]
    );
    const counselingRound = counselingRoundResult[0];

    // 🚨 FIX: Allow status 'Open' or 'Registration Open' for flexibility
    const ALLOCATION_READY_STATUS = ['Open', 'Registration Open']; 

    if (!counselingRound || !ALLOCATION_READY_STATUS.includes(counselingRound.status)) {
        return res.status(403).json({ 
            message: `Allocation for Round ${round_no} failed. Status must be 'Open' or 'Registration Open' (Current Status: ${counselingRound ? counselingRound.status : 'Not Found'}).` 
        });
    }

    try {
        // Clear previous allocations for this specific round only
        await db.query("DELETE FROM Seat_Allocation WHERE round_no = ?", [round_no]);

        // --- STEP 1: Get Students in Merit Order ---
        const [studentsInMerit] = await db.query(`
            SELECT 
                S.student_id, 
                ER.score
            FROM Student S
            JOIN Exam_Result ER ON S.student_id = ER.student_id
            WHERE ER.exam_id = 1 -- Assumes a primary ranking exam ID is 1
            ORDER BY ER.score DESC, S.student_id ASC 
        `);

        // --- STEP 2: Get Seat Matrix (Capacity) ---
        const [capacityRows] = await db.query("SELECT course_id, total_seats FROM Seats");
        let availableSeats = {};
        capacityRows.forEach(s => availableSeats[s.course_id] = s.total_seats);
        
        // --- STEP 3: Run Allocation Logic ---
        let allocationsMade = 0;
        
        for (const student of studentsInMerit) {
            // Get student's ordered preferences (1, 2, 3...)
            const [preferences] = await db.query(
                "SELECT college_id, course_id, priority_rank FROM Preference WHERE student_id = ? ORDER BY priority_rank ASC",
                [student.student_id]
            );

            for (const pref of preferences) {
                const course_id = pref.course_id;

                if (availableSeats[course_id] > 0) {
                    // Allocate the seat (round_no is used here)
                    await db.query(
                        "INSERT INTO Seat_Allocation (student_id, college_id, course_id, round_no, status) VALUES (?, ?, ?, ?, 'Allocated')",
                        [student.student_id, pref.college_id, course_id, round_no]
                    );
                    availableSeats[course_id]--; 
                    allocationsMade++;
                    break; 
                }
            }
        }
        
        // --- STEP 4: Update Counseling Status ---
        await db.query("UPDATE Counseling SET status = 'Results Declared' WHERE counseling_id = ?", 
            [counselingRound.counseling_id]);

        res.status(200).json({ 
            message: `Allocation for Round ${round_no} completed. ${allocationsMade} seats allocated.`,
            allocations: allocationsMade
        });
    } catch (err) {
        console.error("🔥 ALLOCATION SERVER ERROR:", err);
        res.status(500).json({ Error: "Server error during seat allocation process." });
    }
};