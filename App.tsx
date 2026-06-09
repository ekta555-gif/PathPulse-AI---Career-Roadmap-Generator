import React, { useState } from 'react';
import Layout from './components/Layout';
import OnboardingForm from './components/OnboardingForm';
import RoadmapView from './components/RoadmapView';
import { UserProfile, LearningPath } from './types';
import { generateLearningPath } from './services/geminiService';

const App: React.FC = () => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

const handleStartPath = async (profile: UserProfile) => {
setLoading(true);
setError(null);
setLearningPath(null);
setActiveProfile(profile);
try {
const path = await generateLearningPath(profile);
if (!path || !path.roadmap) {
      throw new Error("AI could not generate a valid roadmap. Please try again.");
    }

    setLearningPath(path);
    // Timeout so that React can have time to render then scroll 
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

  } catch (err: any) {
    console.error("Frontend Error:", err);
    setError(err.response?.data?.detail || err.message || 'Server connection failed.');
    setLearningPath(null);
  } finally {
    setLoading(false);
  }
};

const handleReset = () => {
setLearningPath(null);
setError(null);
setActiveProfile(null);
};

return (
<Layout>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
{!learningPath ? (
<div className="space-y-12 animate-in">
<div className="text-center space-y-4 max-w-3xl mx-auto">
<div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 mb-4">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
</span>
<span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Powered by Gemini 3 Flash</span>
</div>
<h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
Architect Your <span className="text-indigo-600">Future Career</span>.
</h1>
<p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
Give us your resume, tell us where you want to go, and our AI agent will map the shortest distance between here and there.
</p>
</div>


{error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-800 px-4 py-4 rounded-2xl flex items-center space-x-3 shadow-sm animate-bounce">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-sm">Action Failed</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        <OnboardingForm onSubmit={handleStartPath} isLoading={loading} />
      </div>
    ) : (
      <div className="space-y-6 animate-in">
        <button 
          onClick={handleReset}
          className="group flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition font-bold text-sm uppercase tracking-wider"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to start</span>
        </button>
        {activeProfile && <RoadmapView path={learningPath} profile={activeProfile} />}
      </div>
    )}
  </div>
</Layout>

);
};

export default App;  