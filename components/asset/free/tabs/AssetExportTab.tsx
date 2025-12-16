
import React from 'react';
import { Button } from '../../../ui/Button';
import { PropertyDatabaseSchema } from '../../../../types';
import { downloadPDF } from '../../../../utils/pdfGenerator';

interface Props {
  property: PropertyDatabaseSchema;
  onNextStep?: () => void;
}

const DetailRow = ({ label, value }: { label: string, value: string | number | undefined }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="text-slate-900 font-bold text-sm text-right">{value || '-'}</span>
    </div>
);

export const AssetExportTab: React.FC<Props> = ({ property, onNextStep }) => {

  const handleDownload = () => {
    const reportData = {
        AssetSummary: {
            Title: property.title,
            Type: property.property_type,
            Location: `${property.city}, ${property.country}`,
            Status: property.status
        },
        Valuation: {
            TotalValue: `€${property.total_value?.toLocaleString()}`,
            Currency: 'EUR'
        },
        Specifications: {
            YearBuilt: property.construction_year,
            Units: property.total_units,
            Size: `${property.interior_size_sqm} m²`,
            Condition: property.renovated_status
        },
        Team: {
            Sponsor: property.sponsor,
            Partner: property.property_manager
        },
        Strategy: {
            Description: property.description
        }
    };

    downloadPDF(`${property.title || 'Asset'}_Profile_Report`, reportData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Asset Passport Ready</h3>
            <p className="text-slate-500 max-w-lg mx-auto">
                You have successfully defined the core characteristics of your asset.
            </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div className="flex-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Project ID: #ASSET-{Math.floor(Math.random()*1000)}</span>
                    <h4 className="text-3xl font-bold text-slate-900 font-display">{property.title || 'Untitled Asset'}</h4>
                    <p className="text-sm text-slate-500 mt-1">{property.property_type} • {property.city}</p>
                </div>
                {property.image_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        <img src={property.image_url} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Financials</h5>
                    <DetailRow label="Total Valuation" value={`€${property.total_value?.toLocaleString()}`} />
                    <DetailRow label="Sponsor" value={property.sponsor} />
                </div>
                <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Specs</h5>
                    <DetailRow label="Units / Size" value={`${property.total_units || 0} Units / ${property.interior_size_sqm || 0} m²`} />
                    <DetailRow label="Condition" value={property.renovated_status} />
                    <DetailRow label="Est. Completion" value={property.completion_date} />
                </div>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Description</h5>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{property.description || 'No description provided.'}"
                </p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button variant="secondary" onClick={handleDownload} className="flex-1 border-slate-300 bg-white">
                📥 Download Asset Passport
            </Button>
            {onNextStep && (
                <Button onClick={onNextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    💾 Save & Continue to Compliance →
                </Button>
            )}
        </div>
    </div>
  );
};
