import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './Navbar/Navbar.jsx'
import CollegePage from './college/collegeList.jsx'
import Home from './HomePage/Home.jsx'
import Counseling from './Counseling/Counseling.jsx'
import Registration from "./Registration/Registration.jsx";
import Courses from './Courses/Courses.jsx'
import Login from './authentication/login.jsx'
import Signup from './authentication/signup.jsx'
import Dashboard from "./authentication/Dashboard.jsx";
const App=()=>{
  return(
    <Router>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/college" element={<CollegePage />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/counseling" element={<Counseling />} />
    <Route path="/registration" element={<Registration />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />

    </Routes>



    </Router>
  )
  
}
export default App;