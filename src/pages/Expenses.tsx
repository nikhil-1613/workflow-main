import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiPlus, FiCreditCard } from "react-icons/fi";
import { TfiReceipt } from "react-icons/tfi";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { dummyExpenses } from "../data/dummyData";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
}

export const Expenses: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("Travel");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter((exp) => exp.status === "pending").length;
  const approvedExpenses = expenses.filter((exp) => exp.status === "approved").length;

  const handleAddExpense = () => {
    if (!newAmount || !newDescription) {
      toast.error("Amount and description are required!");
      return;
    }
    const newExp: Expense = {
      id: generateId(),
      date: new Date().toISOString(),
      category: newCategory,
      amount: parseFloat(newAmount),
      description: newDescription,
      status: "pending",
    };
    setExpenses([newExp, ...expenses]);
    setNewCategory("Travel");
    setNewAmount("");
    setNewDescription("");
    toast.success("Expense added!");
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success("Expense deleted!");
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    toast.success("Expense updated!");
  };

  const handleEditChange = (id: string, field: keyof Expense, value: any) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          Expenses
        </motion.h1>
        {/* <motion.button
          onClick={handleAddExpense}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>Add Expense</span>
        </motion.button> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiDollarSign className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TfiReceipt className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingExpenses}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiCreditCard className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{approvedExpenses}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Add Form */}
      <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Add Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option>Travel</option>
              <option>Office Supplies</option>
              <option>Meals</option>
              <option>Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddExpense}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Add Expense
            </button>
          </div>
        </div>
      </motion.div>

      {/* Expenses Table */}
      <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {editingId === exp.id ? (
                    <input
                      value={exp.category}
                      onChange={(e) => handleEditChange(exp.id, "category", e.target.value)}
                      className="border px-2 py-1"
                    />
                  ) : (
                    exp.category
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {editingId === exp.id ? (
                    <input
                      type="number"
                      value={exp.amount}
                      onChange={(e) => handleEditChange(exp.id, "amount", parseFloat(e.target.value))}
                      className="border px-2 py-1 w-20"
                    />
                  ) : (
                    `$${exp.amount.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {editingId === exp.id ? (
                    <input
                      value={exp.description}
                      onChange={(e) => handleEditChange(exp.id, "description", e.target.value)}
                      className="border px-2 py-1"
                    />
                  ) : (
                    exp.description
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === exp.id ? (
                    <select
                      value={exp.status}
                      onChange={(e) => handleEditChange(exp.id, "status", e.target.value)}
                      className={`px-2 py-1 rounded ${getStatusColor(exp.status)}`}
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  {editingId === exp.id ? (
                    <button onClick={() => handleSave(exp.id)} className="text-green-600 hover:text-green-800">
                      <FaSave />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setEditingId(exp.id)} className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

    </div>
  );
};



// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiDollarSign, FiPlus, FiCreditCard } from 'react-icons/fi';
// import { TfiReceipt } from "react-icons/tfi";
// import { useAuth } from '../contexts/AuthContext';
// import { dummyExpenses } from '../data/dummyData';

// export const Expenses: React.FC = () => {
//   const { user } = useAuth();
//   const [expenses] = useState(dummyExpenses);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   const pendingExpenses = expenses.filter(exp => exp.status === 'pending').length;
//   const approvedExpenses = expenses.filter(exp => exp.status === 'approved').length;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Expenses
//         </motion.h1>
//         <motion.button
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//         >
//           <FiPlus size={18} />
//           <span>Add Expense</span>
//         </motion.button>
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
//             <FiDollarSign className="text-indigo-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Total Expenses</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">${totalExpenses.toFixed(2)}</p>
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
//             <TfiReceipt  className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingExpenses}</p>
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
//             <FiCreditCard className="text-green-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Approved</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{approvedExpenses}</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Expenses List */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Expense Reports</h3>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {expenses.map((expense) => (
//                 <motion.tr
//                   key={expense.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {new Date(expense.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {expense.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     ${expense.amount.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {expense.description}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
//                       {expense.status}
//                     </span>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Quick Add Form */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//       >
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Add Expense</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Category
//             </label>
//             <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
//               <option>Travel</option>
//               <option>Office Supplies</option>
//               <option>Meals</option>
//               <option>Equipment</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Amount
//             </label>
//             <input
//               type="number"
//               placeholder="0.00"
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description
//             </label>
//             <input
//               type="text"
//               placeholder="Brief description"
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <div className="flex items-end">
//             <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
//               Add Expense
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };