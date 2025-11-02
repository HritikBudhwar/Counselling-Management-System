// // import { Link } from "react-router-dom";
// // import "./Navbar.css";

// // const Navbar = () => {
// //   return (
// //     <div className="main">
// //       <ul className="list">
// //         <li><Link to="/">Home</Link></li>
// //         <li><Link to="/counseling">Counseling</Link></li>
// //         <li><Link to="/college">College</Link></li>
// //         <li><Link to="/courses">Courses</Link></li>
// //         <li><Link to="/registration">Registration</Link></li>
// //         {/* <li><Link to="/profile">Profile</Link></li> */}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Navbar;



// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//     // 1. Get session data from localStorage
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));
    
//     // Determine the user's dashboard path
//     const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';

//     const handleLogout = () => {
//         // Clear authentication tokens and user data
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login'); // Redirect to login page
//     };

//     // 2. Define the links that are visible to everyone
//     const publicLinks = (
//         <>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/counseling">Counseling</Link></li>
//             <li><Link to="/college">College</Link></li>
//             <li><Link to="/courses">Courses</Link></li>
//         </>
//     );

//     // 3. Render content based on authentication status
//     return (
//         <div className="main">
//             <ul className="list">
//                 {publicLinks}
                
//                 {/* --- DYNAMIC SECTION --- */}
                
//                 {!token ? (
//                     // STATE 1: LOGGED OUT - Show Registration and Login links
//                     <>
//                         <li className="right-nav"><Link to="/registration">Registration</Link></li>
//                         <li className="right-nav"><Link to="/login" className="login-btn">Sign In</Link></li>
//                     </>
//                 ) : (
//                     // STATE 2: LOGGED IN - Show Dashboard and Logout options
//                     <div className="user-nav-group">
//                         <li className="welcome-item">Hello, {user?.username || 'User'}!</li>
//                         <li><Link to={dashboardPath} className="dashboard-btn">Dashboard</Link></li>
//                         <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
//                     </div>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default Navbar;