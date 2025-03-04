
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskFilter from "@/components/TaskFilter";
import Dashboard from "@/components/Dashboard";
import EmptyState from "@/components/EmptyState";
import { Task, TaskFilterOptions, TaskFormData } from "@/lib/types";
import { 
  calculateTaskStats, 
  createTask, 
  filterTasks, 
  generateSampleTasks, 
  sortTasks, 
  updateTask 
} from "@/lib/tasks";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilterOptions>({
    category: "all",
    priority: "all",
    status: "all",
    searchQuery: "",
  });
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    
    if (savedTasks) {
      try {
        // Parse tasks and ensure dates are Date objects
        const parsedTasks = JSON.parse(savedTasks, (key, value) => {
          if (key === "dueDate" || key === "createdAt" || key === "updatedAt") {
            return value ? new Date(value) : null;
          }
          return value;
        });
        
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        // Fallback to sample tasks if there's an error
        setTasks(generateSampleTasks());
      }
    } else {
      // Generate sample tasks for first-time users
      setTasks(generateSampleTasks());
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply tab filter first
    if (activeTab === "pending") {
      filtered = filtered.filter(task => task.status === "pending");
    } else if (activeTab === "completed") {
      filtered = filtered.filter(task => task.status === "completed");
    }
    
    // Then apply other filters
    filtered = filterTasks(filtered, filters);
    
    // Sort filtered tasks
    filtered = sortTasks(filtered);
    
    setFilteredTasks(filtered);
  }, [tasks, filters, activeTab]);

  const handleCreateTask = (formData: TaskFormData) => {
    const newTask = createTask(formData);
    setTasks(prev => sortTasks([...prev, newTask]));
    
    toast({
      title: "Task created",
      description: `"${formData.title}" has been added to your tasks.`,
    });
  };

  const handleUpdateTask = (formData: TaskFormData) => {
    if (!editingTask) return;
    
    setTasks(prev =>
      prev.map(task =>
        task.id === editingTask.id ? updateTask(task, formData) : task
      )
    );
    
    toast({
      title: "Task updated",
      description: `"${formData.title}" has been updated.`,
    });
    
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleTaskStatus = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleFilterChange = (newFilters: TaskFilterOptions) => {
    setFilters(newFilters);
  };

  const stats = calculateTaskStats(tasks);
  const isFilterActive = 
    filters.category !== "all" || 
    filters.priority !== "all" || 
    filters.status !== "all" || 
    filters.searchQuery !== "";

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-8 md:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
              <p className="mt-1 text-gray-500">
                Organize and manage your tasks efficiently
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setEditingTask(undefined);
                setIsTaskFormOpen(true);
              }}
              className="button-hover-effect"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </header>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <TaskFilter 
              onFilterChange={handleFilterChange} 
              taskCount={filteredTasks.length} 
            />
            
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleToggleTaskStatus}
                        animationDelay={index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState 
                onCreateTask={() => {
                  setEditingTask(undefined);
                  setIsTaskFormOpen(true);
                }}
                isFiltered={isFilterActive || activeTab !== "all"}
              />
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <TaskFilter 
              onFilterChange={handleFilterChange} 
              taskCount={filteredTasks.length} 
            />
            
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleToggleTaskStatus}
                        animationDelay={index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState 
                onCreateTask={() => {
                  setEditingTask(undefined);
                  setIsTaskFormOpen(true);
                }}
                isFiltered={isFilterActive || tasks.filter(t => t.status === "pending").length === 0}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <TaskFilter 
              onFilterChange={handleFilterChange} 
              taskCount={filteredTasks.length} 
            />
            
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleToggleTaskStatus}
                        animationDelay={index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState 
                onCreateTask={() => {
                  setEditingTask(undefined);
                  setIsTaskFormOpen(true);
                }}
                isFiltered={isFilterActive || tasks.filter(t => t.status === "completed").length === 0}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
      />
    </motion.div>
  );
};

export default Index;
