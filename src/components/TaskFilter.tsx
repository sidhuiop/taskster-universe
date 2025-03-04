
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TaskCategory, TaskFilterOptions, TaskPriority, TaskStatus } from "@/lib/types";

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilterOptions) => void;
  taskCount: number;
}

const TaskFilter = ({ onFilterChange, taskCount }: TaskFilterProps) => {
  const [filters, setFilters] = useState<TaskFilterOptions>({
    category: "all",
    priority: "all",
    status: "all",
    searchQuery: "",
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Count of active filters (excluding search)
  const activeFilterCount = [
    filters.category !== "all",
    filters.priority !== "all", 
    filters.status !== "all",
  ].filter(Boolean).length;

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: searchValue }));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchValue]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (
    key: keyof TaskFilterOptions,
    value: string
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      priority: "all",
      status: "all",
      searchQuery: "",
    });
    setSearchValue("");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 w-full"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500"
            onClick={() => setSearchValue("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Tasks</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground"
                      onClick={handleClearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing {taskCount} tasks
                </p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <RadioGroup
                  value={filters.status}
                  onValueChange={(value) =>
                    handleFilterChange("status", value)
                  }
                  className="flex flex-col gap-2"
                >
                  <StatusOption value="all" label="All" count={taskCount} />
                  <StatusOption
                    value="pending"
                    label="Pending"
                    count={taskCount}
                  />
                  <StatusOption
                    value="completed"
                    label="Completed"
                    count={taskCount}
                  />
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                  className="flex flex-col gap-2"
                >
                  <CategoryOption value="all" label="All" count={taskCount} />
                  <CategoryOption
                    value="work"
                    label="Work"
                    count={taskCount}
                  />
                  <CategoryOption
                    value="personal"
                    label="Personal"
                    count={taskCount}
                  />
                  <CategoryOption
                    value="urgent"
                    label="Urgent"
                    count={taskCount}
                  />
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  value={filters.priority}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                  className="flex flex-col gap-2"
                >
                  <PriorityOption value="all" label="All" count={taskCount} />
                  <PriorityOption
                    value="high"
                    label="High"
                    count={taskCount}
                  />
                  <PriorityOption
                    value="medium"
                    label="Medium"
                    count={taskCount}
                  />
                  <PriorityOption
                    value="low"
                    label="Low"
                    count={taskCount}
                  />
                </RadioGroup>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsFiltersOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

interface FilterOptionProps {
  value: string;
  label: string;
  count: number;
}

const StatusOption = ({ value, label, count }: FilterOptionProps) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={value} id={`status-${value}`} />
    <Label
      htmlFor={`status-${value}`}
      className="flex flex-1 items-center justify-between font-normal cursor-pointer"
    >
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">{count}</span>
    </Label>
  </div>
);

const CategoryOption = ({ value, label, count }: FilterOptionProps) => {
  const categoryColors: Record<string, string> = {
    work: "bg-category-work",
    personal: "bg-category-personal",
    urgent: "bg-category-urgent",
  };

  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`category-${value}`} />
      <Label
        htmlFor={`category-${value}`}
        className="flex flex-1 items-center justify-between font-normal cursor-pointer"
      >
        <div className="flex items-center">
          {value !== "all" && (
            <span
              className={cn(
                "mr-2 h-2 w-2 rounded-full",
                categoryColors[value]
              )}
            />
          )}
          <span>{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </Label>
    </div>
  );
};

const PriorityOption = ({ value, label, count }: FilterOptionProps) => {
  const priorityColors: Record<string, string> = {
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  };

  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`priority-${value}`} />
      <Label
        htmlFor={`priority-${value}`}
        className="flex flex-1 items-center justify-between font-normal cursor-pointer"
      >
        <div className="flex items-center">
          {value !== "all" && (
            <span
              className={cn(
                "mr-2 h-2 w-2 rounded-full",
                priorityColors[value]
              )}
            />
          )}
          <span>{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </Label>
    </div>
  );
};

export default TaskFilter;
