import PersonalForm from './personalForm';
import ProfessionalSummaryForm from './professionalSummary';
import EducationForm from './EducationForm';
import WorkForm from './WorkForm';
import SkillsForm from './skillsForm';
import { useResume } from '../../context/resumeContext/useResume';
import { actions } from '../../context/resumeContext/resumeActions';

const FormSection = () => {
  const { state, dispatch } = useResume();

  const handleNext = (nextSection) => {
    dispatch(actions.setSection(nextSection));
  };

  const renderForm = () => {
    switch (state.ui.currentSection) {
      case 'personal':
        return <PersonalForm onNext={handleNext} />;
      case 'summary':
        return <ProfessionalSummaryForm onNext={handleNext} />;
      case 'education':
        return <EducationForm onNext={handleNext} />;
      case 'work':
        return <WorkForm onNext={handleNext} />;
      case 'skills':
        return <SkillsForm onNext={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-900">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderForm()}
      </div>
    </div>
  );
};

export default FormSection;