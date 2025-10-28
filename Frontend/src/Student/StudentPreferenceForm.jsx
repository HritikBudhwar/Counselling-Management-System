// // src/Student/StudentPreferenceForm.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './StudentPreferenceForm.css'

// const StudentPreferenceForm = () => {
//     const navigate = useNavigate();
//     const [collegeCourses, setCollegeCourses] = useState([]); 
//     const [preferences, setPreferences] = useState({}); // Stores {course_id: {college_id, rank}}
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };
//     const MAX_PREFERENCES = 4;

//     useEffect(() => {
//         fetchCollegeCourseData();
//     }, []);

//     // Fetches all courses with their college info and existing preferences
//     const fetchCollegeCourseData = async () => {
//         try {
//             // 🚨 1. Fetch ALL COURSES with college details
//             const coursesRes = await axios.get("http://localhost:5000/api/courses/details"); 
//             setCollegeCourses(coursesRes.data);

//             // 🚨 2. Fetch EXISTING PREFERENCES from student data endpoint
//             const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
            
//             const initialPreferences = {};
//             // Convert fetched preferences array into the required object for state
//             dataRes.data.preferences.forEach(p => {
//                  initialPreferences[p.course_id] = { 
//                     course_id: p.course_id, 
//                     // Note: Ensure your student data endpoint returns college_id for preferences!
//                     college_id: p.college_id, 
//                     priority_rank: p.priority_rank 
//                 };
//             });
//             setPreferences(initialPreferences);
            
//         } catch (err) {
//             console.error("Error fetching course or preference data:", err);
//             alert("Failed to load courses or existing preferences. Check backend routes.");
//         }
//     };

//     const handleRankChange = (courseId, collegeId, rank) => {
//         const rankValue = parseInt(rank);
        
//         if (rankValue > MAX_PREFERENCES || rankValue < 0) return;

//         setPreferences(prev => {
//             let newPrefs = { ...prev };

//             if (!rankValue) { // Delete if rank is 0 or empty
//                 delete newPrefs[courseId];
//                 return newPrefs;
//             }

//             // If this rank is already used by another course, clear the old one
//             const existingCourseId = Object.keys(newPrefs).find(key => newPrefs[key].priority_rank === rankValue);
//             if (existingCourseId && existingCourseId !== String(courseId)) {
//                 delete newPrefs[existingCourseId];
//             }

//             // Set the new preference
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
//             .sort((a, b) => a.priority_rank - b.priority_rank); 

//         if (payload.length === 0) {
//             alert("Please select at least one preference.");
//             return;
//         }

//         try {
//             await axios.post("http://localhost:5000/students/preferences", payload, { headers });
//             alert("Preferences noted! You can view your status on the Profile page.");
//             navigate('/dashboard/profile'); // Redirect to final step (Step 4)
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to submit preferences.");
//         }
//     };

//     return (
//         <div className="preferences-form student-dashboard-form">
//             <h2>Step 3: Choose Your Preferences (Max {MAX_PREFERENCES})</h2>
//             <form onSubmit={handleSubmit}>
//                 <ul>
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
// src/Student/StudentPreferenceForm.jsx (Refactored for UX)

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentPreferenceForm.css'

