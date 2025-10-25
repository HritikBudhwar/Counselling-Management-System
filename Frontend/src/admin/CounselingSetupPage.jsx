// // src/components/admin/CounselingSetupPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminLayout from './AdminLayout'; // Ensure correct path
// import './CounselingSetupPage.css'
// const CounselingSetupPage = () => {
//   const [rounds, setRounds] = useState([]);
//   const [exams, setExams] = useState([]); // Assuming you need a list of exams for the dropdown
//   const [newRound, setNewRound] = useState({ 
//     exam_id: '', 
//     round_no: '', 
//     counseling_date: '', 
//     status: 'Pending' 
//   });
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       // 1. Fetch Rounds
//       const roundsRes = await axios.get("http://localhost:5000/api/counseling");
//       setRounds(roundsRes.data);
      
//       // 2. Fetch Exams (assuming a /api/exams endpoint exists and is needed)
//       // const examsRes = await axios.get("http://localhost:5000/api/exams");
//       // setExams(examsRes.data);
//       // For now, use dummy data if the exam route is not built:
//       setExams([{ exam_id: 1, name: 'JEE Main' }, { exam_id: 2, name: 'State CET' }]);

//     } catch (err) {
//       console.error("Error fetching counseling data:", err);
//     }
//   };

//   const handleAddRound = async () => {
//     if (!newRound.exam_id || !newRound.round_no) {
//         alert("Select Exam and Round Number.");
//         return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/counseling", newRound, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       alert("Counseling round added!");
//       setNewRound({ exam_id: '', round_no: '', counseling_date: '', status: 'Pending' });
//       fetchData();
//     } catch (err) {
//       console.error("Error adding round:", err);
//       alert("Failed to add round. Check backend.");
//     }
//   };

//   const handleUpdateStatus = async (id, newStatus) => {
//       try {
//         await axios.put(`http://localhost:5000/api/counseling/${id}`, { status: newStatus }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         alert("Status updated!");
//         fetchData();
//       } catch (err) {
//         console.error("Error updating status:", err);
//         alert("Failed to update status.");
//       }
//   };

//   return (
//     <div className="counseling-setup-page">
//       <h2>📅 Counseling Setup Management</h2>

//       {/* ADD NEW ROUND FORM */}
//       <section className="add-section">
//         <h3>Add New Counseling Round</h3>
//         <div className="form-group">
//           <select 
//             value={newRound.exam_id} 
//             onChange={e => setNewRound({ ...newRound, exam_id: e.target.value })}
//           >
//             <option value="">Select Exam</option>
//             {exams.map(exam => (
//               <option key={exam.exam_id} value={exam.exam_id}>{exam.name}</option>
//             ))}
//           </select>
//           <input
//             type="number"
//             placeholder="Round No"
//             value={newRound.round_no}
//             onChange={e => setNewRound({ ...newRound, round_no: e.target.value })}
//           />
//           <input
//             type="date"
//             value={newRound.counseling_date}
//             onChange={e => setNewRound({ ...newRound, counseling_date: e.target.value })}
//           />
//           <select 
//             value={newRound.status} 
//             onChange={e => setNewRound({ ...newRound, status: e.target.value })}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Registration Open">Registration Open</option>
//             <option value="Results Declared">Results Declared</option>
//             <option value="Closed">Closed</option>
//           </select>
//           <button onClick={handleAddRound}>Add Round</button>
//         </div>
//       </section>

//       {/* ROUNDS LIST */}
//       <section className="list-section">
//         <h3>Current Rounds Status</h3>
//         <ul>
//           {rounds.map(round => (
//             <li key={round.counseling_id}>
//               <strong>{round.exam_name || 'N/A'} - Round {round.round_no}</strong> 
//               <span>Date: {round.counseling_date ? new Date(round.counseling_date).toLocaleDateString() : 'TBD'}</span>
//               <span style={{ fontWeight: 'bold', color: round.status === 'Registration Open' ? 'green' : 'red' }}>Status: {round.status}</span>
              
//               <select 
//                 value={round.status} 
//                 onChange={e => handleUpdateStatus(round.counseling_id, e.target.value)}
//               >
//                 <option value="Pending">Set Pending</option>
//                 <option value="Registration Open">Set Open</option>
//                 <option value="Results Declared">Set Results</option>
//                 <option value="Closed">Set Closed</option>
//               </select>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default CounselingSetupPage;









// src/components/admin/CounselingSetupPage.jsx (FIXED)

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './CounselingSetupPage.css'
// // Note: Removed AdminLayout import as it should be passed via App.jsx/Route

// const CounselingSetupPage = () => {
//   const [rounds, setRounds] = useState([]);
//   const [exams, setExams] = useState([]); 
//   const [newRound, setNewRound] = useState({ 
//     exam_id: '', 
//     round_no: '', 
//     counseling_date: '', 
//     status: 'Pending' 
//   });
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       // 1. Fetch Rounds
//       const roundsRes = await axios.get("http://localhost:5000/api/counseling");
//       setRounds(roundsRes.data);
      
