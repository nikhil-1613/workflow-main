import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTarget, FiPlus, FiCheck, FiTrash } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { dummyTasks, testUsers } from "../data/dummyData";
import { toast, Toaster } from "react-hot-toast";
import { Modal } from "./Modal"; // ✅ Reusable Modal

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

interface Milestone {
  id: string;
  text: string;
  date: string;
}

export const TaskTracking: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // milestones
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
  const [newMilestoneText, setNewMilestoneText] = useState("");

  // new task
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("1");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
  const [newDueDate, setNewDueDate] = useState("");

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    setNewTitle("");
    setNewDescription("");
    setNewPriority("low");
    setNewAssignedTo("1");
    setNewDueDate("");
    setIsAddTaskModalOpen(false);
    toast.success("Task added!");
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Task deleted!");
  };

  const handleMarkCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
    toast.success("Task marked completed!");
  };

  const handleAddMilestone = () => {
    if (!selectedTask) return;
    if (!newMilestoneText) {
      toast.error("Enter milestone text");
      return;
    }
    const newMilestone: Milestone = {
      id: generateId(),
      text: newMilestoneText,
      date: new Date().toISOString(),
    };
    setMilestones((prev) => ({
      ...prev,
      [selectedTask.id]: [...(prev[selectedTask.id] || []), newMilestone],
    }));
    setNewMilestoneText("");
    setIsMilestoneModalOpen(false);
    toast.success("Milestone added!");
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const userTasks =
    user?.role === "Employee"
      ? tasks.filter((t) => t.assignedTo === user?.id)
      : tasks;

  const getNameById = (id: string) =>
    testUsers.find((u) => u.id === id)?.name || "Unknown";

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Task Tracking
        </motion.h1>

        {(user?.role === "Manager" || user?.role === "HR") && (
          <motion.button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <FiPlus size={18} />
            <span>Add Task</span>
          </motion.button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FiTarget className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{pendingTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FiTarget className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">{inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FiTarget className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTasks.map((task) => (
          <motion.div
            key={task.id}
            className="cursor-pointer bg-white p-6 rounded-xl shadow border"
            onClick={() => openTaskModal(task)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <div className="flex space-x-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Due:</span>{" "}
                {formatDate(task.dueDate)}
              </div>
              {user?.role !== "Employee" && (
                <div>
                  <span className="font-medium">Assigned To:</span>{" "}
                  {getNameById(task.assignedTo)}
                </div>
              )}
              <div>
                <span className="font-medium">Assigned By:</span>{" "}
                {getNameById(task.assignedBy)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {Math.ceil(
                  (new Date(task.dueDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 3600 * 24)
                )}{" "}
                days left
              </div>
              <div className="flex space-x-2">
                {task.status !== "completed" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkCompleted(task.id);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FiCheck size={16} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Task Detail Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
      >
        {selectedTask && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedTask.title}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedTask.description}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsTimelineModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Show Timeline
              </button>
              <button
                onClick={() => setIsMilestoneModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Add Milestone
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ✅ Timeline Modal */}
      <Modal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
      >
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedTask &&
          (milestones[selectedTask.id] || []).length === 0 ? (
            <p className="text-sm text-gray-500">No milestones yet.</p>
          ) : (
            selectedTask &&
            milestones[selectedTask.id]?.map((m) => (
              <div key={m.id} className="border-l-2 border-indigo-500 pl-2">
                <p>{m.text}</p>
                <span className="text-xs text-gray-400">
                  {formatDate(m.date)}
                </span>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* ✅ Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
      >
        <h3 className="text-lg font-semibold mb-4">
          Add Milestone for {selectedTask?.title}
        </h3>
        <input
          type="text"
          placeholder="Milestone text"
          value={newMilestoneText}
          onChange={(e) => setNewMilestoneText(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleAddMilestone}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Add
        </button>
      </Modal>

      {/* ✅ Add Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      >
        <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <select
            value={newAssignedTo}
            onChange={(e) => setNewAssignedTo(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            {testUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            value={newPriority}
            onChange={(e) =>
              setNewPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="datetime-local"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <textarea
          rows={3}
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleAddTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium w-full"
        >
          Create Task
        </button>
      </Modal>
    </div>
  );
};

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiTarget, FiPlus, FiCheck, FiTrash } from "react-icons/fi";
// import { useAuth } from "../contexts/AuthContext";
// import { dummyTasks, testUsers } from "../data/dummyData";
// import { toast, Toaster } from "react-hot-toast";

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "pending" | "in-progress" | "completed";
//   priority: "low" | "medium" | "high";
//   assignedTo: string;
//   assignedBy: string;
//   dueDate: string;
// }

// interface Milestone {
//   id: string;
//   text: string;
//   date: string;
// }

// export const TaskTracking: React.FC = () => {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState<Task[]>(dummyTasks);
//   const [showAddForm, setShowAddForm] = useState(false);

//   // milestones
//   const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showTimelineModal, setShowTimelineModal] = useState(false);
//   const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

//   const [newMilestoneText, setNewMilestoneText] = useState("");
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newAssignedTo, setNewAssignedTo] = useState("1");
//   const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
//   const [newDueDate, setNewDueDate] = useState("");

//   const generateId = () => Math.random().toString(36).substring(2, 10);

//   // ✅ format date into dd/mm/yyyy hh:mm AM/PM
//   const formatDate = (dateStr: string) => {
//     const d = new Date(dateStr);
//     return d.toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "in-progress":
//         return "bg-blue-100 text-blue-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleAddTask = () => {
//     if (!newTitle || !newDescription || !newDueDate) {
//       toast.error("Please fill all fields!");
//       return;
//     }
//     const newTask: Task = {
//       id: generateId(),
//       title: newTitle,
//       description: newDescription,
//       status: "pending",
//       priority: newPriority,
//       assignedTo: newAssignedTo,
//       assignedBy: user?.id || "0",
//       dueDate: newDueDate,
//     };
//     setTasks([newTask, ...tasks]);
//     setNewTitle("");
//     setNewDescription("");
//     setNewPriority("low");
//     setNewAssignedTo("1");
//     setNewDueDate("");
//     setShowAddForm(false);
//     toast.success("Task added!");
//   };

//   const handleDelete = (id: string) => {
//     setTasks(tasks.filter((t) => t.id !== id));
//     toast.success("Task deleted!");
//   };

//   const handleMarkCompleted = (id: string) => {
//     setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
//     toast.success("Task marked completed!");
//   };

//   const handleAddMilestone = () => {
//     if (!selectedTask) return;
//     if (!newMilestoneText) {
//       toast.error("Enter milestone text");
//       return;
//     }
//     const newMilestone: Milestone = {
//       id: generateId(),
//       text: newMilestoneText,
//       date: new Date().toISOString(),
//     };
//     setMilestones((prev) => ({
//       ...prev,
//       [selectedTask.id]: [...(prev[selectedTask.id] || []), newMilestone],
//     }));
//     setNewMilestoneText("");
//     setShowAddMilestoneModal(false);
//     toast.success("Milestone added!");
//   };

//   const pendingTasks = tasks.filter((t) => t.status === "pending").length;
//   const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
//   const completedTasks = tasks.filter((t) => t.status === "completed").length;

//   const userTasks =
//     user?.role === "Employee" ? tasks.filter((t) => t.assignedTo === user?.id) : tasks;

//   const getNameById = (id: string) =>
//     testUsers.find((u) => u.id === id)?.name || "Unknown";

//   return (
//     <div className="space-y-6 p-6">
//       <Toaster />
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800"
//         >
//           Task Tracking
//         </motion.h1>

//         {(user?.role === "Manager" || user?.role === "HR") && (
//           <motion.button
//             onClick={() => setShowAddForm(!showAddForm)}
//             className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//           >
//             <FiPlus size={18} />
//             <span>{showAddForm ? "Close Form" : "Add Task"}</span>
//           </motion.button>
//         )}
//       </div>

//       {/* Add Task Form */}
//       {showAddForm && (
//         <motion.div className="bg-white p-6 rounded-xl shadow border">
//           <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Task Title"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//             />
//             <select
//               value={newAssignedTo}
//               onChange={(e) => setNewAssignedTo(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//             >
//               {testUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={newPriority}
//               onChange={(e) =>
//                 setNewPriority(e.target.value as "low" | "medium" | "high")
//               }
//               className="w-full p-3 border rounded-lg"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//             <input
//               type="datetime-local"
//               value={newDueDate}
//               onChange={(e) => setNewDueDate(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//             />
//           </div>
//           <textarea
//             rows={3}
//             placeholder="Description"
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             className="w-full p-3 border rounded-lg mb-4"
//           />
//           <button
//             onClick={handleAddTask}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             Create Task
//           </button>
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center">
//             <FiTarget className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-sm text-gray-600">Pending</p>
//               <p className="text-2xl font-bold">{pendingTasks}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center">
//             <FiTarget className="text-blue-500 mr-3" size={24} />
//             <div>
//               <p className="text-sm text-gray-600">In Progress</p>
//               <p className="text-2xl font-bold">{inProgressTasks}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center">
//             <FiTarget className="text-green-500 mr-3" size={24} />
//             <div>
//               <p className="text-sm text-gray-600">Completed</p>
//               <p className="text-2xl font-bold">{completedTasks}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tasks Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {userTasks.map((task) => (
//           <motion.div
//             key={task.id}
//             className="cursor-pointer bg-white p-6 rounded-xl shadow border"
//             onClick={() => setSelectedTask(task)}
//           >
//             <div className="flex items-start justify-between mb-3">
//               <h3 className="text-lg font-semibold">{task.title}</h3>
//               <div className="flex space-x-1">
//                 <span
//                   className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                     task.status
//                   )}`}
//                 >
//                   {task.status}
//                 </span>
//                 <span
//                   className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
//                     task.priority
//                   )}`}
//                 >
//                   {task.priority}
//                 </span>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600 mb-4">{task.description}</p>
//             <div className="space-y-1 text-sm text-gray-600 mb-4">
//               <div>
//                 <span className="font-medium">Due:</span> {formatDate(task.dueDate)}
//               </div>
//               {user?.role !== "Employee" && (
//                 <div>
//                   <span className="font-medium">Assigned To:</span>{" "}
//                   {getNameById(task.assignedTo)}
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Assigned By:</span>{" "}
//                 {getNameById(task.assignedBy)}
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <div className="text-xs text-gray-500">
//                 {Math.ceil(
//                   (new Date(task.dueDate).getTime() - new Date().getTime()) /
//                     (1000 * 3600 * 24)
//                 )}{" "}
//                 days left
//               </div>
//               <div className="flex space-x-2">
//                 {task.status !== "completed" && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMarkCompleted(task.id);
//                     }}
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     <FiCheck size={16} />
//                   </button>
//                 )}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(task.id);
//                   }}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <FiTrash size={16} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Task Modal */}
//       {selectedTask && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">{selectedTask.title}</h2>
//             <p className="text-sm text-gray-600 mb-4">{selectedTask.description}</p>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setShowTimelineModal(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Show Timeline
//               </button>
//               <button
//                 onClick={() => setShowAddMilestoneModal(true)}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Milestone
//               </button>
//             </div>
//             <button
//               onClick={() => setSelectedTask(null)}
//               className="mt-4 text-sm text-gray-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Timeline Modal */}
//       {showTimelineModal && selectedTask && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Timeline</h3>
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {(milestones[selectedTask.id] || []).length === 0 ? (
//                 <p className="text-sm text-gray-500">No milestones yet.</p>
//               ) : (
//                 milestones[selectedTask.id].map((m) => (
//                   <div key={m.id} className="border-l-2 border-indigo-500 pl-2">
//                     <p>{m.text}</p>
//                     <span className="text-xs text-gray-400">{formatDate(m.date)}</span>
//                   </div>
//                 ))
//               )}
//             </div>
//             <button
//               onClick={() => setShowTimelineModal(false)}
//               className="mt-4 text-sm text-gray-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Milestone Modal */}
//       {showAddMilestoneModal && selectedTask && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">
//               Add Milestone for {selectedTask.title}
//             </h3>
//             <input
//               type="text"
//               placeholder="Milestone text"
//               value={newMilestoneText}
//               onChange={(e) => setNewMilestoneText(e.target.value)}
//               className="w-full p-3 border rounded-lg mb-4"
//             />
//             <div className="flex space-x-4">
//               <button
//                 onClick={handleAddMilestone}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add
//               </button>
//               <button
//                 onClick={() => setShowAddMilestoneModal(false)}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiTarget, FiPlus, FiCheck, FiTrash } from "react-icons/fi";
// import { useAuth } from "../contexts/AuthContext";
// import { dummyTasks } from "../data/dummyData";
// import { toast, Toaster } from "react-hot-toast";
// import { testUsers } from "../data/dummyData";

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "pending" | "in-progress" | "completed";
//   priority: "low" | "medium" | "high";
//   assignedTo: string;
//   assignedBy: string;
//   dueDate: string;
// }

// interface Milestone {
//   id: string;
//   text: string;
//   date: string;
// }

// export const TaskTracking: React.FC = () => {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState<Task[]>(dummyTasks);
//   const [showAddForm, setShowAddForm] = useState(false);

//   // track milestones per task
//   const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});

//   // modals
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showTimelineModal, setShowTimelineModal] = useState(false);
//   const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

//   // Add Milestone form
//   const [newMilestoneText, setNewMilestoneText] = useState("");

//   // Form state
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newAssignedTo, setNewAssignedTo] = useState("1");
//   const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
//   const [newDueDate, setNewDueDate] = useState("");

//   const generateId = () => Math.random().toString(36).substring(2, 10);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
//       case "in-progress":
//         return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
//       case "pending":
//         return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
//       case "medium":
//         return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
//       case "low":
//         return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
//     }
//   };

//   const handleAddTask = () => {
//     if (!newTitle || !newDescription || !newDueDate) {
//       toast.error("Please fill all fields!");
//       return;
//     }
//     const newTask: Task = {
//       id: generateId(),
//       title: newTitle,
//       description: newDescription,
//       status: "pending",
//       priority: newPriority,
//       assignedTo: newAssignedTo,
//       assignedBy: user?.id || "0",
//       dueDate: newDueDate,
//     };
//     setTasks([newTask, ...tasks]);
//     setNewTitle("");
//     setNewDescription("");
//     setNewPriority("low");
//     setNewAssignedTo("1");
//     setNewDueDate("");
//     setShowAddForm(false);
//     toast.success("Task added!");
//   };

//   const handleDelete = (id: string) => {
//     setTasks(tasks.filter((t) => t.id !== id));
//     toast.success("Task deleted!");
//   };

//   const handleMarkCompleted = (id: string) => {
//     setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
//     toast.success("Task marked completed!");
//   };

//   // milestones handlers
//   const handleAddMilestone = () => {
//     if (!selectedTask) return;
//     if (!newMilestoneText) {
//       toast.error("Enter milestone text");
//       return;
//     }
//     const newMilestone: Milestone = {
//       id: generateId(),
//       text: newMilestoneText,
//       date: new Date().toLocaleString(),
//     };
//     setMilestones((prev) => ({
//       ...prev,
//       [selectedTask.id]: [...(prev[selectedTask.id] || []), newMilestone],
//     }));
//     setNewMilestoneText("");
//     setShowAddMilestoneModal(false);
//     toast.success("Milestone added!");
//   };

//   // Summary counts
//   const pendingTasks = tasks.filter((t) => t.status === "pending").length;
//   const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
//   const completedTasks = tasks.filter((t) => t.status === "completed").length;

//   // Role-based filtering
//   const userTasks =
//     user?.role === "Employee" ? tasks.filter((t) => t.assignedTo === user?.id) : tasks;

//   // Helper to get name from id
//   const getNameById = (id: string) => {
//     return testUsers.find((u) => u.id === id)?.name || "Unknown";
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <Toaster />
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Task Tracking
//         </motion.h1>

//         {(user?.role === "Manager" || user?.role === "HR") && (
//           <motion.button
//             onClick={() => setShowAddForm(!showAddForm)}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//           >
//             <FiPlus size={18} />
//             <span>{showAddForm ? "Close Form" : "Add Task"}</span>
//           </motion.button>
//         )}
//       </div>

//       {/* Add Task Form */}
//       {showAddForm && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Task</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Task Title"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             />
//             <select
//               value={newAssignedTo}
//               onChange={(e) => setNewAssignedTo(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             >
//               {testUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={newPriority}
//               onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//             <input
//               type="date"
//               value={newDueDate}
//               onChange={(e) => setNewDueDate(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <textarea
//             rows={3}
//             placeholder="Description"
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
//           />
//           <button
//             onClick={handleAddTask}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//           >
//             Create Task
//           </button>
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <FiTarget className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
//             </div>
//           </div>
//         </motion.div>
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <FiTarget className="text-blue-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{inProgressTasks}</p>
//             </div>
//           </div>
//         </motion.div>
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
//         {userTasks.map((task) => (
//           <motion.div
//             key={task.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             onClick={() => setSelectedTask(task)}
//             className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-start justify-between mb-3">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
//               <div className="flex space-x-1">
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
//                   {task.status}
//                 </span>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
//                   {task.priority}
//                 </span>
//               </div>
//             </div>

//             <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{task.description}</p>

//             <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
//               <div>
//                 <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
//               </div>
//               {user?.role !== "Employee" && (
//                 <div>
//                   <span className="font-medium">Assigned To:</span> {getNameById(task.assignedTo)}
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Assigned By:</span> {getNameById(task.assignedBy)}
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 {Math.ceil(
//                   (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
//                 )}{" "}
//                 days left
//               </div>
//               <div className="flex space-x-2">
//                 {task.status !== "completed" && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMarkCompleted(task.id);
//                     }}
//                     className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
//                   >
//                     <FiCheck size={16} />
//                   </button>
//                 )}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(task.id);
//                   }}
//                   className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//                 >
//                   <FiTrash size={16} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Task Modal */}
//       {selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{selectedTask.title}</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedTask.description}</p>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => {
//                   setShowTimelineModal(true);
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Show Timeline
//               </button>
//               <button
//                 onClick={() => {
//                   setShowAddMilestoneModal(true);
//                 }}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Milestone
//               </button>
//             </div>
//             <button
//               onClick={() => setSelectedTask(null)}
//               className="mt-4 text-sm text-gray-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Timeline Modal */}
//       {showTimelineModal && selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Timeline</h3>
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {(milestones[selectedTask.id] || []).length === 0 ? (
//                 <p className="text-sm text-gray-500">No milestones yet.</p>
//               ) : (
//                 milestones[selectedTask.id].map((m) => (
//                   <div key={m.id} className="border-l-2 border-indigo-500 pl-2">
//                     <p className="text-gray-800 dark:text-gray-200">{m.text}</p>
//                     <span className="text-xs text-gray-400">{m.date}</span>
//                   </div>
//                 ))
//               )}
//             </div>
//             <button
//               onClick={() => setShowTimelineModal(false)}
//               className="mt-4 text-sm text-gray-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Milestone Modal */}
//       {showAddMilestoneModal && selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
//               Add Milestone for {selectedTask.title}
//             </h3>
//             <input
//               type="text"
//               placeholder="Milestone text"
//               value={newMilestoneText}
//               onChange={(e) => setNewMilestoneText(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
//             />
//             <div className="flex space-x-4">
//               <button
//                 onClick={handleAddMilestone}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add
//               </button>
//               <button
//                 onClick={() => setShowAddMilestoneModal(false)}
//                 className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiTarget, FiPlus, FiCheck, FiTrash } from "react-icons/fi";
// import { useAuth } from "../contexts/AuthContext";
// import { dummyTasks } from "../data/dummyData";
// import { toast, Toaster } from "react-hot-toast";
// import { testUsers } from "../data/dummyData"; // for names

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "pending" | "in-progress" | "completed";
//   priority: "low" | "medium" | "high";
//   assignedTo: string;
//   assignedBy: string;
//   dueDate: string;
// }

// export const TaskTracking: React.FC = () => {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState<Task[]>(dummyTasks);
//   const [showAddForm, setShowAddForm] = useState(false);

//   // Form state
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newAssignedTo, setNewAssignedTo] = useState("1");
//   const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
//   const [newDueDate, setNewDueDate] = useState("");

//   const generateId = () => Math.random().toString(36).substring(2, 10);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
//       case "in-progress":
//         return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
//       case "pending":
//         return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
//       case "medium":
//         return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
//       case "low":
//         return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
//     }
//   };

//   const handleAddTask = () => {
//     if (!newTitle || !newDescription || !newDueDate) {
//       toast.error("Please fill all fields!");
//       return;
//     }
//     const newTask: Task = {
//       id: generateId(),
//       title: newTitle,
//       description: newDescription,
//       status: "pending",
//       priority: newPriority,
//       assignedTo: newAssignedTo,
//       assignedBy: user?.id || "0",
//       dueDate: newDueDate,
//     };
//     setTasks([newTask, ...tasks]);
//     setNewTitle("");
//     setNewDescription("");
//     setNewPriority("low");
//     setNewAssignedTo("1");
//     setNewDueDate("");
//     setShowAddForm(false);
//     toast.success("Task added!");
//   };

//   const handleDelete = (id: string) => {
//     setTasks(tasks.filter((t) => t.id !== id));
//     toast.success("Task deleted!");
//   };

//   const handleMarkCompleted = (id: string) => {
//     setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
//     toast.success("Task marked completed!");
//   };

//   // Summary counts
//   const pendingTasks = tasks.filter((t) => t.status === "pending").length;
//   const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
//   const completedTasks = tasks.filter((t) => t.status === "completed").length;

//   // Role-based filtering
//   const userTasks =
//     user?.role === "Employee" ? tasks.filter((t) => t.assignedTo === user?.id) : tasks;

//   // Helper to get name from id
//   const getNameById = (id: string) => {
//     return testUsers.find((u) => u.id === id)?.name || "Unknown";
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <Toaster />
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold text-gray-800 dark:text-white"
//         >
//           Task Tracking
//         </motion.h1>

//         {(user?.role === "Manager" || user?.role === "HR") && (
//           <motion.button
//             onClick={() => setShowAddForm(!showAddForm)}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//           >
//             <FiPlus size={18} />
//             <span>{showAddForm ? "Close Form" : "Add Task"}</span>
//           </motion.button>
//         )}
//       </div>

//       {/* Add Task Form */}
//       {showAddForm && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Task</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Task Title"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             />
//             <select
//               value={newAssignedTo}
//               onChange={(e) => setNewAssignedTo(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             >
//               {testUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={newPriority}
//               onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//             <input
//               type="date"
//               value={newDueDate}
//               onChange={(e) => setNewDueDate(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <textarea
//             rows={3}
//             placeholder="Description"
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
//           />
//           <button
//             onClick={handleAddTask}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//           >
//             Create Task
//           </button>
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <FiTarget className="text-yellow-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
//             </div>
//           </div>
//         </motion.div>
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <FiTarget className="text-blue-500 mr-3" size={24} />
//             <div>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
//               <p className="text-2xl font-bold text-gray-800 dark:text-white">{inProgressTasks}</p>
//             </div>
//           </div>
//         </motion.div>
//         <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
//         {userTasks.map((task) => (
//           <motion.div
//             key={task.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-start justify-between mb-3">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
//               <div className="flex space-x-1">
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
//                   {task.status}
//                 </span>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
//                   {task.priority}
//                 </span>
//               </div>
//             </div>

//             <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{task.description}</p>

//             <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
//               <div>
//                 <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
//               </div>
//               {user?.role !== "Employee" && (
//                 <div>
//                   <span className="font-medium">Assigned To:</span> {getNameById(task.assignedTo)}
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Assigned By:</span> {getNameById(task.assignedBy)}
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 {Math.ceil(
//                   (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
//                 )}{" "}
//                 days left
//               </div>
//               <div className="flex space-x-2">
//                 {task.status !== "completed" && (
//                   <button
//                     onClick={() => handleMarkCompleted(task.id)}
//                     className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
//                   >
//                     <FiCheck size={16} />
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleDelete(task.id)}
//                   className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//                 >
//                   <FiTrash size={16} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };
