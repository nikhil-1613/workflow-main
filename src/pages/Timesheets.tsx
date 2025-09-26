import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import SheduleModal from './SheduleModal';
import { Modal } from './Modal';
import toast, { Toaster } from 'react-hot-toast';

interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
}

export const Timesheets: React.FC = () => {
  const [entries, setEntries] = useState<TimesheetEntry[]>([
    { id: '1', date: '2024-01-10', project: 'Mobile App Redesign', hours: 8, description: 'UI mockup design and review', status: 'approved' },
    { id: '2', date: '2024-01-11', project: 'Customer Portal Enhancement', hours: 6.5, description: 'Backend API development', status: 'submitted' },
    { id: '3', date: '2024-01-12', project: 'Mobile App Redesign', hours: 7.5, description: 'Component implementation', status: 'draft' }
  ]);

  const [newEntry, setNewEntry] = useState({
    project: '',
    hours: 0,
    description: '',
    status: 'draft' as 'draft' | 'submitted' | 'approved'
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<TimesheetEntry | null>(null);

  const [isSheduleOpen, setSheduleOpen] = useState(false);

  useEffect(() => {
    if (isSheduleOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }, [isSheduleOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'submitted': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return '';
    }
  };

  const submitEntry = () => {
    if (!newEntry.project) { toast.error('Project is required'); return; }
    const entry: TimesheetEntry = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...newEntry };
    setEntries([entry, ...entries]);
    setNewEntry({ project: '', hours: 0, description: '', status: 'draft' });
    toast.success('Entry added');
  };

  const saveEdit = () => {
    if (!editingId || !editingForm) return;
    setEntries(prev => prev.map(e => e.id === editingId ? editingForm : e));
    setEditingId(null);
    setEditingForm(null);
    toast.success('Entry updated');
  };

  const cancelEdit = () => { setEditingId(null); setEditingForm(null); toast('Edit cancelled'); };
  const deleteEntry = (id: string) => { setEntries(prev => prev.filter(e => e.id !== id)); toast.success('Entry deleted'); };

  const totalWeekHours = entries.reduce((acc, e) => acc + e.hours, 0);
  const totalMonthHours = totalWeekHours;
  const overtimeHours = 8;

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header with “See My Schedules” */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
          My Timesheets
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSheduleOpen(true)}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>See My Schedules</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: 'This Week', value: totalWeekHours, iconColor: 'text-indigo-500' },
          { label: 'This Month', value: totalMonthHours, iconColor: 'text-green-500' },
          { label: 'Overtime', value: overtimeHours, iconColor: 'text-yellow-500' }]
          .map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1*(idx+1) }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <FiClock className={`${card.iconColor} mr-3`} size={24} />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}h</p>
                </div>
              </div>
            </motion.div>
        ))}
      </div>

      {/* Add Entry Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add Timesheet Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <input type="text" placeholder="Project" value={newEntry.project} onChange={e => setNewEntry({ ...newEntry, project: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          <input type="number" placeholder="Hours" value={newEntry.hours} onChange={e => setNewEntry({ ...newEntry, hours: +e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          <input type="text" placeholder="Description" value={newEntry.description} onChange={e => setNewEntry({ ...newEntry, description: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          <select value={newEntry.status} onChange={e => setNewEntry({ ...newEntry, status: e.target.value as 'draft'|'submitted'|'approved' })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white">
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
          </select>
          <button onClick={submitEntry} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 justify-center">
            <FiPlus size={18} /> Add
          </button>
        </div>
      </motion.div>

      {/* Timesheet Table with Inline Editing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>{['Date', 'Project', 'Hours', 'Description', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{new Date(entry.date).toLocaleDateString()}</td>
                {editingId === entry.id && editingForm ? (
                  <>
                    <td className="px-6 py-2"><input value={editingForm.project} onChange={e => setEditingForm({ ...editingForm, project: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" /></td>
                    <td className="px-6 py-2"><input type="number" value={editingForm.hours} onChange={e => setEditingForm({ ...editingForm, hours: +e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" /></td>
                    <td className="px-6 py-2"><input value={editingForm.description} onChange={e => setEditingForm({ ...editingForm, description: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" /></td>
                    <td className="px-6 py-2">
                      <select value={editingForm.status} onChange={e => setEditingForm({ ...editingForm, status: e.target.value as 'draft'|'submitted'|'approved' })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full">
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select>
                    </td>
                    <td className="px-6 py-2 flex space-x-2">
                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800"><FaCheck /></button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800"><FiX /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.hours}h</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{entry.description}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>{entry.status}</span></td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button onClick={() => { setEditingId(entry.id); setEditingForm({ ...entry }); }} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                      <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Schedule Modal */}
      <Modal isOpen={isSheduleOpen} onClose={() => setSheduleOpen(false)}>
        <SheduleModal isOpen={isSheduleOpen} onClose={() => setSheduleOpen(false)} />
      </Modal>
    </div>
  );
};


// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiClock, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
// import SheduleModal from './SheduleModal';
// import { Modal } from './Modal';

// interface TimesheetEntry {
//   id: string;
//   date: string;
//   project: string;
//   hours: number;
//   description: string;
//   status: 'draft' | 'submitted' | 'approved';
// }

// export const Timesheets: React.FC = () => {
//   const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
//     {
//       id: '1',
//       date: '2024-01-10',
//       project: 'Mobile App Redesign',
//       hours: 8,
//       description: 'UI mockup design and review',
//       status: 'approved',
//     },
//     {
//       id: '2',
//       date: '2024-01-11',
//       project: 'Customer Portal Enhancement',
//       hours: 6.5,
//       description: 'Backend API development',
//       status: 'submitted',
//     },
//     {
//       id: '3',
//       date: '2024-01-12',
//       project: 'Mobile App Redesign',
//       hours: 7.5,
//       description: 'Component implementation',
//       status: 'draft',
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
//   const [newEntryForm, setNewEntryForm] = useState({
//     project: '',
//     description: '',
//     hours: 0,
//     status: 'draft' as 'draft' | 'submitted' | 'approved',
//   });
//   const [isSheduleOpen, setSheduleOpen] = useState(false);

//   // lock body scroll when a modal is open (if Modal component doesn’t handle it)
//   useEffect(() => {
//     if (isModalOpen || isSheduleOpen) {
//       document.body.classList.add('overflow-hidden');
//     } else {
//       document.body.classList.remove('overflow-hidden');
//     }
//   }, [isModalOpen, isSheduleOpen]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'submitted':
//         return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       case 'draft':
//         return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//       default:
//         return '';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const d = new Date(dateString);
//     return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}/${d.getFullYear()}`;
//   };

//   const openModalForEdit = (entry: TimesheetEntry) => {
//     setEditingEntryId(entry.id);
//     setNewEntryForm({
//       project: entry.project,
//       description: entry.description,
//       hours: entry.hours,
//       status: entry.status,
//     });
//     setIsModalOpen(true);
//   };

//   const saveEntry = () => {
//     if (editingEntryId) {
//       setTimesheetEntries((prev) =>
//         prev.map((entry) =>
//           entry.id === editingEntryId
//             ? {
//                 ...entry,
//                 project: newEntryForm.project,
//                 description: newEntryForm.description,
//                 hours: newEntryForm.hours,
//                 status: newEntryForm.status,
//               }
//             : entry
//         )
//       );
//     } else {
//       const newEntry: TimesheetEntry = {
//         id: Date.now().toString(),
//         date: new Date().toISOString().split('T')[0],
//         project: newEntryForm.project || 'Untitled Project',
//         description: newEntryForm.description || 'No description',
//         hours: newEntryForm.hours || 1,
//         status: newEntryForm.status,
//       };
//       setTimesheetEntries([newEntry, ...timesheetEntries]);
//     }
//     setIsModalOpen(false);
//     setEditingEntryId(null);
//     setNewEntryForm({ project: '', description: '', hours: 0, status: 'draft' });
//   };

