import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Upload, User, Target, Clock, Calendar } from 'lucide-react';

interface Props {
  onSubmit: (profile: UserProfile, file: File | null) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    targetPosition: '',
    weeklyHours: 10,
    totalDurationMonths: 3,
    resumeText: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Profile object बनाना
    const profile: UserProfile = {
      ...formData,
    };
    onSubmit(profile, file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
            <User className="w-3 h-3 mr-1" /> Name
          </label>
          <input
            required
            className="w-full p-3 rounded-lg border border-slate-200"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
            <Target className="w-3 h-3 mr-1" /> Dream Role
          </label>
          <input
            required
            className="w-full p-3 rounded-lg border border-slate-200"
            value={formData.targetPosition}
            onChange={(e) => setFormData({...formData, targetPosition: e.target.value})}
          />
        </div>
         {/* Weekly Hours */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-indigo-500" /> Hours per Week
          </label>
          <input
            type="number"
            min="1"
            max="168"
            required
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.weeklyHours}
            onChange={(e) => setFormData({...formData, weeklyHours: parseInt(e.target.value)})}
          />
        </div>

        {/* Total Duration */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Roadmap Duration (Months)
          </label>
          <input
            type="number"
            min="1"
            max="24"
            required
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.totalDurationMonths}
            onChange={(e) => setFormData({...formData, totalDurationMonths: parseInt(e.target.value)})}
          />
        </div>


        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center">
            <Upload className="w-3 h-3 mr-1" /> Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isLoading ? "Analyzing..." : "Generate Roadmap"}
      </button>
    </form>
  );
};

export default OnboardingForm;