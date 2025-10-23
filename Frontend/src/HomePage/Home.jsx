import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Hey guys, this side I’m here 👋</h1>
      <div className="button-container">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Home;