const StudentPreferenceForm = () => {
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]); 
    // preferences now stores an array of objects, automatically ranked by array index
    const [preferencesArray, setPreferencesArray] = useState([]); 
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const MAX_PREFERENCES = 4;

    // A set of course_ids currently in the preference array for quick checking
    const preferredCourseIds = useMemo(() => new Set(preferencesArray.map(p => p.course_id)), [preferencesArray]);

    useEffect(() => {
        fetchCollegeCourseData();
    }, []);

    // Fetches all courses and existing preferences
    const fetchCollegeCourseData = async () => {
        try {
            const coursesRes = await axios.get("http://localhost:5000/api/courses/details"); 
            setAllCourses(coursesRes.data);

            const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
            
            // Convert fetched preferences (which include priority_rank) back into a sorted array
            if (dataRes.data.preferences?.length > 0) {
                const initialPrefs = dataRes.data.preferences
                    .sort((a, b) => a.priority_rank - b.priority_rank)
                    .map(p => ({
                        course_id: p.course_id,
                        college_id: p.college_id,
                        course_name: p.course_name, // Assume this comes from the GET /students/data join
                        college_name: p.college_name // Assume this comes from the GET /students/data join
                    }));
                setPreferencesArray(initialPrefs);
            }
            
        } catch (err) {
            console.error("Error fetching course or preference data:", err);
            alert("Failed to load course options. Check backend routes/server status.");
        }
    };

    // --- HANDLERS FOR DYNAMIC SELECTION ---

    const handleAddPreference = (course) => {
        if (preferencesArray.length >= MAX_PREFERENCES) {
            alert(`You can select a maximum of ${MAX_PREFERENCES} preferences.`);
            return;
        }

        // Add the new preference object. Rank will be assigned at submission time.
        setPreferencesArray(prev => [
            ...prev,
            { 
                course_id: course.course_id, 
                college_id: course.college_id, 
                course_name: course.course_name,
                college_name: course.college_name
            }
        ]);
    };

    const handleDeletePreference = (courseIdToRemove) => {
        setPreferencesArray(prev => prev.filter(p => p.course_id !== courseIdToRemove));
    };

    // --- SUBMISSION HANDLER ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (preferencesArray.length === 0) {
            alert("Please select at least one preference.");
            return;
        }
        
        // 🚨 CRITICAL: Assign priority_rank based on the array index (1-based)
        const payload = preferencesArray.map((p, index) => ({
            college_id: p.college_id,
            course_id: p.course_id,
            priority_rank: index + 1 // Rank 1, 2, 3, 4
        }));

        try {
            await axios.post("http://localhost:5000/students/preferences", payload, { headers });
            alert("Preferences saved! Your ranks are set by the list order.");
            navigate('/dashboard/profile');
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit preferences.");
        }
    };
    
    // --- JSX RENDERING ---
    
    // Create the visual preference list (draggable for rank change, optional)
    const renderCurrentPreferences = () => {
        return (
            <div className="current-preferences">
                <h4>Your Ranks ({preferencesArray.length} / {MAX_PREFERENCES})</h4>
                <ol>
                    {preferencesArray.map((p, index) => (
                        <li key={p.course_id}>
                            <span className="rank-number">{index + 1}.</span>
                            <strong>{p.course_name}</strong> at {p.college_name}
                            <button 
                                type="button" 
                                className="delete-btn" 
                                onClick={() => handleDeletePreference(p.course_id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    return (
        <div className="preferences-form student-dashboard-form">
            <h2>Step 3: Choose Your Preferences (Max {MAX_PREFERENCES})</h2>
            <form onSubmit={handleSubmit}>
                <div className="preference-container">
                    
                    {/* LEFT SIDE: AVAILABLE COURSES LIST */}
                    <div className="available-courses">
                        <h4>Available Options</h4>
                        <ul>
                            {allCourses.map(course => {
                                const isAdded = preferredCourseIds.has(course.course_id);
                                return (
                                    <li key={course.course_id} className={isAdded ? 'added' : ''}>
                                        <strong>{course.course_name}</strong> at {course.college_name}
                                        <button
                                            type="button"
                                            className={isAdded ? 'remove-btn' : 'add-btn'}
                                            onClick={() => isAdded ? handleDeletePreference(course.course_id) : handleAddPreference(course)}
                                            disabled={!isAdded && preferencesArray.length >= MAX_PREFERENCES}
                                        >
                                            {isAdded ? 'Selected (Delete)' : 'Add'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* RIGHT SIDE: CURRENT RANKS LIST */}
                    <div className="selected-ranks-display">
                        {renderCurrentPreferences()}
                    </div>
                </div>
                
                <button type="submit" className="submit-all-btn">Submit Preferences</button>
            </form>
        </div>
    );
};
export default StudentPreferenceForm;