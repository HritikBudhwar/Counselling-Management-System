// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import './App.css'
// import Navbar from './Navbar/Navbar.jsx'
// import CollegePage from './college/collegeList.jsx'
// import Home from './HomePage/Home.jsx'
// import Counseling from './Counseling/Counseling.jsx'
// import Registration from "./Registration/Registration.jsx";
// import Courses from './Courses/Courses.jsx'
// import Login from './authentication/login.jsx'
// import Signup from './authentication/signup.jsx'
// import Dashboard from "./authentication/Dashboard.jsx";
// // import AdminDashboard from './components/AdminDashboard.jsx'
// import PrivateRoute from "./components/PrivateRoute.jsx";
// import AdminLayout from './admin/AdminLayout.jsx'
// import AdminDashboardHome from './admin/AdminDashboardHome.jsx'
// import AdminCollegePage from './admin/CollegePage.jsx'
// import AdminCoursePage from './admin/CoursePage.jsx'
// import CounselingSetupPage from "./admin/CounselingSetupPage.jsx";
// import AllocationPage from "./admin/AllocationPage.jsx";
// import StudentProfileForm from "./Student/StudenProfileForm.jsx";
// import StudentMarksForm from "./Student/StudentMarksForm.jsx";
// import StudentPreferenceForm from "./Student/StudentPreferenceForm.jsx";
// import StudentProfilePage from "./Student/StudentProfilePage.jsx";
// const App=()=>{
//   return(
//     <Router>
//     <Navbar/>
//     <Routes>
//     <Route path="/" element={<Home/>}/>
//     <Route path="/college" element={<CollegePage />} />
//     <Route path="/courses" element={<Courses />} />
//     <Route path="/counseling" element={<Counseling />} />
//     <Route path="/registration" element={<Registration />} />
//     <Route path="/login" element={<Login />} />
//     <Route path="/signup" element={<Signup />} />
//     {/* <Route path="/dashboard" element={<Dashboard />} />
//     <Route path="/admin-dashboard" element={<AdminDashboard />} />
//     <Route path="/private-route" element={<PrivateRoute />} /> */}
//     {/* STUDENT DASHBOARD (Protected) */}
//     <Route
//       path="/dashboard"
//       element={
//         <PrivateRoute roles={['student', 'admin']}>
//           <Dashboard />
//         </PrivateRoute>
//       }
//     />
//     <Route index element={<StudentProfileForm />} /> 
      
//       {/* 🚨 Step 2: Marks Submission */}
//       <Route path="marks" element={<StudentMarksForm />} />
      
//       {/* 🚨 Step 3: Preference Selection */}
//       <Route path="preferences" element={<StudentPreferenceForm />} />
      
//       {/* 🚨 Step 4: Profile/Results View */}
//       <Route path="profile" element={<StudentProfilePage />} />

//       {/* Future route: Settings */}
//       <Route path="settings" element={<div>Student Settings Page (Logout here)</div>} />

//     {/* --- ADMIN PROTECTED ROUTES (Using AdminLayout) --- */}
//     <Route
//       path="/admin-dashboard"
//       element={
//         <PrivateRoute roles={['admin']}>
//           <AdminLayout>
//             <AdminDashboardHome />
//           </AdminLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/colleges"
//       element={
//         <PrivateRoute roles={['admin']}>
//           <AdminLayout>
//             <AdminCollegePage />
//           </AdminLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/courses"
//       element={
//         <PrivateRoute roles={['admin']}>
//           <AdminLayout>
//             <AdminCoursePage />
//           </AdminLayout>
//         </PrivateRoute>
//       }
//     />
//     {/* Future Student Management Route */}
//     <Route
//       path="/admin/students"
//       element={
//         <PrivateRoute roles={['admin']}>
//           <AdminLayout>
//             {/* Replace this with your StudentManagementPage component */}
//             <AdminDashboardHome /> 
//           </AdminLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Unauthorized page */}
//     <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

//     <Route 
//         path="/admin/counseling"
//         element={
//             <PrivateRoute roles={['admin']}>
//                 <AdminLayout>
//                     <CounselingSetupPage />
//                 </AdminLayout>
//             </PrivateRoute>
//         }
//     />

