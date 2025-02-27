/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useResume } from '../../context/resumeContext/useResume';
import { actions } from '../../context/resumeContext/resumeActions';
import { Textarea } from "@/components/ui/textarea";

const ProfessionalSummaryForm = ({ onNext }) => {
  const { state, dispatch } = useResume();
  
  // Local state for form data and tracking changes
  const [summary, setSummary] = useState(state.resume.summary || '');
  const [isDirty, setIsDirty] = useState(false);
  const [charCount, setCharCount] = useState(state.resume.summary?.length || 0);
  
  const MAX_CHARS = 10000;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setSummary(value);
      setCharCount(value.length);
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    console.log('Saving summary:', summary);
    
    // Use action creator instead of direct dispatch
    dispatch(actions.updateForm('summary', summary));
    
    console.log('State after dispatch:', state.resume.summary);
    setIsDirty(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDirty) {
      handleSave();
    }
    onNext('education');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <div className="flex items-center space-x-4">

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
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Write a compelling professional summary
          </label>
          <Textarea
            value={summary}
            onChange={handleChange}
            placeholder="Results-driven Frontend Developer with X years of experience..."
            className="w-full h-48 border border-gray-700 rounded px-4 py-2 text-white resize-none"
            required
          />
        </div>
      </div>
              <div>
              <span className="text-sm text-gray-400 my-6">
            {charCount}/{MAX_CHARS} characters
          </span>
              </div>
      <div className="pt-6 border-t border-gray-700">

        <button 
          type="submit" 
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <span>Next Step: Education</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default ProfessionalSummaryForm;