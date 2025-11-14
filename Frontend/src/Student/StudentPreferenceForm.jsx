import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentPreferenceForm.css'

const StudentPreferenceForm = () => {
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]); 
    const [preferencesArray, setPreferencesArray] = useState([]); 
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const MAX_PREFERENCES = 4;

    const preferredCourseIds = useMemo(() => new Set(preferencesArray.map(p => p.course_id)), [preferencesArray]);

    useEffect(() => {
        fetchCollegeCourseData();
    }, []);
    const fetchCollegeCourseData = async () => {
        try {
            const coursesRes = await axios.get("http://localhost:5000/api/courses/details"); 
            setAllCourses(coursesRes.data);

            const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
            if (dataRes.data.preferences?.length > 0) {
                const initialPrefs = dataRes.data.preferences
                    .sort((a, b) => a.priority_rank - b.priority_rank)
                    .map(p => ({
                        course_id: p.course_id,
                        college_id: p.college_id,
                        course_name: p.course_name, 
                        college_name: p.college_name 
                    }));
                setPreferencesArray(initialPrefs);
            }
            
        } catch (err) {
            console.error("Error fetching course or preference data:", err);
            alert("Failed to load course options. Check backend routes/server status.");
        }
    };

    const handleAddPreference = (course) => {
        if (preferencesArray.length >= MAX_PREFERENCES) {
            alert(`You can select a maximum of ${MAX_PREFERENCES} preferences.`);
            return;
        }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (preferencesArray.length === 0) {
            alert("Please select at least one preference.");
            return;
        }
        
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