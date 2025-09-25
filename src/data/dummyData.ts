import { User, Task, Project, TimeoffRequest, Expense } from '../types';

export const testUsers: User[] = [
  {
    id: '1',
    email: 'employee@test.com',
    role: 'Employee',
    name: 'John Smith'
  },
  {
    id: '2',
    email: 'manager@test.com',
    role: 'Manager',
    name: 'Sarah Johnson'
  },
  {
    id: '3',
    email: 'hr@test.com',
    role: 'HR',
    name: 'Mike Wilson'
  }
];

export const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Q4 Report',
    description: 'Prepare comprehensive quarterly business report',
    status: 'in-progress',
    assignedTo: '1',
    assignedBy: '2',
    dueDate: '2024-01-15',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Update Client Database',
    description: 'Refresh client contact information and preferences',
    status: 'pending',
    assignedTo: '1',
    assignedBy: '2',
    dueDate: '2024-01-20',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Team Performance Review',
    description: 'Conduct annual performance evaluations',
    status: 'completed',
    assignedTo: '2',
    assignedBy: '3',
    dueDate: '2024-01-10',
    priority: 'high'
  }
];

export const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of mobile application interface',
    status: 'in-progress',
    assignedTo: ['1', '2'],
    manager: '2',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    progress: 65
  },
  {
    id: '2',
    name: 'Customer Portal Enhancement',
    description: 'Add new features to customer self-service portal',
    status: 'planning',
    assignedTo: ['1'],
    manager: '2',
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    progress: 15
  }
];

export const dummyTimeoffRequests: TimeoffRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    status: 'pending',
    reason: 'Family vacation'
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'John Smith',
    type: 'sick',
    startDate: '2024-01-08',
    endDate: '2024-01-08',
    status: 'approved',
    reason: 'Medical appointment'
  }
];

export const dummyExpenses: Expense[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    category: 'Travel',
    amount: 850.00,
    date: '2024-01-05',
    description: 'Client meeting travel expenses',
    status: 'pending'
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'John Smith',
    category: 'Office Supplies',
    amount: 125.50,
    date: '2024-01-03',
    description: 'Laptop accessories and stationery',
    status: 'approved'
  }
];

export const dashboardKPIs = {
  totalEmployees: 150,
  activeProjects: 12,
  pendingTimeoff: 8,
  completedTasks: 245,
  monthlyBudget: 125000,
  expensesPending: 15
};