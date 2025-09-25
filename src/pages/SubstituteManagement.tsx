import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiCalendar, FiUser } from 'react-icons/fi';

interface SubstituteRequest {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  absenceDate: string;
  duration: string;
  reason: string;
  substituteName?: string;
  status: 'open' | 'assigned' | 'completed';
}

export const SubstituteManagement: React.FC = () => {
  const [substituteRequests] = useState<SubstituteRequest[]>([
    {
      id: '1',
      employeeName: 'John Smith',
      position: 'Software Developer',
      department: 'Engineering',
      absenceDate: '2024-01-20',
      duration: '3 days',
      reason: 'Sick leave',
      substituteName: 'Alice Brown',
      status: 'assigned'
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      position: 'Project Manager',
      department: 'Engineering',
      absenceDate: '2024-01-25',
      duration: '1 week',
      reason: 'Vacation',
      status: 'open'
    },
    {
      id: '3',
      employeeName: 'Mike Wilson',
      position: 'HR Specialist',
      department: 'Human Resources',
      absenceDate: '2024-01-15',
      duration: '2 days',
      reason: 'Conference',
      substituteName: 'Emma Davis',
      status: 'completed'
    }
  ]);

  const availableSubstitutes = [
    { id: '1', name: 'Alice Brown', skills: ['Development', 'Testing'] },
    { id: '2', name: 'Emma Davis', skills: ['HR', 'Recruitment'] },
    { id: '3', name: 'Robert Taylor', skills: ['Project Management', 'Planning'] },
    { id: '4', name: 'Lisa Anderson', skills: ['Marketing', 'Content'] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'assigned': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'open': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const openRequests = substituteRequests.filter(req => req.status === 'open').length;
  const assignedRequests = substituteRequests.filter(req => req.status === 'assigned').length;
  const completedRequests = substituteRequests.filter(req => req.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          Substitute Management
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>New Request</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <FiCalendar className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Open Requests</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{openRequests}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <FiUser className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Assigned</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{assignedRequests}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <FiUsers className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedRequests}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Substitute Requests */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Substitute Requests</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Substitute
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {substituteRequests.map((request) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.employeeName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {request.position} - {request.department}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(request.absenceDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.substituteName || 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Available Substitutes */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available Substitutes</h3>
            <div className="space-y-4">
              {availableSubstitutes.map((substitute) => (
                <div key={substitute.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white">{substitute.name}</div>
                  <div className="mt-1">
                    {substitute.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Request Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create Substitute Request</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee
            </label>
            <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option>John Smith</option>
              <option>Sarah Johnson</option>
              <option>Mike Wilson</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g., 3 days"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              Create Request
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};