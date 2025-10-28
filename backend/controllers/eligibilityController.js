// backend/controllers/eligibilityController.js (NEW FILE)
import db from '../config/db.js';

export const getAllCriteria = async (req, res) => {
    try {
        // Fetches defined criteria to populate admin dropdowns
        const [rows] = await db.query("SELECT eligibility_id, name FROM Eligibility_Criteria");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching criteria:", err);
        res.status(500).json({ Error: "Database error fetching criteria" });
    }
};

export const linkCourseEligibility = async (req, res) => {
    const { course_id, eligibility_id } = req.body;
    try {
        // Deletes old links and inserts the new one (Many-to-Many automation)
        await db.query("DELETE FROM Course_Eligibility WHERE course_id = ?", [course_id]);
        await db.query("INSERT INTO Course_Eligibility (course_id, eligibility_id) VALUES (?, ?)",
            [course_id, eligibility_id]
        );
        res.status(200).json({ message: "Eligibility linked successfully." });
    } catch (err) {
        console.error("Error linking eligibility:", err);
        res.status(500).json({ Error: "Database error during eligibility linking" });
    }
};

export const setCourseSeats = async (req, res) => {
    const { course_id, total_seats } = req.body;
    try {
        // Handles INSERT or UPDATE for capacity using ON DUPLICATE KEY UPDATE
        await db.query(
            "INSERT INTO Seats (course_id, total_seats) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_seats = VALUES(total_seats)",
            [course_id, total_seats]
        );
        res.status(200).json({ message: "Seat capacity set successfully." });
    } catch (err) {
        console.error("Error setting seats:", err);
        res.status(500).json({ Error: "Database error setting capacity." });
    }
};