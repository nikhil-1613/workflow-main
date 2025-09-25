import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiClock, FiDollarSign, FiCalendar, FiUsers, 
  FiClipboard, FiTarget, FiBarChart, FiX, FiUser, FiBriefcase
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome, roles: ['Employee', 'Manager', 'HR'] },
  { path: '/timesheets', label: 'Timesheets', icon: FiClock, roles: ['Employee', 'Manager', 'HR'] },
  { path: '/expenses', label: 'Expenses', icon: FiDollarSign, roles: ['Employee', 'Manager', 'HR'] },
  { path: '/time-off', label: 'Time Off', icon: FiCalendar, roles: ['Employee', 'Manager', 'HR'] },
  { path: '/payroll', label: 'Payroll', icon: FiBarChart, roles: ['HR'] },
  { path: '/substitute-management', label: 'Substitute Management', icon: FiUsers, roles: ['Manager', 'HR'] },
  { path: '/project-assignments', label: 'Project Assignments', icon: FiClipboard, roles: ['Employee', 'Manager', 'HR'] },
  { path: '/task-tracking', label: 'Task Tracking', icon: FiTarget, roles: ['Employee', 'Manager', 'HR'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const isDesktop = window.innerWidth >= 768;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen || isDesktop ? "open" : "closed"}
        className={`fixed md:static top-0 left-0 h-full w-64 border-r border-gray-700 z-50 flex flex-col
          ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="font-bold text-lg">WorkForce</h2>
            <div className="flex items-center gap-2 mt-1">
              <FiBriefcase className="text-indigo-500" />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {user?.role}
              </p>
            </div>
          </div>
          {!isDesktop && (
            <button onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}>
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <FiUser className={isDarkMode ? 'text-white' : 'text-black'} size={30}/>
            <div className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
              <p>Logged in as</p>
              <p className={isDarkMode ? 'text-white font-medium' : 'font-medium'}>
                {user?.name}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiHome, FiClock, FiDollarSign, FiCalendar, FiUsers, 
//   FiClipboard, FiTarget, FiBarChart , FiX 
// } from 'react-icons/fi';
// import { useAuth } from '../../contexts/AuthContext';
// import { useTheme } from '../../contexts/ThemeContext'; 

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface MenuItem {
//   path: string;
//   label: string;
//   icon: React.ComponentType<any>;
//   roles: string[];
// }

// const menuItems: MenuItem[] = [
//   { path: '/dashboard', label: 'Dashboard', icon: FiHome, roles: ['Employee', 'Manager', 'HR'] },
//   { path: '/timesheets', label: 'Timesheets', icon: FiClock, roles: ['Employee', 'Manager', 'HR'] },
//   { path: '/expenses', label: 'Expenses', icon: FiDollarSign, roles: ['Employee', 'Manager', 'HR'] },
//   { path: '/time-off', label: 'Time Off', icon: FiCalendar, roles: ['Employee', 'Manager', 'HR'] },
//   { path: '/payroll', label: 'Payroll', icon: FiBarChart, roles: ['HR'] },
//   { path: '/substitute-management', label: 'Substitute Management', icon: FiUsers, roles: ['Manager', 'HR'] },
//   { path: '/project-assignments', label: 'Project Assignments', icon: FiClipboard, roles: ['Employee', 'Manager', 'HR'] },
//   { path: '/task-tracking', label: 'Task Tracking', icon: FiTarget, roles: ['Employee', 'Manager', 'HR'] },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const { user } = useAuth();
//   const { isDarkMode } = useTheme(); // <-- get dark mode state

//   const filteredMenuItems = menuItems.filter(item => 
//     user && item.roles.includes(user.role)
//   );

//   const sidebarVariants = {
//     open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
//     closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
//   };

//   const isDesktop = window.innerWidth >= 768;

//   return (
//     <>
//       {/* Mobile overlay */}
//       <AnimatePresence>
//         {isOpen && !isDesktop && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={onClose}
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <motion.aside
//         variants={sidebarVariants}
//         animate={isOpen || isDesktop ? "open" : "closed"}
//         className={`fixed md:static top-0 left-0 h-full w-64 border-r border-gray-700 z-50 flex flex-col
//           ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-700">
//           <div>
//             <h2 className="font-bold text-lg">WorkForce</h2>
//             <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{user?.role}</p>
//           </div>
//           {!isDesktop && (
//             <button onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}>
//               <FiX size={20} />
//             </button>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           {filteredMenuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => !isDesktop && onClose()}
//                 className={({ isActive }) =>
//                   `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
//                     isActive
//                       ? 'bg-indigo-600 text-white'
//                       : isDarkMode
//                         ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                         : 'text-gray-700 hover:bg-gray-100'
//                   }`
//                 }
//               >
//                 <Icon size={20} />
//                 <span className="font-medium">{item.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="p-6 border-t border-gray-700">
//           <div className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
//             <p>Logged in as</p>
//             <p className={isDarkMode ? 'text-white font-medium' : 'font-medium'}>{user?.name}</p>
//           </div>
//         </div>
//       </motion.aside>
//     </>
//   );
// };
