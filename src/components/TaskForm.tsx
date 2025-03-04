
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Task, TaskFormData } from "@/lib/types";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => void;
  initialData?: Task;
}

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "work",
    priority: "medium",
    dueDate: null,
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        priority: initialData.priority,
        dueDate: initialData.dueDate,
      });
    } else {
      // Reset form when opening for a new task
      setFormData({
        title: "",
        description: "",
        category: "work",
        priority: "medium",
        dueDate: null,
      });
    }
    
    // Reset errors
    setFormErrors({ title: false });
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'title' && value.trim()) {
      setFormErrors((prev) => ({ ...prev, title: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title.trim()) {
      setFormErrors((prev) => ({ ...prev, title: true }));
      return;
    }
    
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className={formErrors.title ? "text-red-500" : ""}>
              Task Title {formErrors.title && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={formErrors.title ? "border-red-500" : ""}
              autoFocus
            />
            {formErrors.title && (
              <p className="text-xs text-red-500">Title is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup
              defaultValue={formData.category}
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value as any,
                }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="work" id="category-work" />
                <Label
                  htmlFor="category-work"
                  className="font-normal cursor-pointer"
                >
                  Work
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="category-personal" />
                <Label
                  htmlFor="category-personal"
                  className="font-normal cursor-pointer"
                >
                  Personal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="category-urgent" />
                <Label
                  htmlFor="category-urgent"
                  className="font-normal cursor-pointer"
                >
                  Urgent
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              defaultValue={formData.priority}
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: value as any,
                }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label
                  htmlFor="priority-high"
                  className="font-normal cursor-pointer"
                >
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" />
                <Label
                  htmlFor="priority-medium"
                  className="font-normal cursor-pointer"
                >
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" />
                <Label
                  htmlFor="priority-low"
                  className="font-normal cursor-pointer"
                >
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Due Date</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal flex-1",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate as Date}
                    onSelect={(date) =>
                      setFormData((prev) => ({ ...prev, dueDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {formData.dueDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, dueDate: null }))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
