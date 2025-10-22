// import {Link} from "react-router-dom";
// import './Navbar.css'
// import CollegePage from './college/collegeList.jsx'


// const Navbar=()=>{
//     return(
//         <div className='main'>
//             <li className='list'>
//                 <ul onClick={open}>Home</ul>
//                 <ul>Counselling</ul>
//                 <ul><Link to="/college">College</Link></ul>
//                 <ul>Courses</ul>
//                 <ul>Registration</ul>
//                 <ul>Profile</ul>
//             </li>
//         </div>
//     )

// }

// export default Navbar;
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="main">
      <ul className="list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/counseling">Counseling</Link></li>
        <li><Link to="/college">College</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/registration">Registration</Link></li>
        {/* <li><Link to="/profile">Profile</Link></li> */}
      </ul>
    </div>
  );
};

export default Navbar;
