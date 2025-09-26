import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { dummyTimeoffRequests } from '../data/dummyData';

interface TimeOffRequest {
  id: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const TimeOff: React.FC = () => {
  const { user } = useAuth();
  const [timeoffRequests, setTimeoffRequests] = useState<TimeOffRequest[]>(dummyTimeoffRequests);

  const [newRequest, setNewRequest] = useState({
    type: 'vacation' as 'vacation' | 'sick' | 'personal',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Helper to format date as dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'sick': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'personal': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Summary data
  const pendingRequests = timeoffRequests.filter(req => req.status === 'pending').length;
  const approvedRequests = timeoffRequests.filter(req => req.status === 'approved').length;
  const totalDaysThisYear = 25; // Can also be dynamic
  const usedDays = timeoffRequests
    .filter(req => req.status === 'approved')
    .reduce((acc, r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
      return acc + diff;
    }, 0);

  // Add new request
  const submitRequest = () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) return;
    const employeeName = user?.name || 'Unknown';
    const request: TimeOffRequest = {
      id: Date.now().toString(),
      employeeName,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      status: 'pending',
    };
    setTimeoffRequests([request, ...timeoffRequests]);
    setNewRequest({ type: 'vacation', startDate: '', endDate: '', reason: '' });
  };

  // Approve/Reject
  const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setTimeoffRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
          Time Off Management
        </motion.h1>
        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
          <FiPlus size={18} />
          <span>Request Time Off</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Days', value: totalDaysThisYear, icon: <FiCalendar className="text-indigo-500 mr-3" size={24} /> },
          { label: 'Used Days', value: usedDays, icon: <FiCheck className="text-green-500 mr-3" size={24} /> },
          { label: 'Remaining', value: totalDaysThisYear - usedDays, icon: <FiCalendar className="text-blue-500 mr-3" size={24} /> },
          { label: 'Pending', value: pendingRequests, icon: <FiCalendar className="text-yellow-500 mr-3" size={24} /> }
        ].map((card, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (idx + 1) }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">{card.icon}<div><p className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p></div></div>
          </motion.div>
        ))}
      </div>

      {/* New Request Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Request Time Off</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select value={newRequest.type} onChange={e => setNewRequest({ ...newRequest, type: e.target.value as 'vacation' | 'sick' | 'personal' })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="vacation">Vacation</option>
              <option value="sick">Sick</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input type="date" value={newRequest.startDate} onChange={e => setNewRequest({ ...newRequest, startDate: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input type="date" value={newRequest.endDate} onChange={e => setNewRequest({ ...newRequest, endDate: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
            <input type="text" placeholder="Brief reason" value={newRequest.reason} onChange={e => setNewRequest({ ...newRequest, reason: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex items-end">
            <button onClick={submitRequest} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">Submit Request</button>
          </div>
        </div>
      </motion.div>

      {/* Time Off Requests Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Time Off Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                {(user?.role === 'Manager' || user?.role === 'HR') && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {timeoffRequests.map((request) => (
                <motion.tr key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.employeeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>{request.type}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(request.startDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(request.endDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>{request.status}</span></td>
                  {(user?.role === 'Manager' || user?.role === 'HR') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button onClick={() => updateRequestStatus(request.id, 'approved')} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"><FiCheck size={16} /></button>
                          <button onClick={() => updateRequestStatus(request.id, 'rejected')} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><FiX size={16} /></button>
                        </div>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiCalendar, FiPlus, FiCheck, FiX } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';
// import { dummyTimeoffRequests } from '../data/dummyData';

// interface TimeOffRequest {
//   id: string;
//   employeeName: string;
//   type: 'vacation' | 'sick' | 'personal';
//   startDate: string;
//   endDate: string;
//   reason: string;
//   status: 'pending' | 'approved' | 'rejected';
// }

// export const TimeOff: React.FC = () => {
//   const { user } = useAuth();
//   const [timeoffRequests, setTimeoffRequests] = useState<TimeOffRequest[]>(dummyTimeoffRequests);

//   const [newRequest, setNewRequest] = useState({
//     type: 'vacation' as 'vacation' | 'sick' | 'personal',
//     startDate: '',
//     endDate: '',
//     reason: '',
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'vacation': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
//       case 'sick': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
//       case 'personal': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   // Summary data
//   const pendingRequests = timeoffRequests.filter(req => req.status === 'pending').length;
//   const approvedRequests = timeoffRequests.filter(req => req.status === 'approved').length;
//   const totalDaysThisYear = 25; // Can also be dynamic
//   const usedDays = timeoffRequests
//     .filter(req => req.status === 'approved')
//     .reduce((acc, r) => {
//       const start = new Date(r.startDate);
//       const end = new Date(r.endDate);
//       const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
//       return acc + diff;
//     }, 0);

//   // Add new request
//   const submitRequest = () => {
//     if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) return;
//     const employeeName = user?.name || 'Unknown';
//     const request: TimeOffRequest = {
//       id: Date.now().toString(),
//       employeeName,
//       type: newRequest.type,
//       startDate: newRequest.startDate,
//       endDate: newRequest.endDate,
//       reason: newRequest.reason,
//       status: 'pending',
//     };
//     setTimeoffRequests([request, ...timeoffRequests]);
//     setNewRequest({ type: 'vacation', startDate: '', endDate: '', reason: '' });
//   };

//   // Approve/Reject
//   const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
//     setTimeoffRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
//           Time Off Management
//         </motion.h1>
//         <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
//           <FiPlus size={18} />
//           <span>Request Time Off</span>
//         </motion.button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {[
//           { label: 'Total Days', value: totalDaysThisYear, icon: <FiCalendar className="text-indigo-500 mr-3" size={24} /> },
//           { label: 'Used Days', value: usedDays, icon: <FiCheck className="text-green-500 mr-3" size={24} /> },
//           { label: 'Remaining', value: totalDaysThisYear - usedDays, icon: <FiCalendar className="text-blue-500 mr-3" size={24} /> },
//           { label: 'Pending', value: pendingRequests, icon: <FiCalendar className="text-yellow-500 mr-3" size={24} /> }
//         ].map((card, idx) => (
//           <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (idx + 1) }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center">{card.icon}<div><p className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p></div></div>
//           </motion.div>
//         ))}
//       </div>


//       {/* New Request Form */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Request Time Off</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
//             <select value={newRequest.type} onChange={e => setNewRequest({ ...newRequest, type: e.target.value as 'vacation' | 'sick' | 'personal' })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
//               <option value="vacation">Vacation</option>
//               <option value="sick">Sick</option>
//               <option value="personal">Personal</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
//             <input type="date" value={newRequest.startDate} onChange={e => setNewRequest({ ...newRequest, startDate: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
//             <input type="date" value={newRequest.endDate} onChange={e => setNewRequest({ ...newRequest, endDate: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
//             <input type="text" placeholder="Brief reason" value={newRequest.reason} onChange={e => setNewRequest({ ...newRequest, reason: e.target.value })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
//           </div>
//           <div className="flex items-end">
//             <button onClick={submitRequest} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">Submit Request</button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Time Off Requests Table */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Time Off Requests</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
//                 {(user?.role === 'Manager' || user?.role === 'HR') && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {timeoffRequests.map((request) => (
//                 <motion.tr key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{request.employeeName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>{request.type}</span></td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(request.startDate).toLocaleDateString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(request.endDate).toLocaleDateString()}</td>
//                   <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{request.reason}</td>
//                   <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>{request.status}</span></td>
//                   {(user?.role === 'Manager' || user?.role === 'HR') && (
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {request.status === 'pending' && (
//                         <div className="flex space-x-2">
//                           <button onClick={() => updateRequestStatus(request.id, 'approved')} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"><FiCheck size={16} /></button>
//                           <button onClick={() => updateRequestStatus(request.id, 'rejected')} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><FiX size={16} /></button>
//                         </div>
//                       )}
//                     </td>
//                   )}
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//     </div>
//   );
// };
