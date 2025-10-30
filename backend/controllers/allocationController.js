import db from '../config/db.js';
const ALLOCATION_READY_STATUS = ['Open', 'Registration Open']; 
const PRIMARY_EXAM_ID = 1; 
const isStudentEligible = async (student_id, course_id) => {
    // Current simplified eligibility check: Do they have a score for the primary exam?
    const [score] = await db.query(
        "SELECT score FROM Exam_Result WHERE student_id = ? AND exam_id = ?", 
        [student_id, PRIMARY_EXAM_ID]
    );
    return score.length > 0; 
};
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

// ... (getSeatMatrix and getAllAllocations functions remain the same) ...

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

// POST /api/admin/allocate - Runs the central allocation algorithm
export const runSeatAllocation = async (req, res) => {
    const { round_no } = req.body;

    if (!round_no) return res.status(400).json({ message: "Round number is required." });

    // 1. Check Counseling Round Status and Fetch Counseling ID
    const [counselingRoundResult] = await db.query(
        "SELECT counseling_id, status FROM Counseling WHERE round_no = ?", [round_no]
    );
    
    // 🚨 FIX 1: Safely access the first result or set to null
    const counselingRound = counselingRoundResult[0]; 

    if (!counselingRound) {
        return res.status(403).json({ message: `Allocation for Round ${round_no} failed. Counseling round not found.` });
    }
    
    if (!ALLOCATION_READY_STATUS.includes(counselingRound.status)) {
        return res.status(403).json({ 
            message: `Allocation for Round ${round_no} failed. Status must be 'Open' or 'Registration Open' (Current Status: ${counselingRound.status}).` 
        });
    }
    
    const { counseling_id } = counselingRound; // 🚨 FIX 2: counseling_id is now safely available

    try {
        // Clear previous allocations ONLY for this specific round
        await db.query("DELETE FROM Seat_Allocation WHERE round_no = ?", [round_no]);

        // --- STEP 1: Get Students in Merit Order, EXCLUDING PREVIOUS ALLOCATIONS ---
        const [studentsInMerit] = await db.query(`
            SELECT 
                S.student_id, 
                ER.score
            FROM Student S
            JOIN Exam_Result ER ON S.student_id = ER.student_id
            
            -- 🚨 FIX 3: LEFT JOIN to find students NOT in prior allocations
            LEFT JOIN Seat_Allocation SA_PREV ON S.student_id = SA_PREV.student_id
                AND SA_PREV.status = 'Allocated' 
                AND SA_PREV.round_no < ?  
                
            WHERE ER.exam_id = ? 
                AND SA_PREV.allocation_id IS NULL -- Only select students who do NOT have an existing allocation
                
            ORDER BY ER.score DESC, S.student_id ASC 
        `, [round_no, PRIMARY_EXAM_ID]); 
        
        // --- STEP 2: Get Seat Matrix (Capacity) ---
        const [capacityRows] = await db.query("SELECT course_id, total_seats FROM Seats");
        let availableSeats = {};
        capacityRows.forEach(s => availableSeats[s.course_id] = s.total_seats);
        
        // --- STEP 3: Run Allocation Logic ---
        let allocationsMade = 0;
        
        for (const student of studentsInMerit) {
            const student_id = student.student_id;
            
            const [preferences] = await db.query(
                "SELECT college_id, course_id, priority_rank FROM Preference WHERE student_id = ? ORDER BY priority_rank ASC",
                [student_id]
            );

            for (const pref of preferences) {
                const course_id = pref.course_id;

                const isEligible = await isStudentEligible(student_id, course_id);
                const hasCapacity = availableSeats[course_id] > 0;

                if (isEligible && hasCapacity) {
                    await db.query(
                        "INSERT INTO Seat_Allocation (student_id, college_id, course_id, round_no, counseling_id, status) VALUES (?, ?, ?, ?, ?, 'Allocated')",
                        [student_id, pref.college_id, course_id, round_no, counseling_id, 'Allocated'] // Use student_id here
                    );
                    availableSeats[course_id]--; 
                    allocationsMade++;
                    break;
                }
            }
        }
        
        // --- STEP 4: Update Counseling Status ---
        await db.query("UPDATE Counseling SET status = 'Results Declared' WHERE counseling_id = ?", [counseling_id]);

        res.status(200).json({ 
            message: `Allocation for Round ${round_no} completed. ${allocationsMade} seats allocated.`,
            allocations: allocationsMade
        });
    } catch (err) {
        console.error("🔥 ALLOCATION SERVER ERROR:", err);
        res.status(500).json({ Error: "Server error during seat allocation process." });
    }
};