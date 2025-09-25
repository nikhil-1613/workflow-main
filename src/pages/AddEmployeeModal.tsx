import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface Employee {
  employeeName: string;
  position: string;
  salary: number;
  hoursWorked: number;
  overtime: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "processed" | "pending" | "approved";
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Employee) => void;
  newEmployee: Employee;
  setNewEmployee: React.Dispatch<React.SetStateAction<Employee>>;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newEmployee,
  setNewEmployee,
}) => {
  const handleAdd = () => {
    if (!newEmployee.employeeName || !newEmployee.position) {
      toast.error("Please fill in all required fields");
      return;
    }
    onAdd(newEmployee);
    toast.success("Employee added successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-0 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Add New Employee
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee Name
            </label>
            <input
              type="text"
              value={newEmployee.employeeName}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, employeeName: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Position
            </label>
            <input
              type="text"
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Annual Salary (USD)
            </label>
            <input
              type="number"
              value={newEmployee.salary}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Hours Worked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hours Worked
            </label>
            <input
              type="number"
              value={newEmployee.hoursWorked}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  hoursWorked: Number(e.target.value),
                })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Overtime */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Overtime Hours
            </label>
            <input
              type="number"
              value={newEmployee.overtime}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  overtime: Number(e.target.value),
                })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Gross Pay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gross Pay
            </label>
            <input
              type="number"
              value={newEmployee.grossPay}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, grossPay: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Deductions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deductions
            </label>
            <input
              type="number"
              value={newEmployee.deductions}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, deductions: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Net Pay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Net Pay
            </label>
            <input
              type="number"
              value={newEmployee.netPay}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, netPay: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={newEmployee.status}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  status: e.target.value as "processed" | "pending" | "approved",
                })
              }
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </motion.div>
    </div>
  );
};


