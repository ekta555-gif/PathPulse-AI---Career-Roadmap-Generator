import React, { useState, useEffect, useRef } from 'react';
import { LearningPath, UserProfile } from '../types';
import { createAgentChat } from '../services/geminiService';

interface Props {
  path: LearningPath;
  profile: UserProfile;
}

const RoadmapView: React.FC<Props> = ({ path, profile }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
    chatRef.current = createAgentChat(profile, path);
    setMessages([{ 
      role: 'agent', 
      text: `Welcome, ${profile.name}! I've synthesized your custom path to ${path.targetRole}. I analyzed your background and found ${path.skillGaps?.length || 0} key areas to bridge. Where should we start?` 
    }]);
  } catch (err) {
    console.error("Chat Agent Error:", err);
    setMessages([{ role: 'agent', text: "Chat assistant is offline, but your roadmap is ready below!" }]);
  }
}, [path, profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'agent', text: result.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', text: "I encountered a minor processing error. Please rephrase your query." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const downloadRoadmap = () => {
    const content = `PATHPULSE AI REPORT\n===================\nRole: ${path.targetRole}\nTarget: ${profile.name}\n\nSUMMARY:\n${path.summary}\n\nPLAN:\n${path.roadmap.map(w => `Week ${w.week}: ${w.topic}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PathPulse-Roadmap.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-8 animate-fadeIn">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active Learning</span>
                  <span className="text-slate-400 text-xs font-bold tracking-tighter">PROJECT ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Roadmap to</span> {path.targetRole}
                </h1>
              </div>
              <button 
                onClick={downloadRoadmap}
                className="group flex items-center space-x-3 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-slate-200"
              >
                <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Report</span>
              </button>
            </div>
            
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-indigo-200 pl-6 py-1">
              {path.summary}
            </p>

            <div className="flex flex-wrap gap-2">
              {path.skillGaps.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-2 px-4 py-2 bg-indigo-50/60 border border-indigo-100/50 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                  <span className="text-indigo-800 text-xs font-bold uppercase tracking-wide">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span>Curated Curriculum</span>
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{path.roadmap.length} Milestone Weeks</div>
          </div>
          
          <div className="relative border-l-2 border-slate-200 ml-6 pl-10 space-y-12 pb-8">
            {path.roadmap.map((week, idx) => (
              <div key={idx} className="relative group">
                {/* Connector Node */}
                <div className="absolute -left-[51px] top-0 w-6 h-6 rounded-xl bg-white border-2 border-slate-200 group-hover:border-indigo-600 transition-colors flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600">{week.week}</span>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/60 p-8 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-1 relative">
                  <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-50 transition-colors">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">Milestone Week {week.week}</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{week.topic}</h3>
                    <p className="text-slate-500 font-medium">{week.objective}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {week.resources.map((res, rIdx) => (
                      <a 
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all group/res"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                             <span className="text-[9px] font-black uppercase text-indigo-500 tracking-tighter">{res.type}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover/res:text-indigo-700 transition-colors leading-snug">{res.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{res.description}</p>
                        </div>
                        <div className="ml-4 opacity-0 group-hover/res:opacity-100 transform translate-x-2 group-hover/res:translate-x-0 transition-all text-indigo-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Agent Sidebar */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/40 flex flex-col h-[650px] overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <span className="font-bold text-base block leading-tight">Career Agent</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Assistant</span>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm space-x-1.5 flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-duration:0.6s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-white">
            <div className="relative group">
              <input
                type="text"
                placeholder="Deep dive into this path..."
                className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all text-sm font-medium"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isChatting}
                className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-1 mt-4">
              <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Synthesized Live</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;