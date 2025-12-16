
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';

interface Props {
  projectContext: any;
  onBack: () => void;
  onComplete: () => void;
}

export const GenericPartnerForm: React.FC<Props> = ({ projectContext, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
      contactName: '',
      email: '',
      requirements: '',
      timeline: '3 Months',
      budgetRange: '$50k - $100k'
  });

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fadeIn p-6">
       <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
                  📝
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Provider RFP Request</h2>
              <p className="text-slate-400 text-sm mt-2">
                  Don't want to select a partner yet? Fill out this generic specification. 
                  We will generate a "Request for Proposal" (RFP) package you can send to any vendor later.
              </p>
          </div>

          <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Timeline Target</label>
                      <select 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                          value={formData.timeline}
                          onChange={e => setFormData({...formData, timeline: e.target.value})}
                      >
                          <option>ASAP</option>
                          <option>3 Months</option>
                          <option>6 Months+</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Est. Tech Budget</label>
                      <select 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                          value={formData.budgetRange}
                          onChange={e => setFormData({...formData, budgetRange: e.target.value})}
                      >
                          <option>Under $10k</option>
                          <option>$10k - $50k</option>
                          <option>$50k - $100k</option>
                          <option>Enterprise ($100k+)</option>
                      </select>
                  </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Specific Requirements</label>
                  <textarea 
                      className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none resize-none placeholder:text-slate-600"
                      placeholder="Describe any specific needs (e.g. 'Must support metamask', 'Needs dividends dashboard', 'White label only')..."
                      value={formData.requirements}
                      onChange={e => setFormData({...formData, requirements: e.target.value})}
                  />
              </div>

              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-400 leading-relaxed">
                  <strong>Note:</strong> This information will be saved to your project file under "Tech Specs". 
                  The Token Blueprint will use generic assumptions (ERC-1400) for now.
              </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
              <Button variant="secondary" onClick={onBack} className="flex-1 bg-slate-800 text-slate-300 hover:bg-slate-700">Back</Button>
              <Button onClick={onComplete} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">Save & Continue</Button>
          </div>
       </div>
    </div>
  );
};
