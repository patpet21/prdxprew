
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { projectService } from '../services/project_service';
import { ProjectIntakeData } from '../domain/project.entity';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

export const ProjectWizard: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectIntakeData>({
    projectName: '',
    assetType: 'Real Estate',
    location: '',
    goal: 'Liquidity',
    targetRaise: 0,
    targetInvestor: 'Accredited',
    timeline: '3-6 Months',
    description: ''
  });

  const handleChange = (field: keyof ProjectIntakeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.projectName || !formData.location || formData.targetRaise <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await projectService.createProject(formData);
      onComplete();
    } catch (e) {
      console.error(e);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-white font-display">New Project Intake</h3>
          <p className="text-slate-400 text-sm mt-1">Define the core parameters to initialize the structuring engine.</p>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
          Draft Mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Project Name</label>
            <input 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
              value={formData.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
              placeholder="e.g. Manhattan Skyline Fund"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Asset Type</label>
            <div className="relative">
                <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none appearance-none"
                value={formData.assetType}
                onChange={e => handleChange('assetType', e.target.value)}
                >
                <option>Real Estate</option>
                <option>Business</option>
                <option>Debt</option>
                <option>Art</option>
                <option>Funds</option>
                <option>Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Location (Jurisdiction)</label>
            <input 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
              value={formData.location}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="e.g. New York, USA"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Primary Goal</label>
            <div className="relative">
                <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none appearance-none"
                value={formData.goal}
                onChange={e => handleChange('goal', e.target.value)}
                >
                <option>Liquidity</option>
                <option>Capital Raise</option>
                <option>Community</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Target Raise ($)</label>
            <input 
              type="number"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none font-mono placeholder:text-slate-600"
              value={formData.targetRaise || ''}
              onChange={e => handleChange('targetRaise', parseFloat(e.target.value))}
              placeholder="5000000"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Target Investor</label>
            <div className="relative">
                <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none appearance-none"
                value={formData.targetInvestor}
                onChange={e => handleChange('targetInvestor', e.target.value)}
                >
                <option>Accredited</option>
                <option>Institutional</option>
                <option>Retail</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Timeline</label>
            <div className="relative">
                <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:border-amber-500 outline-none appearance-none"
                value={formData.timeline}
                onChange={e => handleChange('timeline', e.target.value)}
                >
                <option>ASAP</option>
                <option>3-6 Months</option>
                <option>6-12 Months</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Project Description</label>
        <textarea 
          className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none resize-none leading-relaxed placeholder:text-slate-600"
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Describe the asset, the business model, and the unique value proposition..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-800">
        <Button variant="secondary" onClick={onCancel} className="flex-1 order-2 sm:order-1 bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" disabled={loading}>
            Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={loading} className="flex-1 order-1 sm:order-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold shadow-lg shadow-amber-500/20 py-3.5">
          {loading ? 'AI Architecting...' : 'Create & Analyze'}
        </Button>
      </div>
    </div>
  );
};
