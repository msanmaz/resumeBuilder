// hooks/useFormSection.js
import { useState } from 'react';
import { useResume } from '../context/resumeContext/useResume';


export const useFormSection = (section, initialData) => {
  const { dispatch, actions } = useResume();
  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    dispatch(actions.updateForm(section, formData));
    setIsDirty(false);
  };

  return { formData, handleChange, handleSave, isDirty };
};