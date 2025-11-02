// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       <h1>Hey guys, this side I’m here 👋</h1>
//       <div className="button-container">
//         <button className="login-btn" onClick={() => navigate("/login")}>
//           Login
//         </button>
//         <button className="signup-btn" onClick={() => navigate("/signup")}>
//           Signup
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Home;


import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Increased font size for impact */}
      <h1>Welcome to the University Counseling Portal</h1> 
      
      {/* New subtitle element */}
      <p className="tagline">Your trusted source for merit-based seat allocation and academic guidance.</p> 
      
      <div className="button-container">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Secure Login
        </button>
        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Home;