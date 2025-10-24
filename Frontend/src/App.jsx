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
// import AdminDashboard from './components/AdminDashboard.jsx'
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboardHome from './admin/AdminDashboardHome.jsx'
import AdminCollegePage from './admin/CollegePage.jsx'
import AdminCoursePage from './admin/CoursePage.jsx'
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
    {/* <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/private-route" element={<PrivateRoute />} /> */}
    {/* STUDENT DASHBOARD (Protected) */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute roles={['student', 'admin']}>
          <Dashboard />
        </PrivateRoute>
      }
    />

    {/* --- ADMIN PROTECTED ROUTES (Using AdminLayout) --- */}
    <Route
      path="/admin-dashboard"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            <AdminDashboardHome />
          </AdminLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/colleges"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            <AdminCollegePage />
          </AdminLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/courses"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            <AdminCoursePage />
          </AdminLayout>
        </PrivateRoute>
      }
    />
    {/* Future Student Management Route */}
    <Route
      path="/admin/students"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            {/* Replace this with your StudentManagementPage component */}
            <AdminDashboardHome /> 
          </AdminLayout>
        </PrivateRoute>
      }
    />

    {/* Unauthorized page */}
    <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
   
    </Routes>

    </Router>
  )
  
}
export default App;