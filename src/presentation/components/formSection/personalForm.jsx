/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FormField from '../common/formField';
import { useResume } from '../../context/resumeContext/useResume';

const PersonalForm = ({ onNext }) => {
  const { state, dispatch, actions } = useResume();
  
  const [formData, setFormData] = useState(state.resume.personal);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    dispatch(actions.updateForm('personal', formData));
    setIsDirty(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      handleSave();

    onNext('summary');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-4 py-2 rounded transition-colors ${
            isDirty 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </div>
      
      <div className="space-y-4">
        <FormField
          label="Full Name"
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="e.g., John Doe"
          required
        />
        <FormField
          label="Title"
          type="text"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Frontend Developer"
          required
        />
        <FormField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="e.g., john@example.com"
          required
        />
        <FormField
          label="Phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="e.g., +1 (555) 123-4567"
          required
        />
        <FormField
          label="Location"
          type="text"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="e.g., New York, NY"
          required
        />
        <FormField
          label="Portfolio URL"
          type="url"
          value={formData.portfolio || ''}
          onChange={(e) => updateField('portfolio', e.target.value)}
          placeholder="e.g., https://portfolio.com"
        />
      </div>

      <div className="pt-6 border-t border-gray-700">
        <button
          onClick={ () => onNext("summary")}
          type="submit"
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <span>Next Step: Summary</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default PersonalForm;