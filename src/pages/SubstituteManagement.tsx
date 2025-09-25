import React, { useState } from "react";
import { motion } from "framer-motion";
import { testUsers } from "../data/dummyData"; // import your testUsers array

interface SubstituteRequest {
  id: string;
  employeeName: string;
  absenceDate: string;
  duration: string;
  reason: string;
  substituteName?: string;
  status: "open" | "assigned";
}

export const SubstituteManagement = () => {
  const [requests, setRequests] = useState<SubstituteRequest[]>([
    {
      id: "1",
      employeeName: "John Smith",
      absenceDate: "2025-09-28",
      duration: "2 days",
      reason: "Medical Leave",
      substituteName: "Alice Brown",
      status: "assigned",
    },
    {
      id: "2",
      employeeName: "Fiona Clark",
      absenceDate: "2025-09-30",
      duration: "1 day",
      reason: "Personal Work",
      substituteName: undefined,
      status: "open",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newSubstitute, setNewSubstitute] = useState("");

  // only employees in dropdown
  const employeeOptions = testUsers.filter((u) => u.role === "Employee");

  const handleAddRequest = () => {
    const newRequest: SubstituteRequest = {
      id: Math.random().toString(36).substring(2, 10),
      employeeName: newEmployee,
      absenceDate: newDate,
      duration: newDuration,
      reason: newReason,
      substituteName: newSubstitute || undefined,
      status: newSubstitute ? "assigned" : "open",
    };

    setRequests((prev) => [...prev, newRequest]);
    setShowModal(false);

    // reset fields
    setNewEmployee("");
    setNewDate("");
    setNewDuration("");
    setNewReason("");
    setNewSubstitute("");
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        New Request
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl w-11/12 sm:w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-4">
              Create Substitute Request
            </h2>

            <div className="space-y-4">
              {/* Employee Dropdown */}
              <select
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Employee</option>
                {employeeOptions.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="text"
                placeholder="Duration"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <textarea
                placeholder="Reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              {/* Substitute Dropdown */}
              <select
                value={newSubstitute}
                onChange={(e) => setNewSubstitute(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Not assigned</option>
                {employeeOptions.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* List of requests */}
      <div className="mt-6 space-y-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-lg"
          >
            <div>
              <p className="font-medium">{r.employeeName}</p>
              <p className="text-sm text-gray-600">
                {r.absenceDate} • {r.duration}
              </p>
              <p className="text-sm text-gray-600">{r.reason}</p>
              <p className="text-sm">
                Substitute:{" "}
                {r.substituteName ? (
                  <span className="text-green-600">{r.substituteName}</span>
                ) : (
                  "Not assigned"
                )}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                r.status === "assigned"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// import React, { useState } from "react";
// import { motion } from "framer-motion";

// interface SubstituteRequest {
//   id: string;
//   employeeName: string;
//   absenceDate: string;
//   duration: string;
//   reason: string;
//   substituteName?: string;
//   status: "open" | "assigned";
// }

// export const SubstituteManagement = () => {
//   const [requests, setRequests] = useState<SubstituteRequest[]>([
//     {
//       id: "1",
//       employeeName: "John Doe",
//       absenceDate: "2025-09-28",
//       duration: "2 days",
//       reason: "Medical Leave",
//       substituteName: "Alice",
//       status: "assigned",
//     },
//     {
//       id: "2",
//       employeeName: "Jane Smith",
//       absenceDate: "2025-09-30",
//       duration: "1 day",
//       reason: "Personal Work",
//       substituteName: undefined,
//       status: "open",
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);

//   const [newEmployee, setNewEmployee] = useState("");
//   const [newDate, setNewDate] = useState("");
//   const [newDuration, setNewDuration] = useState("");
//   const [newReason, setNewReason] = useState("");
//   const [newSubstitute, setNewSubstitute] = useState("");

//   // Example substitute list
//   const availableSubstitutes = [
//     { id: "1", name: "Alice" },
//     { id: "2", name: "Bob" },
//     { id: "3", name: "Charlie" },
//   ];

//   const handleAddRequest = () => {
//     const newRequest: SubstituteRequest = {
//       id: Math.random().toString(36).substring(2, 10),
//       employeeName: newEmployee,
//       absenceDate: newDate,
//       duration: newDuration,
//       reason: newReason,
//       substituteName: newSubstitute || undefined,
//       status: newSubstitute ? "assigned" : "open",
//     };

//     setRequests((prev) => [...prev, newRequest]);
//     setShowModal(false);

//     // reset fields
//     setNewEmployee("");
//     setNewDate("");
//     setNewDuration("");
//     setNewReason("");
//     setNewSubstitute("");
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//       >
//         New Request
//       </button>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white p-6 rounded-xl w-11/12 sm:w-full max-w-lg"
//           >
//             <h2 className="text-xl font-semibold mb-4">Create Substitute Request</h2>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Employee Name"
//                 value={newEmployee}
//                 onChange={(e) => setNewEmployee(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               <input
//                 type="date"
//                 value={newDate}
//                 onChange={(e) => setNewDate(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               <input
//                 type="text"
//                 placeholder="Duration"
//                 value={newDuration}
//                 onChange={(e) => setNewDuration(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               <textarea
//                 placeholder="Reason"
//                 value={newReason}
//                 onChange={(e) => setNewReason(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               />

//               {/* Substitute Dropdown */}
//               <select
//                 value={newSubstitute}
//                 onChange={(e) => setNewSubstitute(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               >
//                 <option value="">Not assigned</option>
//                 {availableSubstitutes.map((s) => (
//                   <option key={s.id} value={s.name}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border border-gray-400 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddRequest}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Create
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* List of requests */}
//       <div className="mt-6 space-y-4">
//         {requests.map((r) => (
//           <div
//             key={r.id}
//             className="p-4 border rounded-lg flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{r.employeeName}</p>
//               <p className="text-sm text-gray-600">
//                 {r.absenceDate} • {r.duration}
//               </p>
//               <p className="text-sm text-gray-600">{r.reason}</p>
//               <p className="text-sm">
//                 Substitute:{" "}
//                 {r.substituteName ? (
//                   <span className="text-green-600">{r.substituteName}</span>
//                 ) : (
//                   "Not assigned"
//                 )}
//               </p>
//             </div>
//             <span
//               className={`px-3 py-1 text-sm rounded-full ${r.status === "assigned"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-yellow-100 text-yellow-600"
//                 }`}
//             >
//               {r.status}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

