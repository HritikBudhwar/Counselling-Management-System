
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentProfileForm.css';

const StudentProfileForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone_number: '', category: '' });
    const [isProfileNew, setIsProfileNew] = useState(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch existing profile data (if any) and pre-fill the form
    useEffect(() => {
        if (!user || user.role !== 'student') return;
        
        axios.get("http://localhost:5000/students/data", { headers })
            .then(res => {
                const profile = res.data.profile;
                if (profile && profile.student_id) { 
                    setFormData({
                        name: profile.name || '',
                        phone_number: profile.phone_number || '',
                        category: profile.category || '',
                    });
                    setIsProfileNew(false);
                } else {
                    setIsProfileNew(true);
                }
            })
            .catch(err => {
                console.error("Error fetching profile data (assuming new user):", err);
                setIsProfileNew(true);
            });
    }, [user, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.phone_number || !formData.category) {
            alert("All fields are required.");
            return;
        }
        
        // 🚨 FIX: Create payload that explicitly includes the email from the authenticated user object
        const payload = {
            ...formData,
            email: user?.email // Ensure the email is in the payload!
        };

        try {
            await axios.post("http://localhost:5000/students/profile", payload, { headers });
            alert(`Profile ${isProfileNew ? 'saved' : 'updated'}! Moving to Marks Submission.`);
            navigate('/dashboard/marks'); 
        } catch (err) {
            // Displays specific backend error 
            alert(err.response?.data?.message || "Failed to save profile. Please check your token/backend connection.");
        }
    };

    return (
        <div className="student-dashboard-form">
            <h2>Step 1: Basic Profile Details</h2>
            <p className="subtitle">Your email (**{user?.email}**) will be used for linking your profile.</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="phone_number" placeholder="Mobile Number" value={formData.phone_number} onChange={handleChange} required />
                
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                </select>
                <button type="submit">{isProfileNew ? 'Save & Continue' : 'Update Profile'}</button>
            </form>
        </div>
    );
};
export default StudentProfileForm;





// // src/Student/StudentProfileForm.jsx 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './StudentProfileForm.css';

// const StudentProfileForm = () => {
//     const navigate = useNavigate();
//     // 🚨 ADDED 'email' to the state for user input
//     const [formData, setFormData] = useState({ name: '', phone_number: '', category: '', email: '' }); 
//     const [isProfileNew, setIsProfileNew] = useState(true);
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));
//     const headers = { Authorization: `Bearer ${token}` };

//     // Fetch existing profile data (if any) and pre-fill the form
//     useEffect(() => {
//         if (!user || user.role !== 'student') return;
        
//         axios.get("http://localhost:5000/students/data", { headers })
//             .then(res => {
//                 const profile = res.data.profile;
//                 if (profile && profile.student_id) {
//                     setFormData({
//                         name: profile.name || '',
//                         phone_number: profile.phone_number || '',
//                         category: profile.category || '',
//                         // Pre-fill email from the fetched profile data
//                         email: profile.email || user.email || '', 
//                     });
//                     setIsProfileNew(false);
//                 } else {
//                     // Pre-fill the email field with the authenticated user's email if profile is new
//                     setFormData(prev => ({ ...prev, email: user.email || '' }));
//                     setIsProfileNew(true);
//                 }
//             })
//             .catch(err => {
//                 console.error("Error fetching profile data:", err);
//                 setIsProfileNew(true);
//             });
//     }, [user, token]);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // 🚨 CRITICAL VALIDATION: Now checking for email input as well
//         if (!formData.name || !formData.phone_number || !formData.category || !formData.email) {
//             alert("All fields, including Email, are required.");
//             return;
//         }

//         try {
//             // POST /students/profile now sends the manually provided email
//             await axios.post("http://localhost:5000/students/profile", formData, { headers });
//             alert(`Profile ${isProfileNew ? 'saved' : 'updated'}! Moving to Marks Submission.`);
//             navigate('/dashboard/marks'); 
//         } catch (err) {
//             // Displays specific backend error 
//             alert(err.response?.data?.message || "Failed to save profile. Check connection/backend logs.");
//         }
//     };

//     return (
//         <div className="student-dashboard-form">
//             <h2>Step 1: Basic Profile Details</h2>
//             {/* Display guidance has been changed since the field is now required */}
//             <p className="subtitle">Please confirm your email address for profile linking.</p>
//             <form onSubmit={handleSubmit}>
//                 {/* 🚨 NEW EMAIL INPUT FIELD */}
//                 <input 
//                     type="email" 
//                     name="email" 
//                     placeholder="Email Address" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                     required 
//                     // Prevent changing the email if the profile already exists
//                     readOnly={!isProfileNew && formData.email}
//                 />
                
//                 <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
//                 <input type="text" name="phone_number" placeholder="Mobile Number" value={formData.phone_number} onChange={handleChange} required />
                
//                 <select name="category" value={formData.category} onChange={handleChange} required>
//                     <option value="">Select Category</option>
//                     <option value="General">General</option>
//                     <option value="OBC">OBC</option>
//                     <option value="SC">SC</option>
//                     <option value="ST">ST</option>
//                 </select>
//                 <button type="submit">{isProfileNew ? 'Save & Continue' : 'Update Profile'}</button>
//             </form>
//         </div>
//     );
// };
// export default StudentProfileForm;