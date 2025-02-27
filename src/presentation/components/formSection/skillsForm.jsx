/* eslint-disable react/prop-types */
// SkillsForm.jsx
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormField from '../common/formField';
import { useResume } from '../../context/resumeContext/useResume';
import { actions } from '../../context/resumeContext/resumeActions';
import FormBase from './FormBase';

const SkillCategory = ({ category, onSave, onDelete, index }) => {
  const [localCategory, setLocalCategory] = useState(category);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field, value) => {
    setLocalCategory(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(index, localCategory);
    setIsDirty(false);
  };

  const handleSkillChange = (idx, value) => {
    const newSkills = [...localCategory.skills];
    newSkills[idx] = value;
    handleChange('skills', newSkills);
  };

  const handleAddSkill = () => {
    handleChange('skills', [...localCategory.skills, '']);
  };

  const handleRemoveSkill = (idx) => {
    handleChange(
      'skills',
      localCategory.skills.filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="group relative space-y-4 p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-200">Category #{index + 1}</h3>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            variant={isDirty ? "default" : "secondary"}
            className={cn(
              "h-9",
              isDirty ? "bg-primary-500 hover:bg-primary-600" : "bg-neutral-700/50 text-neutral-400"
            )}
          >
            {isDirty ? 'Save Changes' : 'Saved'}
          </Button>
          <Button
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      <FormField
        label="Category Name"
        value={localCategory.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="e.g., Programming Languages"
        required
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-200">
          Skills
        </label>
        {localCategory.skills.map((skill, idx) => (
          <div key={idx} className="group/skill flex items-center gap-3">
            <FormField
              value={skill}
              onChange={(e) => handleSkillChange(idx, e.target.value)}
              placeholder="e.g., JavaScript"
              className="flex-1"
            />
            <Button
              onClick={() => handleRemoveSkill(idx)}
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover/skill:opacity-100 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          onClick={handleAddSkill}
          variant="ghost"
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
        >
          <Plus size={20} />
          Add Skill
        </Button>
      </div>
    </div>
  );
};

const SkillsForm = ({ onNext }) => {
  const { state, dispatch } = useResume();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addCategory = () => {
    const newCategory = {
      name: '',
      skills: ['']
    };
    
    dispatch(actions.updateForm('skills', [...(state.resume.skills || []), newCategory]));
    setHasUnsavedChanges(true);
  };

  const updateCategory = (index, updatedCategory) => {
    const newSkills = [...(state.resume.skills || [])];
    newSkills[index] = updatedCategory;
    
    dispatch(actions.updateForm('skills', newSkills));
    setHasUnsavedChanges(false);
  };

  const removeCategory = (index) => {
    dispatch(actions.updateForm('skills', 
      state.resume.skills.filter((_, idx) => idx !== index)
    ));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to continue?')) {
        dispatch({ type: actions.SET_PDF_STATUS, payload: true });
      }
    } else {
      dispatch({ type: actions.SET_PDF_STATUS, payload: true });
    }
  };

  return (
    <FormBase
      title="Skills"
      addButtonText="Add Category"
      nextStepText="Generate PDF"
      onNext={handleSubmit}
      onAdd={addCategory}
    >
      {(state.resume.skills || []).map((category, index) => (
        <SkillCategory
          key={index}
          index={index}
          category={category}
          onSave={updateCategory}
          onDelete={() => removeCategory(index)}
        />
      ))}
    </FormBase>
  );
};

export default SkillsForm;