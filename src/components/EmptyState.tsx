
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateTask: () => void;
  isFiltered?: boolean;
}

const EmptyState = ({ onCreateTask, isFiltered = false }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-full bg-muted/50 p-4 mb-4"
      >
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-medium mt-2"
      >
        {isFiltered ? "No matching tasks found" : "No tasks yet"}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground mt-1 max-w-md"
      >
        {isFiltered 
          ? "Try adjusting your filters to find what you're looking for."
          : "Start by adding your first task to stay organized and productive."}
      </motion.p>
      
      {!isFiltered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <Button onClick={onCreateTask} className="button-hover-effect">
            <Plus className="h-4 w-4 mr-2" />
            Create a Task
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default EmptyState;
