
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { tokenBlueprintService } from '../services/token_blueprint_service';
import { TokenBlueprintEntity } from '../domain/token_blueprint.entity';
import { RouteSelection } from './RouteSelection';
import { PartnerIntegration } from './PartnerIntegration';
import { PartnerConfiguration } from './PartnerConfiguration';
import { GenericPartnerForm } from './GenericPartnerForm';
import { DeFiArchitectView } from './defi/DeFiArchitectView'; 
import { TokenizationPartner } from '../data/tokenization_partners';

// Modes
type WizardMode = 'ROUTE_SELECT' | 'PARTNER_INTEGRATION' | 'PARTNER_CONFIG' | 'GENERIC_FORM' | 'DEFI_ARCHITECT';

export const TokenBlueprintWizard: React.FC = () => {
  const [mode, setMode] = useState<WizardMode>('ROUTE_SELECT');
  const [blueprint, setBlueprint] = useState<TokenBlueprintEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<TokenizationPartner | null>(null);

  // Mock Inputs
  const mockContext = {
      projectId: '1',
      projectName: 'Alpha Tower',
      assetType: 'Real Estate',
      jurisdictionCode: 'IT', 
      valuation: { valueCentral: 10000000, currency: 'EUR' }
  };

  const handleGenerateInitial = async () => {
    setLoading(true);
    try {
        const mockSpv = { country: mockContext.jurisdictionCode };
        const result = await tokenBlueprintService.generateBlueprint(
            { id: mockContext.projectId, name: mockContext.projectName, assetType: mockContext.assetType }, 
            mockSpv, 
            mockContext.valuation
        );
        setBlueprint(result);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const updateBlueprint = (changes: Partial<TokenBlueprintEntity>) => {
      if (!blueprint) return;
      tokenBlueprintService.refineEconomics(blueprint, changes).then(setBlueprint);
  };

  const handleRouteSelect = (route: 'PARTNER' | 'DEFI') => {
      if (route === 'PARTNER') {
          setMode('PARTNER_INTEGRATION');
      } else {
          // Initialize blueprint for DeFi mode then switch
          setMode('DEFI_ARCHITECT'); // Set mode first to show loading state
          handleGenerateInitial(); 
      }
  };

  const handlePartnerSelect = (partner: TokenizationPartner) => {
      setSelectedPartner(partner);
      setMode('PARTNER_CONFIG');
  };

  const handlePartnerComplete = () => {
      setMode('DEFI_ARCHITECT');
      handleGenerateInitial();
  };

  // --- RENDERERS ---

  if (mode === 'ROUTE_SELECT') {
      return <RouteSelection onSelect={handleRouteSelect} />;
  }

  if (mode === 'PARTNER_INTEGRATION') {
      return (
          <div className="h-full flex flex-col">
              <div className="mb-4 flex items-center gap-2 shrink-0">
                  <button onClick={() => setMode('ROUTE_SELECT')} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider">
                      ← Back to Strategy
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  <PartnerIntegration 
                      jurisdictionCode={mockContext.jurisdictionCode} 
                      onSelectPartner={handlePartnerSelect} 
                      onProvideLater={() => setMode('GENERIC_FORM')}
                  />
              </div>
          </div>
      );
  }

  if (mode === 'PARTNER_CONFIG' && selectedPartner) {
      return (
          <PartnerConfiguration 
             partner={selectedPartner}
             projectContext={mockContext}
             onBack={() => setMode('PARTNER_INTEGRATION')}
             onComplete={handlePartnerComplete}
          />
      );
  }

  if (mode === 'GENERIC_FORM') {
      return (
          <GenericPartnerForm 
             projectContext={mockContext}
             onBack={() => setMode('PARTNER_INTEGRATION')}
             onComplete={handlePartnerComplete}
          />
      );
  }

  // --- DEFI ARCHITECT MODE ---
  
  if (mode === 'DEFI_ARCHITECT') {
      if (loading || !blueprint) {
          return (
              <div className="flex flex-col items-center justify-center h-full space-y-6 bg-slate-900 rounded-3xl border border-slate-800">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <h2 className="text-2xl font-bold text-white font-display">Initializing Architect...</h2>
              </div>
          );
      }

      return (
          <DeFiArchitectView 
              blueprint={blueprint} 
              updateBlueprint={updateBlueprint}
              onExit={() => setMode('ROUTE_SELECT')}
          />
      );
  }

  return <div>Error: Unknown State</div>;
};
