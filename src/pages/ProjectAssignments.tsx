import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { dummyProjects } from '../data/dummyData';
import { Modal } from './Modal'; 

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
    setIsModalOpen(false);
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
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
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

      {/* ✅ Reusable Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}>
        <h2 className="text-xl font-semibold mb-4">
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
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={selectedProject ? selectedProject.description : newProject.description}
            onChange={e => {
              if (selectedProject) setSelectedProject({ ...selectedProject, description: e.target.value });
              else setNewProject({ ...newProject, description: e.target.value });
            }}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={selectedProject ? selectedProject.startDate : newProject.startDate}
                onChange={e => {
                  if (selectedProject) setSelectedProject({ ...selectedProject, startDate: e.target.value });
                  else setNewProject({ ...newProject, startDate: e.target.value });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={selectedProject ? selectedProject.endDate : newProject.endDate}
                onChange={e => {
                  if (selectedProject) setSelectedProject({ ...selectedProject, endDate: e.target.value });
                  else setNewProject({ ...newProject, endDate: e.target.value });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                value={selectedProject ? selectedProject.status : newProject.status}
                onChange={e => {
                  if (selectedProject) setSelectedProject({ ...selectedProject, status: e.target.value as any });
                  else setNewProject({ ...newProject, status: e.target.value as any });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Progress (%)</label>
              <input
                type="number"
                min={0} max={100}
                value={selectedProject ? selectedProject.progress : newProject.progress}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (selectedProject) setSelectedProject({ ...selectedProject, progress: val });
                  else setNewProject({ ...newProject, progress: val });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={selectedProject ? saveProjectChanges : createNewProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg"
          >
            {selectedProject ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiPlus, FiX } from 'react-icons/fi';
// import { useAuth } from '../contexts/AuthContext';
// import { dummyProjects } from '../data/dummyData';

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   status: 'completed' | 'in-progress' | 'planning';
//   progress: number;
//   startDate: string;
//   endDate: string;
//   assignedTo: string[];
// }

// export const ProjectAssignments: React.FC = () => {
//   const { user } = useAuth();
//   const [projects, setProjects] = useState<Project[]>(dummyProjects);

//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [newProject, setNewProject] = useState({
//     name: '',
//     description: '',
//     status: 'planning' as 'planning' | 'in-progress' | 'completed',
//     progress: 0,
//     startDate: '',
//     endDate: '',
//     assignedTo: [] as string[],
//   });

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

//   const openProjectModal = (project: Project) => {
//     setSelectedProject(project);
//     setIsModalOpen(true);
//   };

//   const saveProjectChanges = () => {
//     if (selectedProject) {
//       setProjects(prev =>
//         prev.map(p => (p.id === selectedProject.id ? selectedProject : p))
//       );
//       setIsModalOpen(false);
//       setSelectedProject(null);
//     }
//   };

//   const createNewProject = () => {
//     const project: Project = {
//       id: Date.now().toString(),
//       ...newProject,
//     };
//     setProjects([project, ...projects]);
//     setNewProject({
//       name: '',
//       description: '',
//       status: 'planning',
//       progress: 0,
//       startDate: '',
//       endDate: '',
//       assignedTo: [],
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-white">
//           Project Assignments
//         </motion.h1>
//         {(user?.role === 'Manager' || user?.role === 'HR') && (
//           <motion.button
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <FiPlus size={18} />
//             <span>New Project</span>
//           </motion.button>
//         )}
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {projects.map((project, index) => (
//           <motion.div
//             key={project.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
//             onClick={() => openProjectModal(project)}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{project.name}</h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
//               </div>
//               <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>{project.status}</span>
//             </div>
//             <div className="mb-4">
//               <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
//                 <span>Progress</span>
//                 <span>{project.progress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                 <div className={`h-2 rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white p-6 rounded-xl w-11/12 sm:w-full max-w-lg relative shadow-lg"
//           >
//             {/* Close Button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={() => { setIsModalOpen(false); setSelectedProject(null); }}
//             >
//               <FiX size={20} />
//             </button>

//             <h2 className="text-xl font-semibold mb-4">
//               {selectedProject ? 'Edit Project' : 'New Project'}
//             </h2>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Project Name"
//                 value={selectedProject ? selectedProject.name : newProject.name}
//                 onChange={e => {
//                   if (selectedProject) setSelectedProject({ ...selectedProject, name: e.target.value });
//                   else setNewProject({ ...newProject, name: e.target.value });
//                 }}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               <textarea
//                 placeholder="Description"
//                 value={selectedProject ? selectedProject.description : newProject.description}
//                 onChange={e => {
//                   if (selectedProject) setSelectedProject({ ...selectedProject, description: e.target.value });
//                   else setNewProject({ ...newProject, description: e.target.value });
//                 }}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Start Date</label>
//                   <input
//                     type="date"
//                     value={selectedProject ? selectedProject.startDate : newProject.startDate}
//                     onChange={e => {
//                       if (selectedProject) setSelectedProject({ ...selectedProject, startDate: e.target.value });
//                       else setNewProject({ ...newProject, startDate: e.target.value });
//                     }}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">End Date</label>
//                   <input
//                     type="date"
//                     value={selectedProject ? selectedProject.endDate : newProject.endDate}
//                     onChange={e => {
//                       if (selectedProject) setSelectedProject({ ...selectedProject, endDate: e.target.value });
//                       else setNewProject({ ...newProject, endDate: e.target.value });
//                     }}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Status</label>
//                   <select
//                     value={selectedProject ? selectedProject.status : newProject.status}
//                     onChange={e => {
//                       if (selectedProject) setSelectedProject({ ...selectedProject, status: e.target.value as any });
//                       else setNewProject({ ...newProject, status: e.target.value as any });
//                     }}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                   >
//                     <option value="planning">Planning</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="completed">Completed</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Progress (%)</label>
//                   <input
//                     type="number"
//                     min={0} max={100}
//                     value={selectedProject ? selectedProject.progress : newProject.progress}
//                     onChange={e => {
//                       const val = Number(e.target.value);
//                       if (selectedProject) setSelectedProject({ ...selectedProject, progress: val });
//                       else setNewProject({ ...newProject, progress: val });
//                     }}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={selectedProject ? saveProjectChanges : createNewProject}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg"
//               >
//                 {selectedProject ? 'Save Changes' : 'Create Project'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };
