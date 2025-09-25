import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPlay, FiPause, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
}

export const Timesheets: React.FC = () => {
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    { id: '1', date: '2024-01-10', project: 'Mobile App Redesign', hours: 8, description: 'UI mockup design and review', status: 'approved' },
    { id: '2', date: '2024-01-11', project: 'Customer Portal Enhancement', hours: 6.5, description: 'Backend API development', status: 'submitted' },
    { id: '3', date: '2024-01-12', project: 'Mobile App Redesign', hours: 7.5, description: 'Component implementation', status: 'draft' }
  ]);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [newEntryForm, setNewEntryForm] = useState({
    project: '',
    description: '',
    hours: 0,
    status: 'draft' as 'draft' | 'submitted' | 'approved',
  });

  const toggleTimer = () => setIsTimerRunning(prev => !prev);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'submitted': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  };

  const openModalForEdit = (entry: TimesheetEntry) => {
    setEditingEntryId(entry.id);
    setNewEntryForm({
      project: entry.project,
      description: entry.description,
      hours: entry.hours,
      status: entry.status,
    });
    setIsModalOpen(true);
  };

  const saveEntry = () => {
    if (editingEntryId) {
      // Edit existing entry
      setTimesheetEntries(prev => prev.map(entry =>
        entry.id === editingEntryId
          ? { ...entry, project: newEntryForm.project, description: newEntryForm.description, hours: newEntryForm.hours, status: newEntryForm.status }
          : entry
      ));
    } else {
      // Add new entry
      const newEntry: TimesheetEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        project: newEntryForm.project || 'Untitled Project',
        description: newEntryForm.description || 'No description',
        hours: newEntryForm.hours || 1,
        status: newEntryForm.status,
      };
      setTimesheetEntries([newEntry, ...timesheetEntries]);
    }

    // Close modal and reset
    setIsModalOpen(false);
    setEditingEntryId(null);
    setNewEntryForm({ project: '', description: '', hours: 0, status: 'draft' });
  };

  const deleteEntry = (id: string) => {
    setTimesheetEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Summary calculations
  const thisWeekHours = timesheetEntries.reduce((acc, e) => acc + e.hours, 0);
  const thisMonthHours = thisWeekHours;
  const overtimeHours = 8;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
          Timesheets
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingEntryId(null); setIsModalOpen(true); }}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>New Entry</span>
        </motion.button>
      </div>

      {/* Timer Widget */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Time Tracker</h3>
            <p className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatTime(currentTimer)}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTimer} className={`p-4 rounded-full ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>
            {isTimerRunning ? <FiPause size={24}/> : <FiPlay size={24}/>}
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiClock className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{thisWeekHours}h</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiClock className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{thisMonthHours}h</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiClock className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Overtime</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{overtimeHours}h</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timesheet Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {timesheetEntries.map(entry => (
                <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(entry.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.project}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.hours}h</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>{entry.status}</span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    <button onClick={() => openModalForEdit(entry)} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{editingEntryId ? 'Edit Timesheet Entry' : 'New Timesheet Entry'}</h2>
            <input type="text" placeholder="Project" value={newEntryForm.project} onChange={e => setNewEntryForm({...newEntryForm, project: e.target.value})} className="w-full mb-3 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
            <input type="text" placeholder="Description" value={newEntryForm.description} onChange={e => setNewEntryForm({...newEntryForm, description: e.target.value})} className="w-full mb-3 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
            <input type="number" placeholder="Hours" value={newEntryForm.hours} onChange={e => setNewEntryForm({...newEntryForm, hours: +e.target.value})} className="w-full mb-3 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
            <select value={newEntryForm.status} onChange={e => setNewEntryForm({...newEntryForm, status: e.target.value as 'draft' | 'submitted' | 'approved'})} className="w-full mb-4 p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg">Cancel</button>
              <button onClick={saveEntry} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2">
                <FiPlus /> <span>{editingEntryId ? 'Save' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiClock, FiPlay, FiPause, FiPlus } from 'react-icons/fi';

// interface TimesheetEntry {
//   id: string;
//   date: string;
//   project: string;
//   hours: number;
//   description: string;
//   status: 'draft' | 'submitted' | 'approved';
// }

// export const Timesheets: React.FC = () => {
//   const [timesheetEntries] = useState<TimesheetEntry[]>([
//     {
//       id: '1',
//       date: '2024-01-10',
//       project: 'Mobile App Redesign',
//       hours: 8,
//       description: 'UI mockup design and review',
//       status: 'approved'
//     },
//     {
//       id: '2',
//       date: '2024-01-11',
//       project: 'Customer Portal Enhancement',
//       hours: 6.5,
//       description: 'Backend API development',
//       status: 'submitted'
//     },
//     {
//       id: '3',
//       date: '2024-01-12',
//       project: 'Mobile App Redesign',
//       hours: 7.5,
//       description: 'Component implementation',
//       status: 'draft'
//     }
//   ]);

//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [currentTimer, setCurrentTimer] = useState(0);

//   const toggleTimer = () => {
//     setIsTimerRunning(!isTimerRunning);
//   };

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'submitted': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Timesheets
//         </motion.h1>
//         <motion.button
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//         >
//           <FiPlus size={18} />
//           <span>New Entry</span>
//         </motion.button>
//       </div>

//       {/* Timer Widget */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Time Tracker</h3>
//             <p className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
//               {formatTime(currentTimer)}
//             </p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={toggleTimer}
//             className={`p-4 rounded-full ${
//               isTimerRunning 
//                 ? 'bg-red-500 hover:bg-red-600' 
//                 : 'bg-green-500 hover:bg-green-600'
//             } text-white transition-colors`}
//           >
//             {isTimerRunning ? <FiPause size={24} /> : <FiPlay size={24} />}
//           </motion.button>
//         </div>
//         {isTimerRunning && (
//           <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
//             Working on: <span className="text-gray-800 dark:text-white font-medium">Mobile App Redesign</span>
//           </div>
//         )}
//       </motion.div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center">
//             <FiClock className="text-indigo-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">This Week</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">40h</p>
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
//             <FiClock className="text-green-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">This Month</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">168h</p>
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
//             <FiClock className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Overtime</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">8h</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Timesheet Entries */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Entries</h3>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Project
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Hours
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
//               {timesheetEntries.map((entry) => (
//                 <motion.tr
//                   key={entry.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {new Date(entry.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {entry.project}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {entry.hours}h
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {entry.description}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
//                       {entry.status}
//                     </span>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// };