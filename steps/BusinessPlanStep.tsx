
import React, { useState } from 'react';
import { StepProps } from '../types';
import { useFreeBusinessPlan } from '../hooks/useFreeBusinessPlan';
import { BusinessPlanSidebar, PLAN_SECTIONS } from '../components/business_plan/BusinessPlanSidebar';
import { DynamicSectionEditor } from '../components/business_plan/DynamicSectionEditor';
import { BusinessPlanFinalExport } from '../components/business_plan/BusinessPlanFinalExport';

export const BusinessPlanStep: React.FC<StepProps> = ({ 
  data, 
  onValidationChange
}) => {
  const [activeSectionId, setActiveSectionId] = useState('projectIdentification');
  const { plan, updateSection } = useFreeBusinessPlan(data);

  // Always valid as this is a workspace step
  React.useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const activeSectionLabel = PLAN_SECTIONS.find(s => s.id === activeSectionId)?.label || 'Edit Section';

  const handleNextSection = () => {
    const idx = PLAN_SECTIONS.findIndex(s => s.id === activeSectionId);
    if (idx < PLAN_SECTIONS.length - 1) {
        setActiveSectionId(PLAN_SECTIONS[idx + 1].id);
    }
  };

  return (
    <div className="flex h-screen max-h-[800px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl animate-fadeIn">
        {/* Left Sidebar */}
        <BusinessPlanSidebar 
            activeSection={activeSectionId} 
            onSelect={setActiveSectionId}
            planData={plan}
        />

        {/* Right Content */}
        <div className="flex-1 overflow-hidden">
            {activeSectionId === 'exportPdf' ? (
                <BusinessPlanFinalExport planData={plan} />
            ) : (
                <DynamicSectionEditor 
                    key={activeSectionId} // Force re-render on switch
                    sectionId={activeSectionId}
                    sectionTitle={activeSectionLabel}
                    content={plan[activeSectionId] || ''}
                    onChange={(val) => updateSection(activeSectionId, val)}
                    onNext={handleNextSection}
                />
            )}
        </div>
    </div>
  );
};
