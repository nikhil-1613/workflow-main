export interface User {
  id: string;
  email: string;
  role: 'Employee' | 'Manager' | 'HR';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  assignedTo: string[];
  manager: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export interface TimeoffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}