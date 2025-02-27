import { useNavigate } from "react-router-dom";
import { useResume } from '../../context/resumeContext/useResume';
import PreviewModal from "./previewmodal";
import TemplateCard from "./templatecard";
import { useMemo, useState } from "react";
import { TEMPLATES } from '../../context/resumeContext/resumeConstants';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { resumeStorage } from "../../../services/storage/resumeStorage";
import { generateThumbnail } from "../../../utils/pdfThumbnail";


const templates = [
    {
        id: 'template1',
        name: 'Professional Classic',
        thumbnail: '/template1.1.png',
        previewImage: '/template1.1.png',
        component: TEMPLATES.CLASSIC
    },
    {
        id: 'template2',
        name: 'Modern Clean',
        thumbnail: '/template1.2.png',
        previewImage: '/template1.2.png',
        component: TEMPLATES.MODERN
    },
    {
        id: 'template3',
        name: 'Elegant Minimal',
        thumbnail: '/template1.3.png',
        previewImage: '/template1.3.png',
        component: TEMPLATES.ELEGANT
    }
];

const TemplateSelection = () => {
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const navigate = useNavigate();
    const { state, dispatch, actions } = useResume();



    // Check for existing resume more thoroughly
    const existingResumes = useMemo(() => {
        const saved = resumeStorage.getAllResumes();
        if (!saved || Object.keys(saved).length === 0) return null;

        // Get most recent resume
        const sortedResumes = Object.values(saved).sort((a, b) =>
            new Date(b.lastModified) - new Date(a.lastModified)
        );
        return sortedResumes[0];
    }, []);

    const hasExistingData = Object.keys(state.resume.personal || {}).length > 0 || existingResumes ;

    const handleSelect = async (template) => {
        let resumeData;

        if (existingResumes) {
            // Keep existing data, just update template
            resumeData = existingResumes.data;
        } else {
            // Use current state for new resume
            resumeData = state.resume;
        }

        // Update UI state
        dispatch(actions.setTemplate(template.component));

        // Generate thumbnail with existing data
        const thumbnail = await generateThumbnail(
            { resume: resumeData, ui: { ...state.ui, selectedTemplate: template.component } },
            template.component
        );

        // Save with existing data
        resumeStorage.saveResume(
            resumeData,
            template.component,
            thumbnail,
            existingResumes?.id // Use existing ID if available
        );

        navigate('/resume');
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleContinue = () => {
        navigate('/resume');
    };


    return (
        <div className="min-h-screen bg-[#0D0D0D]">
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-sm border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>

                    {hasExistingData && (
                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                        >
                            <span>Continue Editing</span>
                            <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text">
                            Choose a template
                        </h1>
                        <p className="mt-4 text-gray-400 text-lg">
                            Select a professional template to showcase your experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onPreview={() => setPreviewTemplate(template)}
                                onSelect={() => handleSelect(template)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {previewTemplate && (
                <PreviewModal
                    template={previewTemplate}
                    onClose={() => setPreviewTemplate(null)}
                />
            )}
        </div>
    );
};

export default TemplateSelection;