// src/components/admin/EligibilitySetupPage.jsx (NEW FILE)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './EligibilitySetupPage.css'; // For styling

const EligibilitySetupPage = () => {
    const [courses, setCourses] = useState([]);
    const [criteriaList, setCriteriaList] = useState([]);
    const [formData, setFormData] = useState({ course_id: '', eligibility_id: '', total_seats: '' });
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch All Courses (from /api/courses)
            const coursesRes = await axios.get("http://localhost:5000/api/courses");
            setCourses(coursesRes.data);

            // Fetch All Criteria (from /api/eligibility/criteria)
            const criteriaRes = await axios.get("http://localhost:5000/api/eligibility/criteria");
            setCriteriaList(criteriaRes.data);

        } catch (err) {
            console.error("Error fetching setup data:", err);
            // Handle error (e.g., alert the admin)
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- HANDLER: LINK ELIGIBILITY ---
    const handleLinkEligibility = async () => {
        if (!formData.course_id || !formData.eligibility_id) {
            return alert("Select both a course and an eligibility rule.");
        }
        
        try {
            await axios.post('http://localhost:5000/api/eligibility/link', {
                course_id: parseInt(formData.course_id),
                eligibility_id: parseInt(formData.eligibility_id)
            }, { headers });
            alert("Eligibility linked successfully for the selected course!");
        } catch (e) {
            alert(e.response?.data?.message || "Failed to link eligibility.");
        }
    };

    // --- HANDLER: SET SEAT CAPACITY ---
    const handleSetSeats = async () => {
        if (!formData.course_id || !formData.total_seats) {
            return alert("Select a course and enter total seats.");
        }
        
        try {
            await axios.post('http://localhost:5000/api/eligibility/seats', {
                course_id: parseInt(formData.course_id),
                total_seats: parseInt(formData.total_seats)
            }, { headers });
            alert("Seat capacity set/updated successfully!");
        } catch (e) {
            alert(e.response?.data?.message || "Failed to set seats.");
        }
    };

    return (
        <div className="eligibility-setup-page">
            <h2>⚙️ Course Eligibility & Capacity Setup</h2>

            <section className="course-selector-section">
                <h3>1. Select Course</h3>
                <select 
                    name="course_id" 
                    value={formData.course_id} 
                    onChange={handleChange}
                >
                    <option value="">-- Choose Course to Configure --</option>
                    {courses.map(course => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name} (College ID: {course.college_id})
                        </option>
                    ))}
                </select>
            </section>
            
            {formData.course_id && (
                <>
                    <section className="eligibility-link-section">
                        <h3>2. Link Eligibility Criteria</h3>
                        <select 
                            name="eligibility_id" 
                            value={formData.eligibility_id} 
                            onChange={handleChange}
                        >
                            <option value="">-- Select Rule --</option>
                            {criteriaList.map(criteria => (
                                <option key={criteria.eligibility_id} value={criteria.eligibility_id}>
                                    {criteria.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleLinkEligibility}>Link Criteria</button>
                        <p className="note">This ensures only eligible students can be allocated this course.</p>
                    </section>
                    
                    <section className="seats-setup-section">
                        <h3>3. Set Seat Capacity</h3>
                        <input
                            type="number"
                            name="total_seats"
                            placeholder="Total Seats Available"
                            value={formData.total_seats}
                            onChange={handleChange}
                            min="1"
                        />
                        <button onClick={handleSetSeats}>Set/Update Seats</button>
                        <p className="note">This capacity limits the total number of students to be allotted.</p>
                    </section>
                </>
            )}
        </div>
    );
};

export default EligibilitySetupPage;