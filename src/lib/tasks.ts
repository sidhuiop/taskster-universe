
import { Task, TaskCategory, TaskFilterOptions, TaskFormData, TaskPriority, TaskStats } from "./types";

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create a new task
export const createTask = (formData: TaskFormData): Task => {
  const now = new Date();
  
  return {
    id: generateId(),
    title: formData.title,
    description: formData.description,
    category: formData.category,
    priority: formData.priority,
    status: 'pending',
    dueDate: formData.dueDate,
    createdAt: now,
    updatedAt: now,
  };
};

// Update an existing task
export const updateTask = (task: Task, formData: Partial<TaskFormData>): Task => {
  return {
    ...task,
    ...formData,
    updatedAt: new Date(),
  };
};

// Toggle task status
export const toggleTaskStatus = (task: Task): Task => {
  return {
    ...task,
    status: task.status === 'completed' ? 'pending' : 'completed',
    updatedAt: new Date(),
  };
};

// Filter tasks
export const filterTasks = (tasks: Task[], filterOptions: TaskFilterOptions): Task[] => {
  return tasks.filter(task => {
    // Filter by category
    if (filterOptions.category !== 'all' && task.category !== filterOptions.category) {
      return false;
    }
    
    // Filter by priority
    if (filterOptions.priority !== 'all' && task.priority !== filterOptions.priority) {
      return false;
    }
    
    // Filter by status
    if (filterOptions.status !== 'all' && task.status !== filterOptions.status) {
      return false;
    }
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};

// Calculate task statistics
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const now = new Date();
  
  const stats: TaskStats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    overdue: 0,
    byCategory: {
      work: 0,
      personal: 0,
      urgent: 0,
    },
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  };
  
  tasks.forEach(task => {
    // Status stats
    if (task.status === 'completed') {
      stats.completed++;
    } else {
      stats.pending++;
      
      // Check if overdue
      if (task.dueDate && task.dueDate < now) {
        stats.overdue++;
      }
    }
    
    // Category stats
    stats.byCategory[task.category]++;
    
    // Priority stats
    stats.byPriority[task.priority]++;
  });
  
  return stats;
};

// Sort tasks (more recent first, overdue tasks first)
export const sortTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  
  return [...tasks].sort((a, b) => {
    // Overdue pending tasks first
    const aIsOverdue = a.status === 'pending' && a.dueDate && a.dueDate < now;
    const bIsOverdue = b.status === 'pending' && b.dueDate && b.dueDate < now;
    
    if (aIsOverdue && !bIsOverdue) return -1;
    if (!aIsOverdue && bIsOverdue) return 1;
    
    // Then by status (pending first)
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    
    // Then by priority
    const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Finally by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

// Generate sample tasks for demonstration
export const generateSampleTasks = (): Task[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: generateId(),
      title: "Complete project proposal",
      description: "Finalize the Q3 marketing campaign proposal with budget estimates.",
      category: "work",
      priority: "high",
      status: "pending",
      dueDate: tomorrow,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: generateId(),
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith's office to schedule a check-up.",
      category: "personal",
      priority: "medium",
      status: "completed",
      dueDate: yesterday,
      createdAt: new Date(now.setDate(now.getDate() - 3)),
      updatedAt: yesterday,
    },
    {
      id: generateId(),
      title: "Pay electricity bill",
      description: "The bill is due by the end of the week.",
      category: "urgent",
      priority: "high",
      status: "pending",
      dueDate: tomorrow,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: generateId(),
      title: "Review team presentation",
      description: "Provide feedback on the quarterly report presentation.",
      category: "work",
      priority: "medium",
      status: "pending",
      dueDate: nextWeek,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: generateId(),
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruits, and vegetables.",
      category: "personal",
      priority: "low",
      status: "pending",
      dueDate: tomorrow,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
  ];
};
