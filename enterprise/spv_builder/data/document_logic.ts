
export interface SpvDocumentTemplate {
  id: string;
  title: string;
  category: 'Formation' | 'Governance' | 'Tax' | 'Banking';
  description: string;
  requiredFor: string[]; // e.g. ['LLC', 'C-Corp']
}

export const GET_DOCUMENTS_FOR_JURISDICTION = (countryCode: string): SpvDocumentTemplate[] => {
  const code = countryCode.split('-')[0]; // Handle US-DE -> US

  switch (code) {
    case 'IT': // Italy
      return [
        { id: 'it_1', title: 'Bozza Statuto (By-Laws)', category: 'Governance', description: 'Rules for shareholders and directors.', requiredFor: ['SRL', 'SPA'] },
        { id: 'it_2', title: 'Bozza Atto Costitutivo', category: 'Formation', description: 'Deed of Incorporation for the Notary.', requiredFor: ['SRL', 'SPA'] },
        { id: 'it_3', title: 'Template PEC Request', category: 'Formation', description: 'Request form for Certified Email.', requiredFor: ['SRL'] },
        { id: 'it_4', title: 'Modello Versamento Capitale', category: 'Banking', description: 'Bank instruction for 25% capital deposit.', requiredFor: ['SRL'] },
        { id: 'it_5', title: 'Modulo Privacy AML', category: 'Formation', description: 'Anti-money laundering declaration.', requiredFor: ['All'] }
      ];

    case 'US': // USA (Delaware/Wyoming)
      return [
        { id: 'us_1', title: 'Certificate of Formation', category: 'Formation', description: 'Filing template for Division of Corporations.', requiredFor: ['LLC', 'Series LLC'] },
        { id: 'us_2', title: 'Operating Agreement (LLC)', category: 'Governance', description: 'Internal governance contract. Critical for token rights.', requiredFor: ['LLC'] },
        { id: 'us_3', title: 'EIN Application (SS-4)', category: 'Tax', description: 'Letter to IRS to request Tax ID.', requiredFor: ['All'] },
        { id: 'us_4', title: 'FinCEN BOI Report', category: 'Formation', description: 'Beneficial Ownership Information report form.', requiredFor: ['All'] },
        { id: 'us_5', title: 'Action by Sole Incorporator', category: 'Governance', description: 'Initial resolution to appoint officers.', requiredFor: ['C-Corp'] }
      ];

    case 'EE': // Estonia
      return [
        { id: 'ee_1', title: 'Articles of Association (AoA)', category: 'Governance', description: 'Standard e-Residency AoA template.', requiredFor: ['OÜ'] },
        { id: 'ee_2', title: 'Shareholder Resolution', category: 'Governance', description: 'Resolution to issue tokens/assets.', requiredFor: ['OÜ'] },
        { id: 'ee_3', title: 'Director Appointment Letter', category: 'Formation', description: 'Consent to act as Management Board member.', requiredFor: ['OÜ'] },
        { id: 'ee_4', title: 'VASP License Application', category: 'Formation', description: 'Draft application for crypto service provider.', requiredFor: ['OÜ'] }
      ];

    case 'UK': // United Kingdom
      return [
        { id: 'uk_1', title: 'Memorandum of Association', category: 'Formation', description: 'Standard IN01 declaration.', requiredFor: ['LTD'] },
        { id: 'uk_2', title: 'Articles of Association', category: 'Governance', description: 'Model articles with crypto-asset amendments.', requiredFor: ['LTD'] },
        { id: 'uk_3', title: 'PSC Notification', category: 'Formation', description: 'Person with Significant Control declaration.', requiredFor: ['LTD'] }
      ];

    case 'AE': // UAE (DIFC/ADGM)
      return [
        { id: 'ae_1', title: 'Articles of Association', category: 'Governance', description: 'Common Law framework articles.', requiredFor: ['SPV'] },
        { id: 'ae_2', title: 'UBO Declaration', category: 'Formation', description: 'Ultimate Beneficial Owner disclosure.', requiredFor: ['SPV'] },
        { id: 'ae_3', title: 'Registered Office Consent', category: 'Formation', description: 'Letter from Corporate Service Provider.', requiredFor: ['SPV'] }
      ];

    default: // Generic / Other
      return [
        { id: 'gen_1', title: 'Memorandum of Understanding', category: 'Formation', description: 'Founders agreement draft.', requiredFor: ['All'] },
        { id: 'gen_2', title: 'Cap Table Template', category: 'Governance', description: 'Spreadsheet for equity tracking.', requiredFor: ['All'] },
        { id: 'gen_3', title: 'KYC Policy Draft', category: 'Formation', description: 'Standard AML/KYC internal policy.', requiredFor: ['All'] }
      ];
  }
};
