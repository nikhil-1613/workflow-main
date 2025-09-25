import React from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiClipboard, FiCalendar, FiDollarSign,
  FiTrendingUp, FiTarget, FiClock,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { dashboardKPIs, } from '../data/dummyData';
import PerformanceChart from './PerformanceChart';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col justify-between"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
        {change && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <FiTrendingUp size={14} className="mr-1" />
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    const baseStats = [
      {
        title: 'Active Projects',
        value: dashboardKPIs.activeProjects,
        icon: FiClipboard,
        color: 'bg-indigo-500',
        change: '+2 this week'
      },
      {
        title: 'Completed Tasks',
        value: dashboardKPIs.completedTasks,
        icon: FiTarget,
        color: 'bg-green-500',
        change: '+15 this week'
      },
      {
        title: 'Pending Time Off',
        value: dashboardKPIs.pendingTimeoff,
        icon: FiCalendar,
        color: 'bg-yellow-500'
      },
      {
        title: 'Hours This Month',
        value: '168h',
        icon: FiClock,
        color: 'bg-purple-500',
        change: '+8h from last month'
      }
    ];

    if (user?.role === 'HR' || user?.role === 'Manager') {
      baseStats.push(
        {
          title: 'Total Employees',
          value: dashboardKPIs.totalEmployees,
          icon: FiUsers,
          color: 'bg-blue-500',
          change: '+5 this month'
        },
        {
          title: 'Monthly Budget',
          value: `$${dashboardKPIs.monthlyBudget.toLocaleString()}`,
          icon: FiDollarSign,
          color: 'bg-red-500'
        }
      );
    }

    return baseStats;
  };

  const recentActivities = [
    { id: 1, action: 'Completed task: Q4 Report', time: '2 hours ago', type: 'task' },
    { id: 2, action: 'New project assigned: Mobile App Redesign', time: '4 hours ago', type: 'project' },
    { id: 3, action: 'Time off approved: Feb 15-19', time: '1 day ago', type: 'timeoff' },
    { id: 4, action: 'Expense submitted: Travel costs', time: '2 days ago', type: 'expense' }
  ];

  const upcomingDeadlines = [
    { id: 1, task: 'Complete Q4 Report', due: 'Jan 15, 2024', priority: 'high' },
    { id: 2, task: 'Update Client Database', due: 'Jan 20, 2024', priority: 'medium' },
    { id: 3, task: 'Team Meeting Preparation', due: 'Jan 25, 2024', priority: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-indigo-100">Here's what's happening with your workforce today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {getStatsForRole().map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-white font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-800 dark:text-white font-medium">{deadline.task}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{deadline.due}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${deadline.priority === 'high'
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : deadline.priority === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Progress Chart Placeholder */}
      <PerformanceChart />
    </div>
  );
};
