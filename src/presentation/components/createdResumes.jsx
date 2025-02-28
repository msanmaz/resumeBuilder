import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/resumeContext/useResume';
import { Plus, Trash2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { resumeStorage } from '../../services/storage/resumeStorage'; // Or utils/resumeUtils
import PreviewModal from './templateSelection/previewmodal';
import { generateThumbnail } from '../../utils/pdfThumbnail';

const CreatedResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [previewResume, setPreviewResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state, dispatch, actions } = useResume();
    const navigate = useNavigate();

    const hasExistingData = Object.keys(state.resume.personal || {}).length > 0;


    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const saved = resumeStorage.getAllResumes();

            if (!saved) {
                setResumes([]);
                return;
            }

            const resumeArray = await Promise.all(
                Object.values(saved).map(async (resume) => {
                    if (!resume.thumbnail) {
                        try {
                            const thumbnail = await generateThumbnail(
                                {
                                    resume: resume.data,
                                    ui: {
                                        selectedTemplate: resume.template,
                                        sectionOrder: resume.data.ui?.sectionOrder
                                    }
                                },
                                resume.template
                            );

                            const saveResult = resumeStorage.saveResume(
                                resume.data,
                                resume.template,
                                thumbnail,
                                resume.id
                            );

                            if (!saveResult.success) {
                                console.error('Failed to save resume with thumbnail:', saveResult.error);
                            }

                            resume.thumbnail = thumbnail;
                        } catch (error) {
                            console.error('Error generating thumbnail:', error);
                            resume.thumbnail = '/placeholder-thumbnail.png';
                        }
                    }
                    return resume;
                })
            );

            const sortedResumes = resumeArray.sort((a, b) => {
                const dateA = new Date(a.lastModified || 0);
                const dateB = new Date(b.lastModified || 0);
                return dateB - dateA;
            });

            setResumes(sortedResumes);
        } catch (error) {
            console.error('Error loading resumes:', error);
            setError('Failed to load resumes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this resume?')) {
            const result = resumeStorage.deleteResume(id);
            if (result.success) {
                setResumes([]);
                dispatch(actions.resetState());
            } else {
                console.error('Failed to delete resume:', result.error);
            }
        }
    };

    const handleSelect = (resume) => {
        dispatch(actions.updateForm('resume', resume.data));
        dispatch(actions.setTemplate(resume.template));
        navigate('/resume');
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleContinue = () => {
        navigate('/templates');
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-red-400 text-center">
                    <p>{error}</p>
                    <button
                        onClick={loadResumes}
                        className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] py-12 px-4 sm:px-6 lg:px-8">

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
                            <span>Choose Template</span>
                            <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-14">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text">
                        Your Resumes
                    </h1>
                    <p className="mt-4 text-neutral-400">
                        View and manage your saved resumes below
                    </p>
                </div>

                {resumes.length === 0 ? (
                    <div className="text-center text-neutral-400">
                        <p>No resumes created yet.</p>
                        <button
                            onClick={() => navigate('/templates')}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                        >
                            Create Your First Resume
                            <Plus size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div
                            onClick={() => navigate('/templates')}
                            className="group relative bg-neutral-800/50 rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg backdrop-blur-sm overflow-hidden cursor-pointer aspect-[8.5/11] flex items-center justify-center"
                        >
                            <Plus size={48} className="text-neutral-400 group-hover:text-white transition-colors" />
                        </div>

                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="group relative bg-neutral-800/50 rounded-xl border border-neutral-700/50 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-lg backdrop-blur-sm overflow-hidden"
                            >
                                <div
                                    className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                                    onClick={() => setPreviewResume(resume)}
                                >
                                    <img
                                        src={resume.thumbnail}
                                        alt="Resume thumbnail"
                                        className="w-full h-full object-contain" // Maintains aspect ratio, fits within container
                                        loading="lazy" // Optional: Lazy-load for performance
                                    />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(resume.id);
                                            }}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 flex justify-between items-center gap-4">
                                    <button
                                        onClick={() => setPreviewResume(resume)}
                                        className="flex-1 px-4 py-2 text-sm text-neutral-200 border border-neutral-600 rounded-md hover:bg-neutral-700/50 transition-colors"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleSelect(resume)}
                                        className="flex-1 px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="p-4 pt-0 text-sm text-neutral-400">
                                    Last Modified: {new Date(resume.lastModified).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewResume && (
                <PreviewModal
                    template={previewResume}
                    onClose={() => setPreviewResume(null)}
                />
            )}
        </div>
    );
};

export default CreatedResumes;