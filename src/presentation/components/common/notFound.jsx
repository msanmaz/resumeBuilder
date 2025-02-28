import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-purple-900/20 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-white mt-4">
            Page Not Found
          </h2>
          <p className="text-neutral-400 mt-4 text-lg">
            Oops! The page you are looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link 
            to="/resume" 
            className="flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Resume Builder
          </Link>
        </div>
      </div>

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
    </div>
  );
};

export default NotFound;