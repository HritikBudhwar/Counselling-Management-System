// src/authentication/Dashboard.jsx (Student Dashboard)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import './Dashboard.css'; // Assume you have CSS for this page

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [exams, setExams] = useState([]); // List of available exams
    const [courses, setCourses] = useState([]); // List of available courses
    const [marks, setMarks] = useState({}); // Stores user input marks {exam_id: score}
    const [preferences, setPreferences] = useState([]); // Stores user preference list [course_id, rank]
    const token = localStorage.getItem("token");

    // Fetch user details, exams, and courses
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            if (storedUser.role === 'admin') {
                navigate('/admin-dashboard'); // Ensure admin is redirected away
            } else {
                fetchInitialData();
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchInitialData = async () => {
        try {
            // Assume an /api/exams route exists
            const examsRes = await axios.get("http://localhost:5000/api/exams");
            setExams(examsRes.data);
            
            // Assume /api/courses route returns list of all courses
            const coursesRes = await axios.get("http://localhost:5000/api/courses");
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    // --- MARK SUBMISSION ---
    const handleMarkChange = (examId, score) => {
        setMarks(prev => ({ ...prev, [examId]: score }));
    };

    const submitMarks = async () => {
        const payload = Object.keys(marks).map(exam_id => ({
            exam_id: parseInt(exam_id),
            score: parseFloat(marks[exam_id])
        }));

        try {
            // Assume new backend route for submission
            await axios.post("http://localhost:5000/api/student/marks", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Marks submitted successfully!");
        } catch (error) {
            alert("Failed to submit marks.");
            console.error("Mark submission error:", error);
        }
    };

    // --- PREFERENCE SUBMISSION ---
    const handlePreferenceChange = (courseId, rank) => {
        // Simple array logic: Find if exists, update rank, or add new
        setPreferences(prev => {
            const index = prev.findIndex(p => p.course_id === courseId);
            if (index > -1) {
                prev[index].preference_rank = parseInt(rank);
                return [...prev];
            } else {
                return [...prev, { course_id: courseId, preference_rank: parseInt(rank) }];
            }
        }).filter(p => p.preference_rank > 0);
    };

    const submitPreferences = async () => {
        // Sort preferences by rank before sending
        const sortedPreferences = preferences
            .filter(p => p.preference_rank > 0)
            .sort((a, b) => a.preference_rank - b.preference_rank);

        try {
            // Assume new backend route for preference submission
            await axios.post("http://localhost:5000/api/student/preferences", sortedPreferences, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Preferences submitted successfully!");
        } catch (error) {
            alert("Failed to submit preferences.");
            console.error("Preference submission error:", error);
        }
    };
    
    // --- ALLOCATION RESULT VIEW (Placeholder) ---
    const [allocationResult, setAllocationResult] = useState(null);
    const viewResult = async () => {
        try {
            // Assume a route for viewing final allocation
            const res = await axios.get("http://localhost:5000/api/student/allocation", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllocationResult(res.data);
        } catch (error) {
            setAllocationResult({ message: "No final allocation found yet." });
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="student-dashboard">
            <h1>Welcome, {user.username} (Student)</h1>

            {/* 1. EXAM MARKS INPUT */}
            <section>
                <h2>1. Enter Exam Marks</h2>
                {exams.map(exam => (
                    <div key={exam.exam_id}>
                        <label>{exam.name} Score:</label>
                        <input
                            type="number"
                            value={marks[exam.exam_id] || ''}
                            onChange={(e) => handleMarkChange(exam.exam_id, e.target.value)}
                        />
                    </div>
                ))}
                <button onClick={submitMarks}>Submit Marks</button>
            </section>

            {/* 2. PREFERENCE INPUT */}
            <section>
                <h2>2. Select College Preferences (Max 3)</h2>
                {courses.slice(0, 10).map(course => ( // Limiting for display example
                    <div key={course.course_id}>
                        <label>{course.course_name} (in College {course.college_id})</label>
                        <input
                            type="number"
                            min="0"
                            max="3"
                            placeholder="Rank (1-3)"
                            onChange={(e) => handlePreferenceChange(course.course_id, e.target.value)}
                        />
                    </div>
                ))}
                <button onClick={submitPreferences}>Submit Preferences</button>
            </section>
            
            {/* 3. ALLOCATION RESULT */}
            <section>
                <h2>3. View Allocation Result</h2>
                <button onClick={viewResult}>Check Result</button>
                {allocationResult && (
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        {allocationResult.message || `Allocated: ${allocationResult.course_name} in ${allocationResult.college_name}`}
                    </p>
                )}
            </section>
        </div>
    );
};

export default StudentDashboard;