// components/LandingPage.jsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon } from "lucide-react";
import JobResponsibility from "./job-responsiblity";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleResumeRoute= () => {
        navigate('/templates'); 
    };


    return (
        <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-white font-semibold text-xl flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">R</span>
                        </div>
                        ResumeBuilder
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10"
                            onClick={handleResumeRoute}
                        >
                            Use For Free
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Moon className="h-5 w-5 text-gray-400" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Left Content */}
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-6xl font-bold">
                        <span className="text-white">&apos;Let&apos;s Start</span>
                        <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text"> Right Here</span>
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Create a resume that will land you an interview. Packaged with AI capabilities that
                        save you time in writing.
                    </p>

                    <Button
                        className="group bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 transition-all duration-300"
                        onClick={handleResumeRoute}
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>

                    <p className="text-gray-200 text-4xl font-squarepeg">No sign up needed</p>
                </div>

                {/* Right Content - Resume Preview */}
                <div className="relative">
                    {/* Top gradient decoration */}
                    <div className="absolute -right-4 -top-4 w-32 h-8 bg-gradient-to-r from-blue-500 to-blue-600 blur-lg opacity-50" />

                    {/* Resume preview container */}
                    <div className="flex flex-col items-end">
                        {/* PDF text */}
                        <span className="text-gray-200 text-2xl font-squarepeg italic mb-2">
                            Available in PDF
                        </span>

                        {/* Image container with overlay effect */}
                        <div className="flex flex-col items-start justify-center drop-shadow-lg transition-all duration-300 filter brightness-[80%] hover:brightness-100">
                            <img
                                src="/template_preview.png"
                                alt="Resume Template Preview"
                                className="w-full h-auto object-cover rounded-lg"
                                style={{
                                    maxWidth: '600px',
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <JobResponsibility />

            {/* Wave Effects */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg
                    viewBox="0 0 1440 320"
                    className="w-full h-64 fill-violet-900/20"
                    preserveAspectRatio="none"
                >
                    <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                </svg>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-purple-900/20 pointer-events-none" />
        </div>
    );
};

export default LandingPage;