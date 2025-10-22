import React, { useEffect, useState } from "react";
import "./collegeList.css";

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("http://localhost:5000/College");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched colleges:", data);
        setColleges(data);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("Could not load colleges. Please try again later.");
      }
    };

    fetchColleges();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!colleges || colleges.length === 0) {
    return <p className="loading">Loading colleges...</p>;
  }

  return (
    <div className="college-container">
      <h2 className="college-title">Available Colleges</h2>
      <ul className="college-list">
        {colleges.map((college) => (
          <li key={college.college_id} className="college-card">
            <h3 className="college-name">{college.name}</h3>
            <p className="college-location">{college.location}</p>
            <p className="college-type">{college.college_type}</p>
            <p className="college-affiliation">{college.affiliation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollegeList;
