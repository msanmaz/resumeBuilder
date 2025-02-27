/* eslint-disable react/prop-types */
// components/common/FormBase.jsx
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FormBase = ({ 
  title, 
  children, 
  onNext, 
  nextStepText, 
  addButtonText, 
  onAdd 
}) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-neutral-100">{title}</h2>
          <Button
            onClick={onAdd}
            variant="ghost"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
          >
            <Plus className="h-5 w-5" />
            {addButtonText}
          </Button>
        </div>
      </div>

      <form onSubmit={onNext} className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          {children}
        </div>

        <div className="pt-6 mt-6 border-t border-neutral-700/50">
          <Button 
            type="submit"
            className="w-full h-12 bg-primary-500 hover:bg-primary-600"
          >
            <span>{nextStepText}</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormBase;