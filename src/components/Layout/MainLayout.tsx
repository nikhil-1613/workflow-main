import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lockScroll, setLockScroll] = useState(false);

  // 🔒 Lock scroll for both body and main when modals open
  useEffect(() => {
    const content = document.querySelector(".content-wrapper") as HTMLElement;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
      if (content) content.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (content) content.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "";
      if (content) content.style.overflow = "auto";
    };
  }, [lockScroll]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* ⬇️ add .content-wrapper for scroll locking */}
        <main className="content-wrapper flex-1 overflow-y-auto p-6">
          {/* Pass setter down via context or props if needed */}
          <Outlet context={{ setLockScroll }} />
        </main>
      </div>
    </div>
  );
};

// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Navbar } from './Navbar';
// import { Sidebar } from './Sidebar';

// export const MainLayout: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };