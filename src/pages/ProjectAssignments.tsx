import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClipboard, FiPlus, FiEdit, FiUsers, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { dummyProjects } from '../data/dummyData';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planning';
  progress: number;
  startDate: string;
  endDate: string;
  assignedTo: string[];
}

export const ProjectAssignments: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(dummyProjects);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed',
    progress: 0,
    startDate: '',
    endDate: '',
    assignedTo: [] as string[],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'planning': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const saveProjectChanges = () => {
    if (selectedProject) {
      setProjects(prev =>
        prev.map(p => (p.id === selectedProject.id ? selectedProject : p))
      );
      setIsModalOpen(false);
      setSelectedProject(null);
    }
  };

  const createNewProject = () => {
    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
    };
    setProjects([project, ...projects]);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      progress: 0,
      startDate: '',
      endDate: '',
      assignedTo: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
          Project Assignments
        </motion.h1>
        {(user?.role === 'Manager' || user?.role === 'HR') && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus size={18} />
            <span>New Project</span>
          </motion.button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
            onClick={() => openProjectModal(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>{project.status}</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg relative">
            <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => { setIsModalOpen(false); setSelectedProject(null); }}>
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {selectedProject ? 'Edit Project' : 'New Project'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={selectedProject ? selectedProject.name : newProject.name}
                onChange={e => {
                  if (selectedProject) setSelectedProject({ ...selectedProject, name: e.target.value });
                  else setNewProject({ ...newProject, name: e.target.value });
                }}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              />

              <textarea
                placeholder="Description"
                value={selectedProject ? selectedProject.description : newProject.description}
                onChange={e => {
                  if (selectedProject) setSelectedProject({ ...selectedProject, description: e.target.value });
                  else setNewProject({ ...newProject, description: e.target.value });
                }}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={selectedProject ? selectedProject.startDate : newProject.startDate}
                    onChange={e => {
                      if (selectedProject) setSelectedProject({ ...selectedProject, startDate: e.target.value });
                      else setNewProject({ ...newProject, startDate: e.target.value });
                    }}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={selectedProject ? selectedProject.endDate : newProject.endDate}
                    onChange={e => {
                      if (selectedProject) setSelectedProject({ ...selectedProject, endDate: e.target.value });
                      else setNewProject({ ...newProject, endDate: e.target.value });
                    }}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <select
                    value={selectedProject ? selectedProject.status : newProject.status}
                    onChange={e => {
                      if (selectedProject) setSelectedProject({ ...selectedProject, status: e.target.value as any });
                      else setNewProject({ ...newProject, status: e.target.value as any });
                    }}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min={0} max={100}
                    value={selectedProject ? selectedProject.progress : newProject.progress}
                    onChange={e => {
                      const val = Number(e.target.value);
                      if (selectedProject) setSelectedProject({ ...selectedProject, progress: val });
                      else setNewProject({ ...newProject, progress: val });
                    }}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={selectedProject ? saveProjectChanges : createNewProject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                {selectedProject ? 'Save Changes' : 'Create Project'}
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
// import { FiClipboard, FiPlus, FiEdit, FiUsers } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';
// import { dummyProjects } from '../data/dummyData';

// export const ProjectAssignments: React.FC = () => {
//   const { user } = useAuth();
//   const [projects] = useState(dummyProjects);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
//       case 'in-progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
//       case 'planning': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
//       default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
//     }
//   };

//   const getProgressColor = (progress: number) => {
//     if (progress >= 75) return 'bg-green-500';
//     if (progress >= 50) return 'bg-blue-500';
//     if (progress >= 25) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   const activeProjects = projects.filter(p => p.status === 'in-progress').length;
//   const completedProjects = projects.filter(p => p.status === 'completed').length;
//   const planningProjects = projects.filter(p => p.status === 'planning').length;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Project Assignments
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
//             <span>New Project</span>
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
//             <FiClipboard className="text-blue-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Active Projects</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{activeProjects}</p>
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
//             <FiUsers className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Planning</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{planningProjects}</p>
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
//             <FiClipboard className="text-green-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedProjects}</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {projects.map((project, index) => (
//           <motion.div
//             key={project.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
//                   {project.name}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   {project.description}
//                 </p>
//               </div>
//               <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
//                 {project.status}
//               </span>
//             </div>

//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
//                 <span>Progress</span>
//                 <span>{project.progress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                 <div
//                   className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
//                   style={{ width: `${project.progress}%` }}
//                 ></div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
//               <div>
//                 <span className="font-medium">Start Date:</span>
//                 <p>{new Date(project.startDate).toLocaleDateString()}</p>
//               </div>
//               <div>
//                 <span className="font-medium">End Date:</span>
//                 <p>{new Date(project.endDate).toLocaleDateString()}</p>
//               </div>
//             </div>

//             <div className="mb-4">
//               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members:</span>
//               <div className="flex items-center space-x-2 mt-2">
//                 {project.assignedTo.slice(0, 3).map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-medium"
//                   >
//                     {i + 1}
//                   </div>
//                 ))}
//                 {project.assignedTo.length > 3 && (
//                   <div className="text-gray-400 text-sm">+{project.assignedTo.length - 3} more</div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Manager: <span className="font-medium">Sarah Johnson</span>
//               </div>
//               {(user?.role === 'Manager' || user?.role === 'HR' || user?.role === 'Employee') && (
//                 <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
//                   <FiEdit size={16} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Quick Add Project Form - Only for Managers and HR */}
//       {(user?.role === 'Manager' || user?.role === 'HR') && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Project</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Project Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter project name"
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div className="flex items-end">
//               <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
//                 Create Project
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };