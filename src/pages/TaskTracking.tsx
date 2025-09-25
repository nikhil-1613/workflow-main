import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTarget, FiPlus, FiEdit, FiCheck, FiTrash } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { dummyTasks } from "../data/dummyData";
import { toast, Toaster } from "react-hot-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
}

export const TaskTracking: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("1");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
  const [newDueDate, setNewDueDate] = useState("");

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "in-progress": return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pending": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const handleAddTask = () => {
    if (!newTitle || !newDescription || !newDueDate) {
      toast.error("Please fill all fields!");
      return;
    }
    const newTask: Task = {
      id: generateId(),
      title: newTitle,
      description: newDescription,
      status: "pending",
      priority: newPriority,
      assignedTo: newAssignedTo,
      assignedBy: user?.id || "0",
      dueDate: newDueDate,
    };
    setTasks([newTask, ...tasks]);
    setNewTitle(""); setNewDescription(""); setNewPriority("low"); setNewAssignedTo("1"); setNewDueDate("");
    setShowAddForm(false);
    toast.success("Task added!");
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Task deleted!");
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    toast.success("Task updated!");
  };

  const handleEditChange = (id: string, field: keyof Task, value: any) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleMarkCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
    toast.success("Task marked completed!");
  };

  // Summary counts
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  // Role-based filtering
  const userTasks =
    user?.role === "Employee" ? tasks.filter((t) => t.assignedTo === user?.id) : tasks;

  return (
    <div className="space-y-6 p-6">
      <Toaster />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          Task Tracking
        </motion.h1>

        {(user?.role === "Manager" || user?.role === "HR") && (
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <FiPlus size={18} />
            <span>{showAddForm ? "Close Form" : "Add Task"}</span>
          </motion.button>
        )}
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newAssignedTo}
              onChange={(e) => setNewAssignedTo(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="1">John Smith</option>
              <option value="2">Sarah Johnson</option>
              <option value="3">Mike Wilson</option>
            </select>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
          />
          <button
            onClick={handleAddTask}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Task
          </button>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiTarget className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiTarget className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{inProgressTasks}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiTarget className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedTasks}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
              <div className="flex space-x-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{task.description}</p>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div>
                <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
              </div>
              {user?.role !== "Employee" && (
                <div>
                  <span className="font-medium">Assigned To:</span> {task.assignedTo === "1" ? "John Smith" : "Unknown"}
                </div>
              )}
              <div>
                <span className="font-medium">Assigned By:</span> {task.assignedBy === "2" ? "Sarah Johnson" : "Unknown"}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days left
              </div>
              <div className="flex space-x-2">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleMarkCompleted(task.id)}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  >
                    <FiCheck size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiTarget, FiPlus, FiEdit, FiCheck } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';
// import { dummyTasks } from '../data/dummyData';

// export const TaskTracking: React.FC = () => {
//   const { user } = useAuth();
//   const [tasks] = useState(dummyTasks);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'in-progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
//       case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
//       case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   const pendingTasks = tasks.filter(t => t.status === 'pending').length;
//   const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
//   const completedTasks = tasks.filter(t => t.status === 'completed').length;

//   // Filter tasks based on user role
//   const userTasks = user?.role === 'Employee' 
//     ? tasks.filter(t => t.assignedTo === user?.id)
//     : tasks;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Task Tracking
//         </motion.h1>
//         {(user?.role === 'Manager' || user?.role === 'HR') && (
//           <motion.button
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//           >
//             <FiPlus size={18} />
//             <span>New Task</span>
//           </motion.button>
//         )}
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center">
//             <FiTarget className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center">
//             <FiTarget className="text-blue-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{inProgressTasks}</p>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center">
//             <FiTarget className="text-green-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedTasks}</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Tasks Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {userTasks.map((task, index) => (
//           <motion.div
//             key={task.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-start justify-between mb-3">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 {task.title}
//               </h3>
//               <div className="flex space-x-1">
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
//                   {task.status}
//                 </span>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
//                   {task.priority}
//                 </span>
//               </div>
//             </div>

//             <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
//               {task.description}
//             </p>

//             <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
//               <div>
//                 <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
//               </div>
//               {user?.role !== 'Employee' && (
//                 <div>
//                   <span className="font-medium">Assigned To:</span> {task.assignedTo === '1' ? 'John Smith' : 'Unknown'}
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Assigned By:</span> {task.assignedBy === '2' ? 'Sarah Johnson' : 'Unknown'}
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days left
//               </div>
//               <div className="flex space-x-2">
//                 {task.status !== 'completed' && (
//                   <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
//                     <FiCheck size={16} />
//                   </button>
//                 )}
//                 <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
//                   <FiEdit size={16} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Create Task Form - Only for Managers and HR */}
//       {(user?.role === 'Manager' || user?.role === 'HR') && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Task</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Task Title
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter task title"
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Assign To
//               </label>
//               <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
//                 <option>John Smith</option>
//                 <option>Sarah Johnson</option>
//                 <option>Mike Wilson</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Priority
//               </label>
//               <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               rows={3}
//               placeholder="Enter task description"
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
//             Create Task
//           </button>
//         </motion.div>
//       )}
//     </div>
//   );
// };