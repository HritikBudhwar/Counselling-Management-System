// // src/admin/StudentPreferenceForm.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './StudentPreferenceForm.css'

// const StudentPreferenceForm = () => {
//     const navigate = useNavigate();
//     const [collegeCourses, setCollegeCourses] = useState([]); // Courses grouped by college
//     const [preferences, setPreferences] = useState({}); // Stores {course_id: rank}
//     const token = localStorage.getItem('token');
//     const MAX_PREFERENCES = 4; // Your specified limit

//     useEffect(() => {
//         fetchCollegeCourseData();
//     }, []);

//     // Fetches all colleges and their courses to populate the dropdowns/list
//     const fetchCollegeCourseData = async () => {
//         try {
//             // Assuming an endpoint that fetches all courses with their college info (JOIN)
//             const res = await axios.get("http://localhost:5000/api/courses/all-details"); 
//             setCollegeCourses(res.data);
//         } catch (err) {
//             console.error("Error fetching course data:", err);
//             // Fallback: If the endpoint doesn't exist, this will error.
//         }
//     };

//     const handleRankChange = (courseId, collegeId, rank) => {
//         const rankValue = parseInt(rank);
        
//         if (rankValue > MAX_PREFERENCES || rankValue < 0) return;

//         setPreferences(prev => {
//             let newPrefs = { ...prev };

//             // 1. If rank is 0 or empty, delete the preference
//             if (!rankValue) {
//                 delete newPrefs[courseId];
//                 return newPrefs;
//             }

//             // 2. If this rank is already used, clear the old one
//             const existingCourseId = Object.keys(newPrefs).find(key => newPrefs[key].rank === rankValue);
//             if (existingCourseId && existingCourseId !== String(courseId)) {
//                 delete newPrefs[existingCourseId];
//             }

//             // 3. Set the new preference
//             newPrefs[courseId] = { 
//                 college_id: collegeId, 
//                 course_id: courseId, 
//                 priority_rank: rankValue 
//             };
//             return newPrefs;
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = Object.values(preferences)
//             .sort((a, b) => a.priority_rank - b.priority_rank); // Sort by rank (1, 2, 3...)

//         if (payload.length === 0) {
//             alert("Please select at least one preference.");
//             return;
//         }

//         try {
//             await axios.post("http://localhost:5000/students/preferences", payload, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert("Preferences noted! We will notify you when allocation starts.");
//             navigate('/dashboard/profile'); // Redirect to profile/confirmation page (Step 4)
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to submit preferences.");
//         }
//     };

//     return (
//         <div className="preferences-form">
//             <h2>Step 3: Choose Your Preferences (Max {MAX_PREFERENCES})</h2>
//             <form onSubmit={handleSubmit}>
//                 <ul>
//                     {/* Simplified listing; ideally, you group by college */}
//                     {collegeCourses.map(cc => (
//                         <li key={cc.course_id}>
//                             <strong>{cc.course_name}</strong> at {cc.college_name}
//                             <input
//                                 type="number"
//                                 min="0"
//                                 max={MAX_PREFERENCES}
//                                 placeholder="Rank"
//                                 value={preferences[cc.course_id]?.priority_rank || ''}
//                                 onChange={e => handleRankChange(cc.course_id, cc.college_id, e.target.value)}
//                             />
//                         </li>
//                     ))}
//                 </ul>
//                 <button type="submit">Submit Preferences</button>
//             </form>
//         </div>
//     );
// };
// export default StudentPreferenceForm;




// src/Student/StudentPreferenceForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentPreferenceForm.css'

const StudentPreferenceForm = () => {
    const navigate = useNavigate();
    const [collegeCourses, setCollegeCourses] = useState([]); 
    const [preferences, setPreferences] = useState({}); // Stores {course_id: {college_id, rank}}
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const MAX_PREFERENCES = 4;

    useEffect(() => {
        fetchCollegeCourseData();
    }, []);

    // Fetches all courses with their college info and existing preferences
    const fetchCollegeCourseData = async () => {
        try {
            // 🚨 1. Fetch ALL COURSES with college details
            const coursesRes = await axios.get("http://localhost:5000/api/courses/details"); 
            setCollegeCourses(coursesRes.data);

            // 🚨 2. Fetch EXISTING PREFERENCES from student data endpoint
            const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
            
            const initialPreferences = {};
            // Convert fetched preferences array into the required object for state
            dataRes.data.preferences.forEach(p => {
                 initialPreferences[p.course_id] = { 
                    course_id: p.course_id, 
                    // Note: Ensure your student data endpoint returns college_id for preferences!
                    college_id: p.college_id, 
                    priority_rank: p.priority_rank 
                };
            });
            setPreferences(initialPreferences);
            
        } catch (err) {
            console.error("Error fetching course or preference data:", err);
            alert("Failed to load courses or existing preferences. Check backend routes.");
        }
    };

    const handleRankChange = (courseId, collegeId, rank) => {
        const rankValue = parseInt(rank);
        
        if (rankValue > MAX_PREFERENCES || rankValue < 0) return;

        setPreferences(prev => {
            let newPrefs = { ...prev };

            if (!rankValue) { // Delete if rank is 0 or empty
                delete newPrefs[courseId];
                return newPrefs;
            }

            // If this rank is already used by another course, clear the old one
            const existingCourseId = Object.keys(newPrefs).find(key => newPrefs[key].priority_rank === rankValue);
            if (existingCourseId && existingCourseId !== String(courseId)) {
                delete newPrefs[existingCourseId];
            }

            // Set the new preference
            newPrefs[courseId] = { 
                college_id: collegeId, 
                course_id: courseId, 
                priority_rank: rankValue 
            };
            return newPrefs;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = Object.values(preferences)
            .sort((a, b) => a.priority_rank - b.priority_rank); 

        if (payload.length === 0) {
            alert("Please select at least one preference.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/students/preferences", payload, { headers });
            alert("Preferences noted! You can view your status on the Profile page.");
            navigate('/dashboard/profile'); // Redirect to final step (Step 4)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit preferences.");
        }
    };

    return (
        <div className="preferences-form student-dashboard-form">
            <h2>Step 3: Choose Your Preferences (Max {MAX_PREFERENCES})</h2>
            <form onSubmit={handleSubmit}>
                <ul>
                    {collegeCourses.map(cc => (
                        <li key={cc.course_id}>
                            <strong>{cc.course_name}</strong> at {cc.college_name}
                            <input
                                type="number"
                                min="0"
                                max={MAX_PREFERENCES}
                                placeholder="Rank"
                                value={preferences[cc.course_id]?.priority_rank || ''}
                                onChange={e => handleRankChange(cc.course_id, cc.college_id, e.target.value)}
                            />
                        </li>
                    ))}
                </ul>
                <button type="submit">Submit Preferences</button>
            </form>
        </div>
    );
};
export default StudentPreferenceForm;