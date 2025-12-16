
import React, { useState, useEffect } from 'react';
import { REGULATION_TERMS } from '../../../../content/pro/regulationContent';
import { TermCard } from '../tools/regulation/TermCard';
import { LicenseFinder } from '../tools/regulation/LicenseFinder';
import { CaseStudyGenerator } from '../tools/regulation/CaseStudyGenerator';
import { Button } from '../../../ui/Button';
import { jsPDF } from 'jspdf';
import { AcademyModuleState } from '../../../../types';

interface Props {
  moduleState?: AcademyModuleState;
  onUpdateState?: (data: Partial<AcademyModuleState>) => void;
}

type Tab = 'BASICS' | 'COMPLIANCE' | 'ENTITIES' | 'MARKET' | 'FRAMEWORKS' | 'FINDER' | 'CASES' | 'PDF';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'BASICS', label: 'Token Basics', icon: '🪙' },
    { id: 'COMPLIANCE', label: 'Compliance & ID', icon: '🆔' },
    { id: 'ENTITIES', label: 'Entities & Roles', icon: '🏛️' },
    { id: 'MARKET', label: 'Market Structure', icon: '📊' },
    { id: 'FRAMEWORKS', label: 'Legal Frameworks', icon: '⚖️' },
    { id: 'FINDER', label: 'License Finder', icon: '🕵️‍♀️' },
    { id: 'CASES', label: 'Case Studies', icon: '🎓' },
    { id: 'PDF', label: 'Final Export', icon: '📥' },
];

