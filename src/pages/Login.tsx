import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { testUsers } from '../data/dummyData'; // make sure this import is correct

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // find user in our dummy data
    const foundUser = testUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      setError('User not found.');
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Always use the real role from our dummy data
    const success = login(foundUser.email, password, foundUser.role);

    if (!success) {
      setError('Invalid credentials. Use password123 for any test account.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FiLogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';

// export const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('Employee');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const { login, isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Auto-detect role from email
//     let detectedRole = 'Employee';
//     if (email.toLowerCase().includes('manager')) detectedRole = 'Manager';
//     if (email.toLowerCase().includes('hr')) detectedRole = 'HR';
//     setRole(detectedRole);

//     // Simulate loading delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const success = login(email, password, detectedRole);

//     if (!success) {
//       setError('Invalid credentials. Use password123 for any test account.');
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <motion.h1
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
//           >
//             Welcome Back
//           </motion.h1>
//           <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Email
//             </label>
//             <div className="relative">
//               <FiUser className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <FiLock className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//           </div>

//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
//             >
//               {error}
//             </motion.div>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <>
//                 <FiLogIn size={18} />
//                 <span>Sign In</span>
//               </>
//             )}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';

// export const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('Employee');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const { login, isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Simulate loading delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const success = login(email, password, role);
    
//     if (!success) {
//       setError('Invalid credentials. Use password123 for any test account.');
//     }
    
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <motion.h1
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
//           >
//             Welcome Back
//           </motion.h1>
//           <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Email
//             </label>
//             <div className="relative">
//               <FiUser className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <FiLock className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Role
//             </label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//             >
//               <option value="Employee">Employee</option>
//               <option value="Manager">Manager</option>
//               <option value="HR">HR</option>
//             </select>
//           </div>

//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
//             >
//               {error}
//             </motion.div>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <>
//                 <FiLogIn size={18} />
//                 <span>Sign In</span>
//               </>
//             )}
//           </motion.button>
//         </form>

//         <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//           <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">Test Credentials:</p>
//           <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
//             <div>Employee: employee@test.com</div>
//             <div>Manager: manager@test.com</div>
//             <div>HR: hr@test.com</div>
//             <div className="font-medium">Password: password123</div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };