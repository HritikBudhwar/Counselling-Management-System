// // import React, { useState } from "react";
// // import "./signup.css";

// // const Signup = () => {
// //   const [role, setRole] = useState("student");
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //     adminKey: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (role === "admin" && formData.adminKey !== "ADMIN123") {
// //       alert("Invalid Admin Key");
// //       return;
// //     }

// //     const payload = {
// //       username: formData.username,
// //       email: formData.email,
// //       password: formData.password,
// //       role,
// //     };

// //     try {
// //       const response = await fetch("http://localhost:5000/api/auth/signup", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         alert("Signup successful!");
// //       } else {
// //         alert(data.message || "Signup failed");
// //       }
// //     } catch (err) {
// //       console.error("Signup error:", err);
// //       alert("Something went wrong. Try again.");
// //     }
// //   };

// //   return (
// //     <div className="signup-container">
// //       <div className="signup-box">
// //         <h2>Create Account</h2>

// //         <form onSubmit={handleSubmit}>
// //           <div className="input-group">
// //             <label>Role:</label>
// //             <select
// //               name="role"
// //               value={role}
// //               onChange={(e) => setRole(e.target.value)}
// //             >
// //               <option value="student">Student</option>
// //               <option value="admin">Admin</option>
// //             </select>
// //           </div>

// //           <div className="input-group">
// //             <label>Username:</label>
// //             <input
// //               type="text"
// //               name="username"
// //               placeholder="Enter username"
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <div className="input-group">
// //             <label>Email:</label>
// //             <input
// //               type="email"
// //               name="email"
// //               placeholder="Enter email"
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <div className="input-group">
// //             <label>Password:</label>
// //             <input
// //               type="password"
// //               name="password"
// //               placeholder="Enter password"
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           {role === "admin" && (
// //             <div className="input-group">
// //               <label>Admin Key:</label>
// //               <input
// //                 type="password"
// //                 name="adminKey"
// //                 placeholder="Enter Admin Key"
// //                 onChange={handleChange}
// //               />
// //             </div>
// //           )}

// //           <button type="submit" className="signup-btn">
// //             Sign Up
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;



// import React, { useState } from "react";
// import "./signup.css";

// const Signup = () => {
//   const [role, setRole] = useState("student");
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     adminKey: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("Registering...");

//     const payload = {
//       username: formData.username,
//       email: formData.email,
//       password: formData.password,
//       role,
//       // Include adminKey only if role is admin (for server check)
//       ...(role === "admin" && { adminKey: formData.adminKey }), 
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage("Signup successful!");
//         // Optional: clear form
//         setFormData({ username: "", email: "", password: "", adminKey: "" });
//       } else {
//         setMessage(data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       setMessage("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-box">
//         <h2>Create Account</h2>

//         <form onSubmit={handleSubmit}>
//           {/* ... Role selection, inputs ... (form remains largely the same) */}
//           <div className="input-group">
//             <label>Role:</label>
//             <select
//               name="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="student">Student</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           <div className="input-group">
//             <label>Username:</label>
//             <input
//               type="text"
//               name="username"
//               placeholder="Enter username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {role === "admin" && (
//             <div className="input-group">
//               <label>Admin Key:</label>
//               <input
//                 type="password"
//                 name="adminKey"
//                 placeholder="Enter Admin Key"
//                 value={formData.adminKey}
//                 onChange={handleChange}
//                 required // Added required back
//               />
//             </div>
//           )}

//           <button type="submit" className="signup-btn">
//             Sign Up
//           </button>
//         </form>
//         {message && <p className="message">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom"; // 👈 You must import Link if you are using react-router-dom

const Signup = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminKey: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering...");

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role,
      // Include adminKey only if role is admin (for server check)
      ...(role === "admin" && { adminKey: formData.adminKey }), 
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Please log in."); // Updated message
        // Optional: clear form
        setFormData({ username: "", email: "", password: "", adminKey: "" });
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* ... Role selection, inputs ... (omitted for brevity) */}
          <div className="input-group">
            <label>Role:</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {role === "admin" && (
            <div className="input-group">
              <label>Admin Key:</label>
              <input
                type="password"
                name="adminKey"
                placeholder="Enter Admin Key"
                value={formData.adminKey}
                onChange={handleChange}
                required // Added required back
              />
            </div>
          )}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        
        {/* 🚨 ADDED LOGIN LINK HERE */}
        <p className="login-prompt">
            Already have an account? <Link to="/login">Log in</Link>
        </p>
        
      </div>
    </div>
  );
};

export default Signup;