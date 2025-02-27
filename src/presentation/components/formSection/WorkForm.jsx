/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FormField from '../common/formField';
import { useResume } from '../../context/resumeContext/useResume';
import { actions } from '../../context/resumeContext/resumeActions';
import FormBase from './FormBase';
import { cn } from "@/lib/utils";
import EnhancedTextarea from '../common/enhancedTextarea';
import { workContextBuilder } from '../../../utils/enhancementContext'

const WorkEntry = ({ entry, onSave, onDelete, index }) => {
  const [localEntry, setLocalEntry] = useState(entry);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field, value) => {
    setLocalEntry(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(index, localEntry);
    setIsDirty(false);
  };

  const handleAchievementChange = (idx, value) => {
    const newAchievements = [...localEntry.achievements];
    newAchievements[idx] = value;
    handleChange('achievements', newAchievements);
  };

  const handleAddAchievement = () => {
    handleChange('achievements', [...localEntry.achievements, '']);
  };

  const handleRemoveAchievement = (idx) => {
    handleChange(
      'achievements',
      localEntry.achievements.filter((_, i) => i !== idx)
    );
  };

  // Form field configurations
  const formFields = [
    {
      name: 'position',
      label: 'Position Title',
      placeholder: 'e.g., Frontend Developer',
      required: true,
    },
    {
      type: 'group',
      fields: [
        {
          name: 'company',
          label: 'Company',
          placeholder: 'e.g., Danu Sports',
          required: true,
        },
        {
          name: 'location',
          label: 'Location',
          placeholder: 'e.g., Dublin, Ireland',
          required: true,
        }
      ]
    },
    {
      type: 'group',
      fields: [
        {
          name: 'startDate',
          label: 'Start Date',
          placeholder: 'Dec 2023',
          required: true,
        },
        {
          name: 'endDate',
          label: 'End Date',
          placeholder: 'Present',
          required: true,
        }
      ]
    }
  ];

  return (
    <div className="group relative space-y-4 p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-200">Position #{index + 1}</h3>
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

      <div className="space-y-5">
        {formFields.map((field, idx) => (
          field.type === 'group' ? (
            <div key={idx} className="grid grid-cols-2 gap-5">
              {field.fields.map(groupField => (
                <FormField
                  key={groupField.name}
                  label={groupField.label}
                  value={localEntry[groupField.name] || ''}
                  onChange={(e) => handleChange(groupField.name, e.target.value)}
                  placeholder={groupField.placeholder}
                  required={groupField.required}
                />
              ))}
            </div>
          ) : (
            <FormField
              key={field.name}
              label={field.label}
              value={localEntry[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )
        ))}

        {/* Achievements Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-200">
            Achievements
          </label>
          {localEntry.achievements.map((achievement, idx) => (
            <div key={idx} className="group/achievement flex items-start gap-3">
              <div className="flex-grow">
                <EnhancedTextarea
                  value={achievement}
                  onChange={(value) => handleAchievementChange(idx, value)}
                  placeholder="Describe your achievement"
                  section="work"
                  contextData={localEntry}
                  contextBuilder={workContextBuilder}
                />
              </div>
              <Button
                onClick={() => handleRemoveAchievement(idx)}
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover/achievement:opacity-100 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleAddAchievement}
            variant="ghost"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10"
          >
            <Plus size={20} />
            Add Achievement
          </Button>
        </div>
      </div>
    </div>
  );
};

const WorkForm = ({ onNext }) => {
  const { state, dispatch } = useResume();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addEntry = () => {
    const newEntry = {
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    };

    dispatch(actions.updateForm('work', [...(state.resume.work || []), newEntry]));
    setHasUnsavedChanges(true);
  };


  const updateEntry = (index, updatedEntry) => {
    const newWork = [...(state.resume.work || [])];
    newWork[index] = updatedEntry;

    dispatch(actions.updateForm('work', newWork));
    setHasUnsavedChanges(false);
  };

  const removeEntry = (index) => {
    dispatch(actions.updateForm('work',
      state.resume.work.filter((_, idx) => idx !== index)
    ));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to continue?')) {
        onNext('skills');
      }
    } else {
      onNext('skills');
    }
  };

  return (
    <FormBase
      title="Work Experience"
      addButtonText="Add Position"
      nextStepText="Next Step: Skills"
      onNext={handleSubmit}
      onAdd={addEntry}
    >
      {(state.resume.work || []).map((entry, index) => (
        <WorkEntry
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

export default WorkForm;