
import { useState } from "react";
import { format } from "date-fns";
import { Check, Clock, Edit, Trash } from "lucide-react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleTaskStatus } from "@/lib/tasks";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (updatedTask: Task) => void;
  animationDelay?: number;
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  animationDelay = 0,
}: TaskCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusToggle = () => {
    const updatedTask = toggleTaskStatus(task);
    onStatusChange(updatedTask);
    
    toast({
      title: updatedTask.status === 'completed' ? "Task completed" : "Task reopened",
      description: task.title,
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    // Add a small delay for the animation to play
    setTimeout(() => {
      onDelete(task.id);
      toast({
        title: "Task deleted",
        description: task.title,
      });
    }, 300);
  };

  const isOverdue = task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div 
      className={cn(
        "task-card task-card-entrance",
        isDeleting ? "opacity-0 scale-95 transition-all duration-300" : "",
      )}
      style={{ 
        animationDelay: `${animationDelay * 0.05}s`,
        borderLeft: `4px solid ${
          task.category === 'work' 
            ? '#4F46E5' 
            : task.category === 'personal' 
            ? '#10B981' 
            : '#EF4444'
        }`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={handleStatusToggle}
            className={cn(
              "flex-shrink-0 h-6 w-6 rounded-full border transition-colors duration-200 flex items-center justify-center",
              task.status === 'completed'
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            {task.status === 'completed' && <Check className="h-4 w-4" />}
          </button>
          
          <div className="space-y-1">
            <h3 
              className={cn(
                "font-medium transition-colors", 
                task.status === 'completed' && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h3>
            
            <p 
              className={cn(
                "text-sm text-gray-600", 
                task.status === 'completed' && "text-gray-400"
              )}
            >
              {task.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span 
                className={cn(
                  "category-badge",
                  task.category === 'work' ? "bg-category-work" : 
                  task.category === 'personal' ? "bg-category-personal" : 
                  "bg-category-urgent"
                )}
              >
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>
              
              <span 
                className={cn(
                  "priority-badge",
                  task.priority === 'high' ? "bg-red-100 text-red-800" : 
                  task.priority === 'medium' ? "bg-yellow-100 text-yellow-800" : 
                  "bg-green-100 text-green-800"
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              
              {task.dueDate && (
                <span 
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium gap-1",
                    isOverdue 
                      ? "bg-red-100 text-red-800" 
                      : "bg-blue-100 text-blue-800"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                  {isOverdue && " (Overdue)"}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(task)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
