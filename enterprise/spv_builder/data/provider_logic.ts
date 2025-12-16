
import { DetailedSpvProfile } from '../../../types';

export interface SpvProviderOption {
  id: string;
  name: string;
  type: 'Digital Platform' | 'Legal Firm' | 'Service' | 'Government';
  logo: string;
  description: string;
  primaryAction: string; // Label for the button
  secondaryAction?: string;
  costEstimate?: string;
  isRecommended?: boolean;
}

export const getProvidersForSpv = (
  countryCode: string, 
  spvType: string, 
  role: string
): SpvProviderOption[] => {
  
  const normalizedCountry = countryCode.split('-')[0]; // Handle US-DE -> US

  // --- 🇮🇹 ITALY ---
  if (normalizedCountry === 'IT') {
    return [
      {
        id: 'blockchainre',
        name: 'BlockchainRE',
        type: 'Digital Platform',
        logo: '🟦',
        description: 'Specialized in Italian Real Estate SPVs (S.r.l.) with integrated notarization workflows and tokenization bridge.',
        primaryAction: 'Send SPV Package to BlockchainRE',
        secondaryAction: 'Export Legal Package (.zip)',
        costEstimate: '€3,500 + VAT',
        isRecommended: true
      },
      {
        id: 'lex_dao',
        name: 'LexDAO Italy',
        type: 'Legal Firm',
        logo: '⚖️',
        description: 'Traditional legal structuring with crypto-asset focus.',
        primaryAction: 'Request Engagement Letter',
        costEstimate: '€5,000+'
      },
      {
        id: 'manual_notary',
        name: 'External Notary',
        type: 'Service',
        logo: '📜',
        description: 'Manual submission. You will receive the incorporation draft to bring to your own Notaio.',
        primaryAction: 'Download "Atto Costitutivo" Draft'
      }
    ];
  }

  // --- 🇺🇸 USA ---
  if (normalizedCountry === 'US') {
    return [
      {
        id: 'stripe_atlas',
        name: 'Stripe Atlas',
        type: 'Digital Platform',
        logo: '🌐',
        description: 'Instant Delaware C-Corp or LLC formation. Integrated with banking.',
        primaryAction: 'Submit Package to Atlas',
        costEstimate: '$500',
        isRecommended: true
      },
      {
        id: 'legalzoom',
        name: 'LegalZoom',
        type: 'Service',
        logo: 'LZ',
        description: 'Standard LLC formation service. Good for simple structures.',
        primaryAction: 'Export Filing Data',
        costEstimate: '$149 + State Fees'
      },
      {
        id: 'clerky',
        name: 'Clerky',
        type: 'Digital Platform',
        logo: '©️',
        description: 'High-growth startup focus. Best for C-Corps raising Venture Capital.',
        primaryAction: 'Push to Clerky',
        costEstimate: '$799'
      }
    ];
  }

  // --- 🇪🇺 ESTONIA ---
  if (normalizedCountry === 'EE') {
    return [
      {
        id: 'companio',
        name: 'Companio',
        type: 'Digital Platform',
        logo: '🇪🇪',
        description: 'SaaS for Estonian companies. Handles accounting and compliance for e-Residents.',
        primaryAction: 'Forward to Companio',
        secondaryAction: 'Download SPV Bundle',
        costEstimate: '€79/mo',
        isRecommended: true
      },
      {
        id: 'xolo',
        name: 'Xolo Leap',
        type: 'Service',
        logo: 'XO',
        description: 'Banking and formation for solo-preneurs and small SPVs.',
        primaryAction: 'Apply via Xolo',
        costEstimate: '€89/mo'
      }
    ];
  }

  // --- 🇬🇧 UK ---
  if (normalizedCountry === 'UK') {
    return [
      {
        id: 'companies_house',
        name: 'Companies House Direct',
        type: 'Government',
        logo: '👑',
        description: 'Direct filing with the UK registrar. Fastest and cheapest method.',
        primaryAction: 'Generate IN01 Form',
        costEstimate: '£12'
      },
      {
        id: 'seedlegals',
        name: 'SeedLegals',
        type: 'Digital Platform',
        logo: '🌱',
        description: 'Automated funding rounds and cap table management for UK entities.',
        primaryAction: 'Sync with SeedLegals',
        isRecommended: true
      }
    ];
  }

  // --- 🇦🇪 UAE ---
  if (normalizedCountry === 'AE') {
    return [
      {
        id: 'adgm_digital',
        name: 'ADGM Digital Court',
        type: 'Government',
        logo: '🇦🇪',
        description: 'Direct registration for Tech Startups and SPVs in Abu Dhabi Global Market.',
        primaryAction: 'Submit Application',
        costEstimate: '$1,000',
        isRecommended: true
      }
    ];
  }

  // Default / Fallback
  return [
    {
      id: 'manual_legal',
      name: 'Local Legal Counsel',
      type: 'Legal Firm',
      logo: '🤵',
      description: `Manual formation required for ${countryCode}. We generate the briefing package for your lawyer.`,
      primaryAction: 'Download Legal Brief (.pdf)',
      secondaryAction: 'Find Local Partner',
      costEstimate: 'Variable'
    }
  ];
};
