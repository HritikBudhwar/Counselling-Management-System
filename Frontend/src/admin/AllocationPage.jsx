// src/components/admin/AllocationPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllocationPage.css'; // Add CSS for this page

const AllocationPage = () => {
    const [seatMatrix, setSeatMatrix] = useState([]);
    const [allocationsList, setAllocationsList] = useState([]);
    const [currentRound, setCurrentRound] = useState(1);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetchSeatMatrix();
        fetchAllAllocations();
    };

    const fetchSeatMatrix = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/matrix", { headers });
            setSeatMatrix(res.data);
        } catch (err) {
            console.error("Error fetching seat matrix:", err);
        }
    };
    
    const fetchAllAllocations = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/allocations", { headers });
            setAllocationsList(res.data);
        } catch (err) {
            console.error("Error fetching allocation list:", err);
        }
    };

    const handleRunAllocation = async () => {
        if (!window.confirm(`Are you sure you want to run Allocation Round ${currentRound}?`)) return;

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/admin/allocate", 
                { round_no: parseInt(currentRound) }, 
                { headers }
            );
            alert(res.data.message);
            
            // Increment round for the next run
            setCurrentRound(prev => prev + 1);
            fetchData(); // Refresh data after allocation
        } catch (err) {
            alert(err.response?.data?.message || "Allocation failed. Check server logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="allocation-page">
            <h2>⚙️ Seat Allocation Control</h2>

            {/* 1. Allocation Trigger */}
            <section className="allocation-control">
                <h3>Run Next Allocation Round</h3>
                <div>
                    <label>Next Round Number:</label>
                    <input 
                        type="number" 
                        min="1" 
                        value={currentRound} 
                        onChange={e => setCurrentRound(parseInt(e.target.value))} 
                        disabled={loading}
                    />
                    <button onClick={handleRunAllocation} disabled={loading}>
                        {loading ? 'Running...' : `Run Allocation Round ${currentRound}`}
                    </button>
                </div>
            </section>

            {/* 2. Seat Matrix View */}
            <section className="seat-matrix">
                <h3>Current Seat Matrix (Capacity vs. Allocation)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>College</th>
                            <th>Course</th>
                            <th>Total Seats</th>
                            <th>Allocated</th>
                            <th>Vacant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seatMatrix.map((item, index) => (
                            <tr key={index}>
                                <td>{item.college_name}</td>
                                <td>{item.course_name}</td>
                                <td>{item.total_seats}</td>
                                <td>{item.allocated_seats}</td>
                                <td style={{ color: item.vacant_seats > 0 ? 'green' : 'red' }}>
                                    {item.vacant_seats}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            {/* 3. Allocation Results */}
            <section className="allocation-results">
                <h3>Detailed Allocation Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Student Name</th>
                            <th>College</th>
                            <th>Course</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocationsList.map((alloc, index) => (
                            <tr key={index}>
                                <td>{alloc.round_no}</td>
                                <td>{alloc.student_name}</td>
                                <td>{alloc.college_name}</td>
                                <td>{alloc.course_name}</td>
                                <td style={{ fontWeight: 'bold' }}>{alloc.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AllocationPage;