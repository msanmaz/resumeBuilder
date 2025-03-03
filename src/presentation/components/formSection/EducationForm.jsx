/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormField from '../common/formField';
import { useResume } from '../../context/resumeContext/useResume';
import { actions } from '../../context/resumeContext/resumeActions';
import FormBase from './FormBase';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EnhancedTextarea from '../common/enhancedTextarea';
import { educationContextBuilder } from '../../../utils/enhancementContext'

const EducationEntry = ({ entry, onSave, onDelete, index }) => {
  // Normalize entry to ensure description is always an array
  const normalizedEntry = {
    ...entry,
    description: Array.isArray(entry.description)
      ? entry.description
      : entry.description ? [entry.description] : []
  };

  const [localEntry, setLocalEntry] = useState(normalizedEntry);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field, value) => {
    setLocalEntry(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleDescriptionChange = (idx, value) => {
    const newDescriptions = [...localEntry.description];
    newDescriptions[idx] = value;
    handleChange('description', newDescriptions);
  };

  const handleAddDescription = () => {
    handleChange('description', [...localEntry.description, '']);
  };

  const handleRemoveDescription = (idx) => {
    handleChange(
      'description',
      localEntry.description.filter((_, i) => i !== idx)
    );
  };

  const handleSave = () => {
    onSave(index, localEntry);
    setIsDirty(false);
  };

  // Form field configurations
  const formFields = [
    {
      name: 'degree',
      label: 'Degree/Certificate',
      placeholder: 'e.g., Bachelor of Science in Computer Science',
      required: true,
    },
    {
      name: 'institution',
      label: 'Institution',
      placeholder: 'e.g., University of Technology',
      required: true,
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'e.g., Dublin, Ireland',
      required: false,
    }
  ];

  const dateFields = [
    {
      name: 'startDate',
      label: 'Start Date',
      placeholder: 'Sep 2019',
      required: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      placeholder: 'Jun 2023',
      required: true,
    }
  ];

  return (
    <div className="group relative space-y-4 p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-200">Education #{index + 1}</h3>
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            variant={isDirty ? "default" : "secondary"}
            className={cn(
              "h-9",
              isDirty ? "bg-primary-500 hover:bg-primary-600" : "bg-neutral-700/50 text-neutral-400"
            )}
          >
            Save Changes
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

      {/* Main form fields */}
      {formFields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          value={localEntry[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      ))}

      {/* Date fields */}
      <div className="grid grid-cols-2 gap-4">
        {dateFields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            value={localEntry[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        ))}
      </div>

      {/* Description field with enhancement */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-200">
          Description
        </label>
        {localEntry.description.map((desc, idx) => (
          <div key={idx} className="group/description flex items-start gap-3">
            <div className="flex-grow">
              <EnhancedTextarea
                value={desc || ''}
                onChange={(value) => handleDescriptionChange(idx, value)}
                placeholder="Describe your major achievements, relevant coursework, etc."
                section="education"
                contextData={localEntry}
                contextBuilder={educationContextBuilder}
                rows={3}
              />
            </div>
            <Button
              onClick={() => handleRemoveDescription(idx)}
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover/description:opacity-100 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          onClick={handleAddDescription}
          variant="ghost"
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
        >
          <Plus size={20} />
          Add Description
        </Button>
      </div>
    </div>
  );
};


const EducationForm = ({ onNext }) => {
  const { state, dispatch } = useResume();

  const addEntry = () => {
    const newEntry = {
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: []
    };

    dispatch(actions.updateForm('education', [...(state.resume.education || []), newEntry]));
  };


  const updateEntry = (index, updatedEntry) => {
    const newEducation = [...(state.resume.education || [])];
    newEducation[index] = updatedEntry;

    dispatch(actions.updateForm('education', newEducation));
  };

  const removeEntry = (index) => {
    dispatch(actions.updateForm('education',
      state.resume.education.filter((_, idx) => idx !== index)
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      onNext('work');
  };

  return (
    <FormBase
      title="Education"
      addButtonText="Add Education"
      nextStepText="Next Step: Work Experience"
      onNext={handleSubmit}
      onAdd={addEntry}
    >
      {(state.resume.education || []).map((entry, index) => (
        <EducationEntry
          key={index}
          index={index}
          entry={entry}
          onSave={updateEntry}
          onDelete={() => removeEntry(index)}
        />
      ))}
    </FormBase>
  );
};

export default EducationForm;