//       <Route 
//         path="/admin/allocation"
//         element={
//             <PrivateRoute roles={['admin']}>
//                 <AdminLayout>
//                     <AllocationPage />
//                 </AdminLayout>
//             </PrivateRoute>
//         }
//     />
   
//     </Routes>

//     </Router>
//   )
  
// }
// export default App;



import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import './App.css'

// --- GENERAL & PUBLIC COMPONENTS ---
import Navbar from './Navbar/Navbar.jsx'
import Home from './HomePage/Home.jsx'
import CollegePagePublic from './college/collegeList.jsx'
import CoursesPublic from './Courses/Courses.jsx'
import Counseling from './Counseling/Counseling.jsx'
import Registration from "./Registration/Registration.jsx";
import Login from './authentication/login.jsx'
import Signup from './authentication/signup.jsx'
import PrivateRoute from "./components/PrivateRoute.jsx";

// --- ADMIN COMPONENTS ---
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboardHome from './admin/AdminDashboardHome.jsx'
import AdminCollegePage from './admin/CollegePage.jsx'
import AdminCoursePage from './admin/CoursePage.jsx'
import CounselingSetupPage from "./admin/CounselingSetupPage.jsx";
import AllocationPage from "./admin/AllocationPage.jsx";

// --- STUDENT COMPONENTS (Assuming path './Student/...') ---
import StudentProfileForm from "./Student/StudenProfileForm.jsx";
import StudentMarksForm from "./Student/StudentMarksForm.jsx";
import StudentPreferenceForm from "./Student/StudentPreferenceForm.jsx";
import StudentProfilePage from "./Student/StudentProfilePage.jsx";
import StudentSidebar from "./Student/StudentSidebar.jsx";
import EligibilitySetupPage from "./admin/EligibilitySetupPage.jsx";

// --- Student Layout Wrapper ---
// This component provides the sidebar and renders the step component in the main area
const StudentDashboardLayout = () => (
  <div className="student-dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
    <StudentSidebar />
    <main className="student-content-main" style={{ flexGrow: 1, padding: '20px' }}>
      {/* 🚨 Outlet renders the matched child component (ProfileForm, MarksForm, etc.) */}
      <Outlet /> 
    </main>
  </div>
);


const App=()=>{
  return(
    <Router>
    <Navbar/>
    <Routes>
    {/* --- PUBLIC ROUTES --- */}
    <Route path="/" element={<Home/>}/>
    <Route path="/college" element={<CollegePagePublic />} />
    <Route path="/courses" element={<CoursesPublic />} />
    <Route path="/counseling" element={<Counseling />} />
    <Route path="/registration" element={<Registration />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    {/* Unauthorized page */}
    <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />


    {/* --- STUDENT DASHBOARD (Protected & Nested Flow) --- */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute roles={['student']}>
          {/* 🚨 Use the Layout Component here */}
          <StudentDashboardLayout /> 
        </PrivateRoute>
      }
    >
      {/* 🚨 Nested Routes (Children of /dashboard) */}
      
      {/* Step 1 (Default path for /dashboard): Basic Profile */}
      <Route index element={<StudentProfileForm />} /> 
      
      {/* Step 2: Marks Submission */}
      <Route path="marks" element={<StudentMarksForm />} />
      
      {/* Step 3: Preference Selection */}
      <Route path="preferences" element={<StudentPreferenceForm />} />
      
      {/* Step 4: Profile/Results View */}
      <Route path="profile" element={<StudentProfilePage />} />

      {/* Future route: Settings */}
      <Route path="settings" element={<div>Student Settings Page (Logout here)</div>} />

    </Route>


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
    <Route
      path="/admin/counseling"
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            <CounselingSetupPage />
          </AdminLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/allocate" 
      element={
        <PrivateRoute roles={['admin']}>
          <AdminLayout>
            <AllocationPage />
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
            {/* Placeholder */}
            <AdminDashboardHome /> 
          </AdminLayout>
        </PrivateRoute>
      }
    />
    <Route
        path="/admin/eligibility" // <-- NEW PATH
        element={
            <PrivateRoute roles={['admin']}>
                <AdminLayout>
                    <EligibilitySetupPage />
                </AdminLayout>
            </PrivateRoute>
        }
    />
    </Routes>
    </Router>
  )
}
export default App;