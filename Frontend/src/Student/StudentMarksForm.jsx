// // src/Student/StudentMarksForm.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './StudentMarksForm.css'

// const StudentMarksForm = () => {
//     const navigate = useNavigate();
//     const [exams, setExams] = useState([]);
//     const [marksData, setMarksData] = useState({}); // Stores data for submission
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };
    
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 // 1. Fetch list of exams
//                 const examsRes = await axios.get("http://localhost:5000/api/exams");
//                 setExams(examsRes.data);
                
//                 // 2. Fetch existing marks from the consolidated endpoint
//                 const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
                
//                 const initialMarks = {};
//                 // Pre-fill form by mapping fetched array of marks into a key-value object {exam_id: {data}}
//                 dataRes.data.marks.forEach(m => {
//                     initialMarks[m.exam_id] = { 
//                         exam_id: m.exam_id, 
//                         score: m.score, 
//                         exam_rank: m.exam_rank,
//                         percentile: m.percentile
//                     };
//                 });
//                 setMarksData(initialMarks);

//             } catch (error) {
//                 console.error("Error fetching marks data:", error);
//             }
//         };
//         fetchInitialData();
//     }, [token]);

//     const handleChange = (examId, field, value) => {
//         setMarksData(prev => ({
//             ...prev,
//             [examId]: {
//                 ...prev[examId], 
//                 exam_id: parseInt(examId),
//                 // Handle empty string as null, and convert to number types
//                 [field]: value === "" ? null : (field === 'score' || field === 'percentile' ? parseFloat(value) : parseInt(value))
//             }
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Filter out empty/null entries before submitting
//         const payload = Object.values(marksData).filter(m => m.score !== null && m.score !== undefined);

//         if (payload.length === 0) {
//             alert("Please enter marks for at least one exam.");
//             return;
//         }

//         try {
//             await axios.post("http://localhost:5000/students/marks", payload, { headers });
//             alert("Marks submitted! Moving to Preferences.");
//             navigate('/dashboard/preferences'); // Redirect to next step (Step 3)
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to submit marks. Check console.");
//         }
//     };

//     return (
//         <div className="marks-form student-dashboard-form">
//             <h2>Step 2: Submit Exam Results (for Allocation Merit)</h2>
//             <form onSubmit={handleSubmit}>
//                 {exams.map(exam => (
//                     <div key={exam.exam_id} className="exam-input-group">
//                         <h3>{exam.name}</h3>
//                         <input type="number" placeholder="Score" step="0.01" 
//                                value={marksData[exam.exam_id]?.score || ''}
//                                onChange={e => handleChange(exam.exam_id, 'score', e.target.value)} required />
//                         <input type="number" placeholder="Rank (Optional)" 
//                                value={marksData[exam.exam_id]?.exam_rank || ''}
//                                onChange={e => handleChange(exam.exam_id, 'exam_rank', e.target.value)} />
//                         <input type="number" placeholder="Percentile (Optional)" step="0.01" 
//                                value={marksData[exam.exam_id]?.percentile || ''}
//                                onChange={e => handleChange(exam.exam_id, 'percentile', e.target.value)} />
//                     </div>
//                 ))}
//                 <button type="submit">Submit Marks & Continue</button>
//             </form>
//         </div>
//     );
// };
// export default StudentMarksForm;






// src/Student/StudentMarksForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentMarksForm.css'

const StudentMarksForm = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(''); // State for the selected exam in the dropdown
    const [marksData, setMarksData] = useState({}); // Stores {examId: {score, rank, percentile}}
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    useEffect(() => {
        // Fetch list of exams and existing marks
        const fetchInitialData = async () => {
            try {
                const examsRes = await axios.get("http://localhost:5000/api/exams");
                setExams(examsRes.data);
                
                const dataRes = await axios.get("http://localhost:5000/students/data", { headers });
                
                const initialMarks = {};
                dataRes.data.marks.forEach(m => {
                    initialMarks[m.exam_id] = { 
                        exam_id: m.exam_id, 
                        score: m.score, 
                        exam_rank: m.exam_rank,
                        percentile: m.percentile
                    };
                });
                setMarksData(initialMarks);

            } catch (error) {
                console.error("Error fetching marks data:", error);
            }
        };
        fetchInitialData();
    }, [token]);

    const handleChange = (field, value) => {
        if (!selectedExamId) return;
        
        // Use the selectedExamId for dynamic input
        setMarksData(prev => ({
            ...prev,
            [selectedExamId]: {
                ...prev[selectedExamId],
                exam_id: parseInt(selectedExamId),
                // Handle empty string as null, and convert to number types
                [field]: value === "" ? null : (field === 'score' || field === 'percentile' ? parseFloat(value) : parseInt(value))
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Filter out entries that have no score before submitting
        const payload = Object.values(marksData).filter(m => m.score !== null && m.score !== undefined);

        if (payload.length === 0) {
            alert("Please enter marks for at least one exam.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/students/marks", payload, { headers });
            alert("Marks submitted! Moving to Preferences.");
            navigate('/dashboard/preferences'); // Redirect to next step (Step 3)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit marks. Check console.");
        }
    };
    
    const selectedExam = exams.find(e => e.exam_id === parseInt(selectedExamId));
    const currentMarks = marksData[selectedExamId] || {};

    return (
        <div className="marks-form student-dashboard-form">
            <h2>Step 2: Submit Exam Results</h2>
            <form onSubmit={handleSubmit}>
                <div className="exam-selection-area">
                    <label>Select Exam:</label>
                    <select 
                        value={selectedExamId} 
                        onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                        <option value="">-- Choose Exam --</option>
                        {exams.map(exam => (
                            <option key={exam.exam_id} value={exam.exam_id}>{exam.name}</option>
                        ))}
                    </select>
                </div>

                {selectedExam && (
                    <div className="exam-input-group">
                        <h3>Entering Marks for: {selectedExam.name}</h3>
                        <input type="number" placeholder="Score (Required)" step="0.01" 
                               value={currentMarks.score || ''}
                               onChange={e => handleChange('score', e.target.value)} required />
                        <input type="number" placeholder="Rank (Optional)" 
                               value={currentMarks.exam_rank || ''}
                               onChange={e => handleChange('exam_rank', e.target.value)} />
                        <input type="number" placeholder="Percentile (Optional)" step="0.01" 
                               value={currentMarks.percentile || ''}
                               onChange={e => handleChange('percentile', e.target.value)} />
                    </div>
                )}
                
                <button type="submit">Submit All Marks & Continue</button>
                
                {/* Display summary of submitted exams */}
                <div className="submitted-summary">
                    <h4>Currently Submitted Exams:</h4>
                    <ul>
                        {Object.keys(marksData).map(id => {
                            const exam = exams.find(e => e.exam_id === parseInt(id));
                            if (marksData[id].score) {
                                return <li key={id}>✅ {exam?.name}: Score {marksData[id].score}</li>;
                            }
                            return null;
                        })}
                    </ul>
                </div>
            </form>
        </div>
    );
};
export default StudentMarksForm;