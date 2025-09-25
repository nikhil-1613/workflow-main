import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiPlus, FiDownload } from 'react-icons/fi';

interface PayrollEntry {
  id: string;
  employeeName: string;
  position: string;
  salary: number;
  hoursWorked: number;
  overtime: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'processed' | 'pending' | 'approved';
}

export const Payroll: React.FC = () => {
  const [payrollEntries] = useState<PayrollEntry[]>([
    {
      id: '1',
      employeeName: 'John Smith',
      position: 'Software Developer',
      salary: 75000,
      hoursWorked: 168,
      overtime: 8,
      grossPay: 6250,
      deductions: 1250,
      netPay: 5000,
      status: 'processed'
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      position: 'Project Manager',
      salary: 85000,
      hoursWorked: 160,
      overtime: 0,
      grossPay: 7083,
      deductions: 1417,
      netPay: 5666,
      status: 'approved'
    },
    {
      id: '3',
      employeeName: 'Mike Wilson',
      position: 'HR Specialist',
      salary: 60000,
      hoursWorked: 160,
      overtime: 4,
      grossPay: 5000,
      deductions: 1000,
      netPay: 4000,
      status: 'pending'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'approved': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const totalPayroll = payrollEntries.reduce((sum, entry) => sum + entry.netPay, 0);
  const totalEmployees = payrollEntries.length;
  const pendingPayroll = payrollEntries.filter(entry => entry.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          Payroll Management
        </motion.h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <FiDownload size={18} />
            <span>Export</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <FiPlus size={18} />
            <span>Add Employee</span>
          </motion.button>
        </div>
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
            <FiDollarSign className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">${totalPayroll.toLocaleString()}</p>
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
            <FiUsers className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalEmployees}</p>
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
            <FiDollarSign className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingPayroll}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payroll Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Employee Payroll - January 2024</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrollEntries.map((entry) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.employeeName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${entry.salary.toLocaleString()}/year
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.hoursWorked}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.overtime}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${entry.grossPay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${entry.deductions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${entry.netPay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payroll Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <div className="font-medium text-gray-800 dark:text-white">Process Monthly Payroll</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Generate and process payroll for all employees</div>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <div className="font-medium text-gray-800 dark:text-white">Generate Pay Stubs</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Create and send pay stubs to employees</div>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <div className="font-medium text-gray-800 dark:text-white">Tax Reporting</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Generate tax reports and forms</div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payroll Calendar</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="font-medium text-blue-800 dark:text-blue-200">Next Payroll: Jan 31, 2024</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">Monthly payroll processing date</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="font-medium text-green-800 dark:text-green-200">Tax Deadline: Feb 15, 2024</div>
              <div className="text-sm text-green-600 dark:text-green-300">Quarterly tax filing deadline</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="font-medium text-yellow-800 dark:text-yellow-200">W-2 Forms: Jan 31, 2024</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-300">Annual W-2 distribution deadline</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};