//       // 2. 🚨 FIX: Fetch Exams from the new backend endpoint
//       const examsRes = await axios.get("http://localhost:5000/api/exams");
//       // Note: The controller should return [{exam_id, name}]
//       setExams(examsRes.data); 

//     } catch (err) {
//       console.error("Error fetching counseling data:", err);
//       // Optional: Alert the admin if the fetch failed
//       // alert("Failed to load initial data. Check Exam and Counseling API routes.");
//     }
//   };

//   const handleAddRound = async () => {
//     // 🚨 FIX: Convert exam_id and round_no to numbers before sending
//     const payload = {
//         ...newRound,
//         exam_id: parseInt(newRound.exam_id), 
//         round_no: parseInt(newRound.round_no), 
//     };
    
//     // The alert "Select Exam and Round Number." is correct if fields are empty
//     if (!payload.exam_id || !payload.round_no) {
//         alert("Select Exam and Round Number.");
//         return;
//     }
    
//     try {
//       await axios.post("http://localhost:5000/api/counseling", payload, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       alert("Counseling round added!");
//       setNewRound({ exam_id: '', round_no: '', counseling_date: '', status: 'Pending' });
//       fetchData();
//     } catch (err) {
//       console.error("Error adding round:", err);
//       alert("Failed to add round. Check backend route or database error.");
//     }
//   };

//   // src/components/admin/CounselingSetupPage.jsx (Modified handleUpdateStatus)

// const handleUpdateStatus = async (counseling_id, newStatus) => {
//     // 🚨 FIX 1: Find the full round object to get the existing date
//     const roundToUpdate = rounds.find(r => r.counseling_id === counseling_id);
    
//     // Add a warning check before closing a round
//     if (newStatus === 'Closed' && !window.confirm("WARNING: Closing this round makes it irreversible. Continue?")) {
//         return;
//     }
    
//     try {
//         await axios.put(
//             `http://localhost:5000/api/counseling/${counseling_id}`, 
//             // 🚨 FIX 2: Send both status and date
//             { 
//                 status: newStatus, 
//                 // Send the existing date or null if TBD. Date must be in YYYY-MM-DD format.
//                 counseling_date: roundToUpdate?.counseling_date 
//             }, 
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert(`Status updated to ${newStatus}!`);
//         fetchData();
//     } catch (err) {
//         // ... error handling ...
//     }
// };
  
//   // ... handleUpdateStatus function (no change needed)

//   return (
//     <div className="counseling-setup-page">
//       <h2>📅 Counseling Setup Management</h2>

//       {/* ADD NEW ROUND FORM */}
//       <section className="add-section">
//         <h3>Add New Counseling Round</h3>
//         <div className="form-group">
//           {/* 🚨 FIX: Ensure the value is string when mapping, but sent as number */}
//           <select 
//             value={newRound.exam_id} 
//             onChange={e => setNewRound({ ...newRound, exam_id: e.target.value })}
//           >
//             <option value="">Select Exam</option>
//             {exams.map(exam => (
//               <option key={exam.exam_id} value={exam.exam_id}>{exam.name}</option>
//             ))}
//           </select>
//           {/* ... rest of the form ... */}
//           <input
//             type="number"
//             placeholder="Round No"
//             value={newRound.round_no}
//             onChange={e => setNewRound({ ...newRound, round_no: e.target.value })}
//           />
//           <input
//             type="date"
//             value={newRound.counseling_date}
//             onChange={e => setNewRound({ ...newRound, counseling_date: e.target.value })}
//           />
//           <select 
//             value={newRound.status} 
//             onChange={e => setNewRound({ ...newRound, status: e.target.value })}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Registration Open">Registration Open</option>
//             <option value="Results Declared">Results Declared</option>
//             <option value="Closed">Closed</option>
//           </select>
//           <button onClick={handleAddRound}>Add Round</button>
//         </div>
//       </section>

//       {/* ROUNDS LIST */}
//       {/* ... list remains the same ... */}
//       <section className="list-section">
//         <h3>Current Rounds Status</h3>
//         <ul>
//           {rounds.map(round => (
//             <li key={round.counseling_id}>
//               <strong>{round.exam_name || 'N/A'} - Round {round.round_no}</strong> 
//               <span>Date: {round.counseling_date ? new Date(round.counseling_date).toLocaleDateString() : 'TBD'}</span>
//               <span style={{ fontWeight: 'bold', color: round.status === 'Registration Open' ? 'green' : 'red' }}>Status: {round.status}</span>
              
//               <select 
//                 value={round.status} 
//                 onChange={e => handleUpdateStatus(round.counseling_id, e.target.value)}
//               >
//                 <option value="Pending">Set Pending</option>
//                 <option value="Registration Open">Set Open</option>
//                 <option value="Results Declared">Set Results</option>
//                 <option value="Closed">Set Closed</option>
//               </select>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default CounselingSetupPage;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CounselingSetupPage.css';