export const RegulationLicensesStep: React.FC<Props> = ({ moduleState, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<Tab>('BASICS');

  // Load existing data or initialize empty
  const [localData, setLocalData] = useState<any>(moduleState?.userNotes ? JSON.parse(moduleState.userNotes) : {});

  // Update local state and persist to parent immediately
  const handleUpdateLocal = (key: string, value: any) => {
      const newData = { ...localData, [key]: value };
      setLocalData(newData);
      if (onUpdateState) {
          onUpdateState({ userNotes: JSON.stringify(newData) });
      }
  };

  const handleNext = () => {
      // Explicit save on next
      if (onUpdateState) {
          onUpdateState({ userNotes: JSON.stringify(localData) });
      }

      const currentIndex = TABS.findIndex(t => t.id === activeTab);
      if (currentIndex < TABS.length - 1) {
          setActiveTab(TABS[currentIndex + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const generatePDF = () => {
      const doc = new jsPDF();
      let y = 20;
      const margin = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      const checkPageBreak = (add: number) => {
          if (y + add > pageHeight - margin) {
              doc.addPage();
              y = margin;
          }
      };

      // Header
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Regulation & Licenses 101", margin, 25);
      
      y = 60;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Strategic Analysis & Learning Path", margin, y);
      y += 10;
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Iterate through saved terms in localData
      const termsKeys = Object.keys(localData).filter(key => key.startsWith('term_'));
      
      if (termsKeys.length > 0) {
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text("1. Key Concepts & Definitions", margin, y);
          y += 10;

          termsKeys.forEach(key => {
              const termName = key.replace('term_', '');
              const context = localData[key];
              
              checkPageBreak(30);
              
              doc.setFontSize(14);
              doc.setTextColor(79, 70, 229); // Indigo
              doc.setFont("helvetica", "bold");
              doc.text(termName, margin, y);
              y += 7;
              
              doc.setFontSize(10);
              doc.setTextColor(60, 60, 60);
              doc.setFont("helvetica", "normal");
              const splitText = doc.splitTextToSize(context, pageWidth - (margin * 2));
              doc.text(splitText, margin, y);
              y += (splitText.length * 5) + 10;
          });
      }

      // Add Finder Results
      if (localData.license_finder_result) {
          checkPageBreak(60);
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text("2. Licensing Requirements", margin, y);
          y += 10;
          
          const licenses = localData.license_finder_result.licenses || [];
          licenses.forEach((lic: string) => {
              checkPageBreak(10);
              doc.setFontSize(11);
              doc.setTextColor(0, 0, 0);
              doc.setFont("helvetica", "normal");
              doc.text(`• ${lic}`, margin + 5, y);
              y += 7;
          });
          
          const restrictions = localData.license_finder_result.restrictions || [];
           if(restrictions.length > 0) {
              y += 5;
              doc.setTextColor(220, 38, 38); // Red
              doc.setFont("helvetica", "bold");
              doc.text("Restrictions:", margin + 5, y);
              y += 7;
              doc.setTextColor(0, 0, 0);
              doc.setFont("helvetica", "normal");
               restrictions.forEach((res: string) => {
                  checkPageBreak(10);
                  doc.text(`! ${res}`, margin + 5, y);
                  y += 7;
              });
           }
      }

      // Add Case Study
      if (localData.case_study_result) {
          checkPageBreak(60);
          const cs = localData.case_study_result;
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text("3. Case Study Analysis", margin, y);
          y += 10;

          doc.setFontSize(12);
          doc.setTextColor(79, 70, 229);
          doc.text("AI Simulation", margin, y);
          y += 8;

          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          // Handle string structure from mock
          const structure = doc.splitTextToSize(cs.structure || '', pageWidth - (margin*2));
          doc.text(structure, margin, y);
          y += (structure.length * 5) + 10;
      }

      doc.save("Regulation_Licenses_Overview.pdf");
      
      // Mark complete
      if(onUpdateState) onUpdateState({ completed: true });
  };

  // Helper for the "Save & Next" button
  const NextButton = () => (
      <div className="mt-12 flex justify-end pt-6 border-t border-slate-200">
          <Button 
            onClick={handleNext} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
              Save & Next Step <span>→</span>
          </Button>
      </div>
  );

  const renderContent = () => {
      switch(activeTab) {
          case 'BASICS': 
              return (
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Token Basics</h3>
                          <p className="text-slate-600">Understanding the core units of digital value. Click "Generate" on cards to see how they apply to your project.</p>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {REGULATION_TERMS.token_basics.map(term => (
                              <TermCard key={term.id} term={term} moduleState={localData} onUpdateState={handleUpdateLocal} />
                          ))}
                      </div>
                      <NextButton />
                  </div>
              );
          case 'COMPLIANCE':
               return (
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Compliance & Identity</h3>
                          <p className="text-slate-600">The rules of the road for investor onboarding and AML.</p>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {REGULATION_TERMS.compliance.map(term => (
                              <TermCard key={term.id} term={term} moduleState={localData} onUpdateState={handleUpdateLocal} />
                          ))}
                      </div>
                      <NextButton />
                  </div>
              );
          case 'ENTITIES':
              return (
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Entities & Roles</h3>
                          <p className="text-slate-600">The legal structures and partners involved in a compliant issuance.</p>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {REGULATION_TERMS.entities.map(term => (
                              <TermCard key={term.id} term={term} moduleState={localData} onUpdateState={handleUpdateLocal} />
                          ))}
                      </div>
                      <NextButton />
                  </div>
              );
          case 'MARKET':
              return (
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Market Structure</h3>
                          <p className="text-slate-600">How tokens are traded, settled, and custodied.</p>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {REGULATION_TERMS.market.map(term => (
                              <TermCard key={term.id} term={term} moduleState={localData} onUpdateState={handleUpdateLocal} />
                          ))}
                      </div>
                      <NextButton />
                  </div>
              );
          case 'FRAMEWORKS':
              return (
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Global Frameworks</h3>
                          <p className="text-slate-600">Key regulations shaping the industry across major jurisdictions.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                          {REGULATION_TERMS.frameworks.map(fw => (
                              <div key={fw.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow hover:border-indigo-300">
                                  <h4 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
                                      <span className="text-2xl">⚖️</span> {fw.label}
                                  </h4>
                                  <p className="text-slate-700 text-sm leading-relaxed">{fw.desc}</p>
                              </div>
                          ))}
                      </div>
                      <NextButton />
                  </div>
              );
          case 'FINDER':
              return (
                  <div className="space-y-8">
                       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">Interactive License Finder</h3>
                          <p className="text-slate-600">Identify potential regulatory requirements for your specific business model.</p>
                      </div>
                      <LicenseFinder onUpdateState={handleUpdateLocal} savedResult={localData.license_finder_result} />
                      <NextButton />
                  </div>
              );
          case 'CASES':
              return (
                   <div className="space-y-8">
                       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-2xl font-bold text-indigo-900 font-display mb-2">AI Case Studies</h3>
                          <p className="text-slate-600">Learn from simulated real-world scenarios in your sector.</p>
                      </div>
                      <CaseStudyGenerator onUpdateState={handleUpdateLocal} savedResult={localData.case_study_result} />
                      <NextButton />
                  </div>
              );
          case 'PDF':
              return (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto mt-8">
                      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl shadow-sm border border-emerald-200">
                          📥
                      </div>
                      <div>
                          <h2 className="text-4xl font-bold text-slate-900 font-display mb-3">Module Complete</h2>
                          <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
                              You have navigated through the regulatory landscape. 
                              Download your personalized study guide containing all generated contexts and insights.
                          </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 text-left bg-slate-50 p-8 rounded-2xl border border-slate-200 w-full max-w-lg">
                           <div>
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Contexts Generated</span>
                               <p className="text-3xl font-display font-bold text-indigo-600">{Object.keys(localData).filter(k => k.startsWith('term_')).length}</p>
                           </div>
                           <div>
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Strategies Found</span>
                               <p className="text-3xl font-display font-bold text-indigo-600">{(localData.license_finder_result ? 1 : 0) + (localData.case_study_result ? 1 : 0)}</p>
                           </div>
                      </div>

                      <Button 
                        onClick={generatePDF} 
                        className="px-12 py-5 text-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 rounded-2xl font-bold transform hover:-translate-y-1 transition-all"
                      >
                          Download PDF Guide
                      </Button>
                  </div>
              );
          default: return null;
      }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
       
       {/* Sidebar Navigation */}
       <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 hidden lg:flex">
           <div className="p-8 border-b border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Module Navigation</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
               {TABS.map(tab => (
                   <button
                       key={tab.id}
                       onClick={() => {
                           if(onUpdateState) onUpdateState({ userNotes: JSON.stringify(localData) });
                           setActiveTab(tab.id);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                       className={`
                           w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all text-left
                           ${activeTab === tab.id 
                               ? 'bg-indigo-600 text-white shadow-md' 
                               : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                           }
                       `}
                   >
                       <span className="text-xl">{tab.icon}</span>
                       {tab.label}
                   </button>
               ))}
           </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
           <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar pb-32">
               {renderContent()}
           </div>
       </div>

    </div>
  );
};
