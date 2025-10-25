// // src/admin/StudentProfilePage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './StudentProfilePage.css'

// const StudentProfilePage = () => {
//     const [profile, setProfile] = useState(null);
//     const [preferences, setPreferences] = useState([]);
//     const [allocation, setAllocation] = useState(null);
//     const [counselingStatus, setCounselingStatus] = useState(null);
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));
//     const headers = { Authorization: `Bearer ${token}` };

//     useEffect(() => {
//         fetchStudentData();
//     }, []);

//     const fetchStudentData = async () => {
//         try {
//             // Placeholder: Fetch full profile, preferences, and allocation result
//             // This requires new GET endpoints (e.g., /students/data, /students/allocation)
            
//             // For now, mock the counseling status fetch
//             const statusRes = await axios.get("http://localhost:5000/api/counseling");
//             setCounselingStatus(statusRes.data.find(r => r.status === 'Registration Open') || statusRes.data[0]);

//             // Assuming a dedicated endpoint to get the student's data
//             const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
//             setProfile(dataRes.data.profile);
//             setPreferences(dataRes.data.preferences);
//             setAllocation(dataRes.data.allocation); 
            
//         } catch (err) {
//             console.error("Error fetching student data:", err);
//         }
//     };

//     return (
//         <div className="student-profile-page">
//             <h2>Welcome, {user?.username || 'Student'}</h2>
            
//             {/* --- COUNSELING STATUS --- */}
//             <section className="status-card">
//                 <h3>Counseling Update</h3>
//                 {counselingStatus ? (
//                     <p>
//                         Current Round: **Round {counselingStatus.round_no}** is **{counselingStatus.status}** (Exam: {counselingStatus.exam_name})
//                     </p>
//                 ) : (
//                     <p>Counseling schedule not yet published.</p>
//                 )}
//             </section>

//             {/* --- ALLOCATION RESULT --- */}
//             <section className="allocation-result">
//                 <h3>Final Allocation Result</h3>
//                 {allocation?.college_name ? (
//                     <div className="success-message">
//                         <p>🎉 Congratulations! You have been allotted a seat:</p>
//                         <p>**{allocation.course_name}** in **{allocation.college_name}** (Round {allocation.round_no})</p>
//                     </div>
//                 ) : (
//                     <p>Allocation results are pending or not yet declared for this round.</p>
//                 )}
//             </section>

//             {/* --- PREFERENCES SUMMARY --- */}
//             <section className="preferences-summary">
//                 <h3>Your Submitted Preferences</h3>
//                 {preferences.length > 0 ? (
//                     <ol>
//                         {preferences.map((p, index) => (
//                             <li key={index}>**Rank {p.priority_rank}:** {p.course_name} at {p.college_name}</li>
//                         ))}
//                     </ol>
//                 ) : (
//                     <p>Preferences not yet submitted. <Link to="/dashboard/preferences">Submit now</Link>.</p>
//                 )}
//             </section>

//             {/* --- PROFILE DETAILS --- */}
//             <section className="profile-details">
//                 <h3>Your Details</h3>
//                 <p>Name: {profile?.name}</p>
//                 <p>Email: {user?.email}</p>
//                 <p>Category: {profile?.category}</p>
//                 <Link to="/dashboard">Update Profile/Marks</Link>
//             </section>
//         </div>
//     );
// };
// export default StudentProfilePage;


// src/Student/StudentProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StudentProfilePage.css'

const StudentProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [allocation, setAllocation] = useState(null);
    const [counselingStatus, setCounselingStatus] = useState(null);
    const [marks, setMarks] = useState([]);
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            // 1. Fetch Consolidated Data
            const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
            
            setProfile(dataRes.data.profile);
            setPreferences(dataRes.data.preferences);
            setAllocation(dataRes.data.allocation); 
            setMarks(dataRes.data.marks); // Display marks for verification
            
            // 2. Fetch Counseling Status (for current round info)
            const statusRes = await axios.get("http://localhost:5000/api/counseling");
            // Find the round that is currently Open or the latest declared round
            const latestRound = statusRes.data.find(r => r.status === 'Open' || r.status === 'Results Declared') || statusRes.data[0];
            setCounselingStatus(latestRound);
            
        } catch (err) {
            console.error("Error fetching student data:", err);
            // Handle error state gracefully
        }
    };

    return (
        <div className="student-profile-page">
            <h2>Welcome, {user?.username || 'Student'}</h2>
            
            {/* --- ALLOCATION RESULT --- */}
            <section className="allocation-result">
                <h3>Final Allocation Result</h3>
                {allocation?.college_name ? (
                    <div className="success-message">
                        <p>🎉 Congratulations! You have been allotted a seat:</p>
                        <p>**{allocation.course_name}** in **{allocation.college_name}** (Round {allocation.round_no})</p>
                    </div>
                ) : (
                    <p>Allocation results are pending or not yet declared for this round.</p>
                )}
            </section>
            
            {/* --- COUNSELING STATUS --- */}
            <section className="status-card">
                <h3>Counseling Update</h3>
                {counselingStatus ? (
                    <p>
                        Current Round: **Round {counselingStatus.round_no}** is **{counselingStatus.status}** (Exam ID: {counselingStatus.exam_id})
                    </p>
                ) : (
                    <p>Counseling schedule not yet published.</p>
                )}
            </section>

            {/* --- PROFILE DETAILS --- */}
            <section className="profile-details">
                <h3>Your Details</h3>
                <p>Name: {profile?.name || 'N/A'}</p>
                <p>Email: {user?.email}</p>
                <p>Category: {profile?.category || 'N/A'}</p>
            </section>
            
            {/* --- MARKS SUMMARY --- */}
            <section className="marks-summary">
                <h3>Your Submitted Marks</h3>
                {marks.length > 0 ? (
                    <ul>
                        {marks.map((m, index) => (
                            <li key={index}>Exam ID {m.exam_id}: Score {m.score}, Rank {m.exam_rank || 'N/A'}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Marks not yet submitted. <Link to="/dashboard/marks">Submit now</Link>.</p>
                )}
            </section>
            

            {/* --- PREFERENCES SUMMARY --- */}
            <section className="preferences-summary">
                <h3>Your Submitted Preferences</h3>
                {preferences.length > 0 ? (
                    <ol>
                        {preferences.map((p, index) => (
                            <li key={index}>**Rank {p.priority_rank}:** {p.course_name} at {p.college_name}</li>
                        ))}
                    </ol>
                ) : (
                    <p>Preferences not yet submitted. <Link to="/dashboard/preferences">Submit now</Link>.</p>
                )}
            </section>
        </div>
    );
};
export default StudentProfilePage;