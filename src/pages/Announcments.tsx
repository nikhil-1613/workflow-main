import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'draft' | 'published';
}

// Dummy announcements
const dummyAnnouncements: Announcement[] = [
  { id: '1', title: 'Office Renovation', description: 'The 3rd floor will be renovated from 1st Feb.', date: '2024-01-25', status: 'published' },
  { id: '2', title: 'Holiday Notice', description: 'Office will remain closed on 15th Feb.', date: '2024-01-28', status: 'draft' },
  { id: '3', title: 'Team Lunch', description: 'Monthly team lunch on 5th Feb.', date: '2024-01-30', status: 'published' }
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(dummyAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '', status: 'draft' as 'draft' | 'published' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<Announcement | null>(null);

  // Helper for status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const submitAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      toast.error('Title and Description are required');
      return;
    }
    const announcement: Announcement = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newAnnouncement
    };
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', description: '', status: 'draft' });
    toast.success('Announcement added');
  };

  const saveEdit = () => {
    if (!editingId || !editingForm) return;
    setAnnouncements(prev => prev.map(a => a.id === editingId ? editingForm : a));
    setEditingId(null);
    setEditingForm(null);
    toast.success('Announcement updated');
  };

  const cancelEdit = () => { setEditingId(null); setEditingForm(null); toast('Edit cancelled'); };
  const deleteAnnouncement = (id: string) => { setAnnouncements(prev => prev.filter(a => a.id !== id)); toast.success('Announcement deleted'); };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
        Announcements
      </motion.h1>

      {/* Add Announcement Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add Announcement</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input type="text" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          <input type="text" placeholder="Description" value={newAnnouncement.description} onChange={e => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          <select value={newAnnouncement.status} onChange={e => setNewAnnouncement({ ...newAnnouncement, status: e.target.value as 'draft'|'published' })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={submitAnnouncement} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
            <FiPlus size={18} /> Add
          </button>
        </div>
      </motion.div>

      {/* Announcement Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>{['Date', 'Title', 'Description', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {announcements.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* Date in dd/mm/yyyy */}
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(a.date)}</td>

                {editingId === a.id && editingForm ? (
                  <>
                    <td className="px-6 py-2">
                      <input value={editingForm.title} onChange={e => setEditingForm({ ...editingForm, title: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" />
                    </td>
                    <td className="px-6 py-2">
                      <input value={editingForm.description} onChange={e => setEditingForm({ ...editingForm, description: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" />
                    </td>
                    <td className="px-6 py-2">
                      <select value={editingForm.status} onChange={e => setEditingForm({ ...editingForm, status: e.target.value as 'draft'|'published' })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="px-6 py-2 flex space-x-2">
                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800"><FaCheck /></button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800"><FiX /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{a.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{a.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(a.status)}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button onClick={() => { setEditingId(a.id); setEditingForm({ ...a }); }} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                      <button onClick={() => deleteAnnouncement(a.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
// import { FaCheck } from 'react-icons/fa';
// import toast, { Toaster } from 'react-hot-toast';

// interface Announcement {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   status: 'draft' | 'published';
// }

// const dummyAnnouncements: Announcement[] = [
//   { id: '1', title: 'Office Renovation', description: 'The 3rd floor will be renovated from 1st Feb.', date: '2024-01-25', status: 'published' },
//   { id: '2', title: 'Holiday Notice', description: 'Office will remain closed on 15th Feb.', date: '2024-01-28', status: 'draft' },
//   { id: '3', title: 'Team Lunch', description: 'Monthly team lunch on 5th Feb.', date: '2024-01-30', status: 'published' }
// ];

// export default function AnnouncementsPage() {
//   const [announcements, setAnnouncements] = useState<Announcement[]>(dummyAnnouncements);
//   const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '', status: 'draft' as 'draft' | 'published' });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingForm, setEditingForm] = useState<Announcement | null>(null);

//   // Helper for status badge colors
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'published': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//       default: return '';
//     }
//   };

//   const submitAnnouncement = () => {
//     if (!newAnnouncement.title || !newAnnouncement.description) {
//       toast.error('Title and Description are required');
//       return;
//     }
//     const announcement: Announcement = {
//       id: Date.now().toString(),
//       date: new Date().toISOString().split('T')[0],
//       ...newAnnouncement
//     };
//     setAnnouncements([announcement, ...announcements]);
//     setNewAnnouncement({ title: '', description: '', status: 'draft' });
//     toast.success('Announcement added');
//   };

//   const saveEdit = () => {
//     if (!editingId || !editingForm) return;
//     setAnnouncements(prev => prev.map(a => a.id === editingId ? editingForm : a));
//     setEditingId(null);
//     setEditingForm(null);
//     toast.success('Announcement updated');
//   };

//   const cancelEdit = () => { setEditingId(null); setEditingForm(null); toast('Edit cancelled'); };
//   const deleteAnnouncement = (id: string) => { setAnnouncements(prev => prev.filter(a => a.id !== id)); toast.success('Announcement deleted'); };

//   return (
//     <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <Toaster position="top-right" reverseOrder={false} />

//       {/* Header */}
//       <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
//         Announcements
//       </motion.h1>

//       {/* Add Announcement Form */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add Announcement</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//           <input type="text" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
//           <input type="text" placeholder="Description" value={newAnnouncement.description} onChange={e => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
//           <select value={newAnnouncement.status} onChange={e => setNewAnnouncement({ ...newAnnouncement, status: e.target.value as 'draft'|'published' })} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white">
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>
//           <button onClick={submitAnnouncement} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
//             <FiPlus size={18} /> Add
//           </button>
//         </div>
//       </motion.div>

//       {/* Announcement Table */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50 dark:bg-gray-700">
//             <tr>{['Date', 'Title', 'Description', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {announcements.map(a => (
//               <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                 <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{new Date(a.date).toLocaleDateString()}</td>
//                 {editingId === a.id && editingForm ? (
//                   <>
//                     <td className="px-6 py-2"><input value={editingForm.title} onChange={e => setEditingForm({ ...editingForm, title: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" /></td>
//                     <td className="px-6 py-2"><input value={editingForm.description} onChange={e => setEditingForm({ ...editingForm, description: e.target.value })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full" /></td>
//                     <td className="px-6 py-2">
//                       <select value={editingForm.status} onChange={e => setEditingForm({ ...editingForm, status: e.target.value as 'draft'|'published' })} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full">
//                         <option value="draft">Draft</option>
//                         <option value="published">Published</option>
//                       </select>
//                     </td>
//                     <td className="px-6 py-2 flex space-x-2">
//                       <button onClick={saveEdit} className="text-green-600 hover:text-green-800"><FaCheck /></button>
//                       <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800"><FiX /></button>
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{a.title}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{a.description}</td>
//                     <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(a.status)}`}>{a.status}</span></td>
//                     <td className="px-6 py-4 text-sm flex space-x-2">
//                       <button onClick={() => { setEditingId(a.id); setEditingForm({ ...a }); }} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
//                       <button onClick={() => deleteAnnouncement(a.id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>
//     </div>
//   );
// }
