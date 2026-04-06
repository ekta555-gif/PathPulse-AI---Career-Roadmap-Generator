
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <header className="glass-effect border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  PathPulse<span className="text-indigo-600">.AI</span>
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Intelligence Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
              <button className="hidden sm:block bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition shadow-md shadow-slate-200">
                GitHub Repo
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} PathPulse AI. Built with Gemini 3 Flash and React 19.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
