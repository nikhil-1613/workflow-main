import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiLogOut, FiMenu } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiMenu className="text-gray-600 dark:text-gray-300" size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Workforce Management
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-medium">{user?.name}</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isDarkMode ? (
            <FiSun className="text-yellow-500" size={18} />
          ) : (
            <FiMoon className="text-indigo-600" size={18} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <FiLogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};