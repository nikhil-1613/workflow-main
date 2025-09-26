import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/Layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Timesheets } from "./pages/Timesheets";
import { Expenses } from "./pages/Expenses";
import { TimeOff } from "./pages/TimeOff";
import { Payroll } from "./pages/Payroll";
import { SubstituteManagement } from "./pages/SubstituteManagement";
import { ProjectAssignments } from "./pages/ProjectAssignments";
import { TaskTracking } from "./pages/TaskTracking";
import { NotAuthorized } from "./pages/NotAuthorized";
import { Toaster } from "react-hot-toast"; // ✅ Import toaster
import Announcments from "./pages/Announcments";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* Protected routes inside MainLayout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="timesheets" element={<Timesheets />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="time-off" element={<TimeOff />} />
                <Route
                  path="payroll"
                  element={
                    <ProtectedRoute allowedRoles={["HR"]}>
                      <Payroll />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="substitute-management"
                  element={
                    <ProtectedRoute allowedRoles={["Manager", "HR"]}>
                      <SubstituteManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="project-assignments" element={<ProjectAssignments />} />
                <Route path="task-tracking" element={<TaskTracking />} />
                 <Route path="announcements" element={<Announcments />} />
              </Route>
            </Routes>

            {/* ✅ Toast notifications available globally */}
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import { MainLayout } from './components/Layout/MainLayout';
// import { Login } from './pages/Login';
// import { Dashboard } from './pages/Dashboard';
// import { Timesheets } from './pages/Timesheets';
// import { Expenses } from './pages/Expenses';
// import { TimeOff } from './pages/TimeOff';
// import { Payroll } from './pages/Payroll';
// import { SubstituteManagement } from './pages/SubstituteManagement';
// import { ProjectAssignments } from './pages/ProjectAssignments';
// import { TaskTracking } from './pages/TaskTracking';
// import { NotAuthorized } from './pages/NotAuthorized';

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/not-authorized" element={<NotAuthorized />} />
              
//               <Route path="/" element={
//                 <ProtectedRoute>
//                   <MainLayout />
//                 </ProtectedRoute>
//               }>
//                 <Route index element={<Navigate to="/dashboard" replace />} />
//                 <Route path="dashboard" element={<Dashboard />} />
//                 <Route path="timesheets" element={<Timesheets />} />
//                 <Route path="expenses" element={<Expenses />} />
//                 <Route path="time-off" element={<TimeOff />} />
//                 <Route path="payroll" element={
//                   <ProtectedRoute allowedRoles={['HR']}>
//                     <Payroll />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="substitute-management" element={
//                   <ProtectedRoute allowedRoles={['Manager', 'HR']}>
//                     <SubstituteManagement />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="project-assignments" element={<ProjectAssignments />} />
//                 <Route path="task-tracking" element={<TaskTracking />} />
//               </Route>
//             </Routes>
//           </div>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;