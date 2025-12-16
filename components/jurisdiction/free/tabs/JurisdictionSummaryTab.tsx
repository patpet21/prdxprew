
import React from 'react';
import { TokenizationState } from '../../../../types';
import { Button } from '../../../ui/Button';
import { downloadPDF } from '../../../../utils/pdfGenerator';

interface Props {
  data: TokenizationState;
  onNextStep: () => void;
}

export const JurisdictionSummaryTab: React.FC<Props> = ({ data, onNextStep }) => {
  const { jurisdiction } = data;
  const { entityDetails, detailedSpv } = jurisdiction;

  // Prefer detailed data if available from the new form
  const spvName = detailedSpv?.spvLegalNameHint || entityDetails.companyName || 'New Entity';
  const spvForm = detailedSpv?.spvLegalForm || jurisdiction.spvType;
  const region = jurisdiction.region || entityDetails.registrationState || detailedSpv?.spvCountry;
  const directors = detailedSpv?.numberOfDirectors || entityDetails.directors?.length || 1;
  const complexity = detailedSpv?.complexityLevel || 'Standard';

  const handleDownload = () => {
      // Create a specific object for the PDF to keep it clean
      const reportData = {
          Jurisdiction: {
              Country: jurisdiction.country,
              Region: region,
              LegalStructure: spvForm,
              RegulatoryRegime: jurisdiction.regulatoryRegime || 'Standard'
          },
          EntityDetails: {
              Name: spvName,
              Address: entityDetails.registeredAddress || 'Registered Agent Office',
              ShareCapital: entityDetails.shareCapital || detailedSpv?.setupCostEstimateRange || 'Not Set',
              DirectorsCount: directors,
              Complexity: complexity
          },
          Project: {
              Name: data.projectInfo.projectName,
              AssetClass: data.projectInfo.assetClass
          },
          StrategicNotes: {
              Role: detailedSpv?.spvRoleType || 'Asset Holder',
              TaxAdvantage: detailedSpv?.knownTaxAdvantages || 'Pending Analysis'
          }
      };

      downloadPDF(`${data.projectInfo.projectName}_Jurisdiction_Report`, reportData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display">Jurisdiction Strategy Locked</h3>
            <p className="text-slate-500">Review your legal structure configuration.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="text-xl font-bold text-slate-900">{spvName}</h4>
                    <p className="text-sm text-slate-500">{spvForm} • {jurisdiction.country}</p>
                </div>
                <div className="text-4xl">🏛️</div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Domicile</span>
                        <span className="text-slate-900 font-medium">{region || '-'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Complexity</span>
                        <span className={`text-slate-900 font-medium px-2 py-0.5 rounded text-xs border ${complexity === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {complexity}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Registered Agent</span>
                        <span className="text-slate-900 font-medium">{entityDetails.formationAgent || 'TBD'}</span>
                    </div>
                     <div>
                        <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Primary Role</span>
                        <span className="text-slate-900 font-medium">{detailedSpv?.spvRoleType || 'Asset Holder'}</span>
                    </div>
                </div>

                <div>
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-2">Governance Snapshot</span>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm border border-slate-200">
                            {directors} Director(s)
                        </span>
                        {detailedSpv?.localDirectorRequired && (
                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm border border-amber-200">
                                Local Director Req.
                            </span>
                        )}
                         {detailedSpv?.bankAccountNeeded && (
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                                Bank Account Req.
                            </span>
                        )}
                    </div>
                </div>
                
                {detailedSpv?.knownTaxAdvantages && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-400 uppercase block mb-1">AI Tax Note</span>
                        <p className="text-sm text-indigo-900 leading-relaxed italic">
                            "{detailedSpv.knownTaxAdvantages}"
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" onClick={handleDownload} className="border-slate-300 bg-white">
                📥 Download PDF Report
            </Button>
            <Button onClick={onNextStep} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                💾 Save & Continue to Asset →
            </Button>
        </div>
    </div>
  );
};