//   const deleteEntry = (id: string) => {
//     setTimesheetEntries((prev) => prev.filter((entry) => entry.id !== id));
//   };

//   const thisWeekHours = timesheetEntries.reduce((acc, e) => acc + e.hours, 0);
//   const thisMonthHours = thisWeekHours;
//   const overtimeHours = 8;

//   return (
//     <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 space-y-6 p-6 m-0">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Timesheets
//         </motion.h1>

//         <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => {
//               setEditingEntryId(null);
//               setIsModalOpen(true);
//             }}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//           >
//             <FiPlus size={18} />
//             <span>New Entry</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSheduleOpen(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 mt-4 md:mt-0"
//           >
//             <FiPlus size={18} />
//             <span>See My Schedules</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           { label: 'This Week', value: `${thisWeekHours}h`, color: 'text-indigo-500' },
//           { label: 'This Month', value: `${thisMonthHours}h`, color: 'text-green-500' },
//           { label: 'Overtime', value: `${overtimeHours}h`, color: 'text-yellow-500' },
//         ].map((card, i) => (
//           <motion.div
//             key={card.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 * (i + 1) }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-center">
//               <FiClock className={`${card.color} mr-3`} size={24} />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</p>
//                 <p className="text-2xl font-bold text-gray-800 dark:text-white">
//                   {card.value}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Timesheet Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Recent Entries
//           </h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 {['Date', 'Project', 'Hours', 'Description', 'Status', 'Actions'].map(
//                   (head) => (
//                     <th
//                       key={head}
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
//                     >
//                       {head}
//                     </th>
//                   )
//                 )}
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
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {formatDate(entry.date)}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {entry.project}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {entry.hours}h
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                     {entry.description}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                         entry.status
//                       )}`}
//                     >
//                       {entry.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex space-x-2">
//                     <button
//                       onClick={() => openModalForEdit(entry)}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <FiEdit2 />
//                     </button>
//                     <button
//                       onClick={() => deleteEntry(entry.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Timesheet Entry Modal using reusable Modal component */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         // title={editingEntryId ? 'Edit Timesheet Entry' : 'New Timesheet Entry'}
//         // className="max-w-md w-full"
//       >
//         <div className="space-y-3">
//           <input
//             type="text"
//             placeholder="Project"
//             value={newEntryForm.project}
//             onChange={(e) =>
//               setNewEntryForm({ ...newEntryForm, project: e.target.value })
//             }
//             className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
//           />
//           <input
//             type="text"
//             placeholder="Description"
//             value={newEntryForm.description}
//             onChange={(e) =>
//               setNewEntryForm({ ...newEntryForm, description: e.target.value })
//             }
//             className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
//           />
//           <input
//             type="number"
//             placeholder="Hours"
//             value={newEntryForm.hours}
//             onChange={(e) =>
//               setNewEntryForm({ ...newEntryForm, hours: +e.target.value })
//             }
//             className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
//           />
//           <select
//             value={newEntryForm.status}
//             onChange={(e) =>
//               setNewEntryForm({
//                 ...newEntryForm,
//                 status: e.target.value as 'draft' | 'submitted' | 'approved',
//               })
//             }
//             className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
//           >
//             <option value="draft">Draft</option>
//             <option value="submitted">Submitted</option>
//             <option value="approved">Approved</option>
//           </select>

//           <div className="flex justify-end space-x-2 pt-2">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={saveEntry}
//               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2"
//             >
//               <FiPlus /> <span>{editingEntryId ? 'Save' : 'Add'}</span>
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Schedule Modal also wrapped with reusable Modal */}
//       <Modal
//         isOpen={isSheduleOpen}
//         onClose={() => setSheduleOpen(false)}
//         // title="My Schedules"
//         // className="max-w-2xl w-full"
//       >
//         <SheduleModal isOpen={isSheduleOpen} onClose={() => setSheduleOpen(false)} />
//       </Modal>
//     </div>
//   );
// };
