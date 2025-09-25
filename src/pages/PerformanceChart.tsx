
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";

// Dummy data
const employeeData = [
  { month: "Jan", progress: 70 },
  { month: "Feb", progress: 85 },
  { month: "Mar", progress: 60 },
  { month: "Apr", progress: 90 },
];

const managerData = [
  { project: "Project A", completed: 4 },
  { project: "Project B", completed: 7 },
  { project: "Project C", completed: 3 },
];

const hrData = [
  { month: "Jan", hires: 5 },
  { month: "Feb", hires: 3 },
  { month: "Mar", hires: 6 },
  { month: "Apr", hires: 4 },
];

const PerformanceChart: React.FC = () => {
  const { user } = useAuth(); // assume user.role = "employee" | "manager" | "hr"

  if (user?.role === "Employee") {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (user?.role === "Manager") {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={managerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="project" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (user?.role === "HR") {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hrData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hires" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return <p className="text-gray-500">No chart available</p>;
};

export default PerformanceChart;