// Helper function to format date for MySQL (YYYY-MM-DD)
// If the date is a full ISO string (from JavaScript), it extracts only the date part.
// If it's already a simple date string or null, it returns it as is.
const formatDateToMySQL = (dateValue) => {
    if (!dateValue) return null;
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
        return dateValue.split('T')[0];
    }
    return dateValue;
};

const CounselingSetupPage = () => {
  const [rounds, setRounds] = useState([]);
  const [exams, setExams] = useState([]); 
  const [newRound, setNewRound] = useState({ 
    exam_id: '', 
    round_no: '', 
    counseling_date: '', 
    status: 'Pending' 
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Rounds
      const roundsRes = await axios.get("http://localhost:5000/api/counseling");
      setRounds(roundsRes.data);
      
      // 2. Fetch Exams
      const examsRes = await axios.get("http://localhost:5000/api/exams");
      setExams(examsRes.data); 

    } catch (err) {
      console.error("Error fetching counseling data:", err);
      // Optional: Add logging to help diagnose if the backend is down
    }
  };

  const handleAddRound = async () => {
    const payload = {
        ...newRound,
        // Convert to number, check if conversion fails and defaults to empty string
        exam_id: newRound.exam_id ? parseInt(newRound.exam_id) : null, 
        round_no: newRound.round_no ? parseInt(newRound.round_no) : null,
        // Ensure date is formatted if present
        counseling_date: formatDateToMySQL(newRound.counseling_date)
    };
    
    if (!payload.exam_id || !payload.round_no) {
        alert("Select Exam and enter a valid Round Number.");
        return;
    }
    
    try {
      await axios.post("http://localhost:5000/api/counseling", payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert("Counseling round added successfully!");
      setNewRound({ exam_id: '', round_no: '', counseling_date: '', status: 'Pending' });
      fetchData();
    } catch (err) {
      console.error("Error adding round:", err);
      alert(err.response?.data?.message || "Failed to add round. Check backend.");
    }
  };

  const handleUpdateStatus = async (counseling_id, newStatus) => {
      const roundToUpdate = rounds.find(r => r.counseling_id === counseling_id);
      
      if (!roundToUpdate) return;
      
      // Add a warning check before closing a round
      if (newStatus === 'Closed' && !window.confirm("WARNING: Closing this round makes it irreversible. Continue?")) {
          return;
      }
      
      try {
          await axios.put(
              `http://localhost:5000/api/counseling/${counseling_id}`, 
              { 
                  status: newStatus, 
                  // 🚨 CRITICAL FIX: Ensure date is formatted to YYYY-MM-DD to avoid the MySQL error.
                  // We use the helper function here.
                  counseling_date: formatDateToMySQL(roundToUpdate.counseling_date)
              }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
          alert(`Status updated to ${newStatus}!`);
          fetchData();
      } catch (err) {
          console.error("Error updating status:", err);
          alert(err.response?.data?.message || "Failed to update status.");
      }
  };

  return (
    <div className="counseling-setup-page">
      <h2>📅 Counseling Setup Management</h2>

      {/* ADD NEW ROUND FORM */}
      <section className="add-section">
        <h3>Add New Counseling Round</h3>
        <div className="form-group">
          <select 
            value={newRound.exam_id} 
            onChange={e => setNewRound({ ...newRound, exam_id: e.target.value })}
          >
            <option value="">Select Exam</option>
            {/* Using exam.name as rendered from the backend */}
            {exams.map(exam => (
              <option key={exam.exam_id} value={exam.exam_id}>{exam.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Round No"
            value={newRound.round_no}
            onChange={e => setNewRound({ ...newRound, round_no: e.target.value })}
          />
          <input
            type="date"
            // Ensure the input value itself is formatted correctly for the input type
            value={newRound.counseling_date}
            onChange={e => setNewRound({ ...newRound, counseling_date: e.target.value })}
          />
          <select 
            value={newRound.status} 
            onChange={e => setNewRound({ ...newRound, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Open">Registration Open</option> {/* Using 'Open' for flexibility/DB match */}
            <option value="Results Declared">Results Declared</option>
            <option value="Closed">Closed</option>
          </select>
          <button onClick={handleAddRound}>Add Round</button>
        </div>
      </section>

      {/* ROUNDS LIST */}
      <section className="list-section">
        <h3>Current Rounds Status</h3>
        <ul>
          {rounds.map(round => (
            <li key={round.counseling_id}>
              <strong>{round.exam_name || 'N/A'} - Round {round.round_no}</strong> 
              <span>Date: {round.counseling_date ? new Date(round.counseling_date).toLocaleDateString() : 'TBD'}</span>
              
              {/* Status Display and Dropdown */}
              <span style={{ fontWeight: 'bold', color: round.status === 'Open' || round.status === 'Registration Open' ? 'green' : 'red' }}>
                Status: {round.status}
              </span>
              
              <select 
                value={round.status} 
                onChange={e => handleUpdateStatus(round.counseling_id, e.target.value)}
              >
                <option value="Pending">Set Pending</option>
                <option value="Open">Set Open</option>
                <option value="Results Declared">Set Results</option>
                <option value="Closed">Set Closed</option>
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CounselingSetupPage;