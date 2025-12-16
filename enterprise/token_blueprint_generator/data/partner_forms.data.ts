
import { PartnerFormSchema } from "../domain/partner_forms.types";

export const PARTNER_FORMS_DATA: Record<string, PartnerFormSchema> = {
  'securitize': {
    partnerId: 'securitize',
    sections: [
      {
        id: 'entity_details',
        title: 'Entity Identity',
        icon: '🏢',
        fields: [
          { name: 'spv_legal_name', label: 'SPV Legal Name', type: 'text', required: true, placeholder: 'e.g. Project Alpha LLC' },
          { name: 'spv_entity_type', label: 'Entity Type', type: 'select', options: ['LLC', 'C-Corp', 'LP', 'Trust'], required: true },
          { name: 'ein_tax_id', label: 'EIN / Tax ID', type: 'text', required: true, placeholder: 'XX-XXXXXXX' },
          { name: 'authorized_signatory', label: 'Authorized Signatory', type: 'text', required: true, placeholder: 'Full Name' }
        ]
      },
      {
        id: 'compliance_setup',
        title: 'Compliance & KYB',
        icon: '🛡️',
        fields: [
          { name: 'beneficial_owners', label: 'Beneficial Owners (>25%)', type: 'array_text', helperText: 'List full names of UBOs.' },
          { name: 'offering_type', label: 'Offering Exemption', type: 'select', options: ['Reg D 506(c)', 'Reg S', 'Reg CF', 'Reg A+'], required: true },
          { name: 'compliance_rules', label: 'Custom Compliance Rules', type: 'array_text', placeholder: 'e.g. Max 2000 Investors' }
        ]
      },
      {
        id: 'financials',
        title: 'Financials',
        icon: '💰',
        fields: [
          { name: 'target_raise', label: 'Target Raise ($)', type: 'number', required: true },
          { name: 'bank_account_info', label: 'Escrow / Bank Info', type: 'text', placeholder: 'Bank Name - IBAN/Account' }
        ]
      },
      {
        id: 'docs',
        title: 'Documentation',
        icon: '📂',
        fields: [
          { name: 'documents_uploaded', label: 'Legal Documents', type: 'upload', helperText: 'Upload Incorporation Cert, Operating Agreement, etc.' }
        ]
      }
    ]
  },
  'fleap': {
    partnerId: 'fleap',
    sections: [
      {
        id: 'company_info',
        title: 'Company Information',
        icon: '🇮🇹',
        fields: [
          { name: 'spv_name', label: 'SPV Name', type: 'text', required: true },
          { name: 'vat_number', label: 'VAT Number (P.IVA)', type: 'text', required: true },
          { name: 'legal_representative', label: 'Legal Representative', type: 'text', required: true },
          { name: 'visura_camerale', label: 'Visura Camerale', type: 'upload', required: true, helperText: 'Upload latest Chamber of Commerce record.' }
        ]
      },
      {
        id: 'token_specs',
        title: 'Digital Asset Specs',
        icon: '🪙',
        fields: [
          { name: 'token_standard', label: 'Token Standard', type: 'text', defaultValue: 'ERC3643', readOnly: true, helperText: 'Fleap enforces ERC3643 for compliance.' },
          { name: 'raise_amount', label: 'Total Raise Amount (€)', type: 'number', required: true },
          { name: 'custodian_selection', label: 'Preferred Custodian', type: 'select', options: ['BitGo', 'Coinbase Custody', 'Self-Custody (MultiSig)'], required: true }
        ]
      },
      {
        id: 'docs',
        title: 'Required Docs',
        icon: '📄',
        fields: [
          { name: 'appraisal_document', label: 'Asset Appraisal', type: 'upload', required: true },
          { name: 'whitepaper_mica', label: 'MiCA Whitepaper / Info Note', type: 'upload', required: true }
        ]
      }
    ]
  },
  'blocksquare': {
    partnerId: 'blocksquare',
    sections: [
      {
        id: 'property_data',
        title: 'Property & Legal',
        icon: '🏠',
        fields: [
          { name: 'land_registry_id', label: 'Land Registry ID', type: 'text', required: true, placeholder: 'Cadastral Number' },
          { name: 'ownership_percentage', label: 'Tokenized Ownership %', type: 'number', defaultValue: 100, required: true },
          { name: 'asset_appraisal', label: 'Certified Appraisal', type: 'upload', required: true }
        ]
      },
      {
        id: 'oceanpoint_setup',
        title: 'Protocol Setup',
        icon: '🌊',
        fields: [
          { name: 'corporate_resolution', label: 'Corporate Resolution', type: 'upload', helperText: 'Board resolution authorizing tokenization.' },
          { name: 'admin_wallet', label: 'Admin Wallet (ETH)', type: 'text', required: true, placeholder: '0x...' },
          { name: 'bspt_supply', label: 'BSPT Max Supply', type: 'number', required: true },
          { name: 'bsq_marketplace_toggle', label: 'List on Marketplace?', type: 'switch', defaultValue: true }
        ]
      },
      {
        id: 'inc_docs',
        title: 'Incorporation',
        icon: '📁',
        fields: [
          { name: 'spv_incorporation_docs', label: 'Incorporation Documents', type: 'upload', helperText: 'Articles of Association, Shareholder Registry' }
        ]
      }
    ]
  },
  'tokeny': {
    partnerId: 'tokeny',
    sections: [
      {
        id: 'identity',
        title: 'Identity System (ONCHAINID)',
        icon: '🆔',
        fields: [
          { name: 'spv_name', label: 'Issuer SPV Name', type: 'text', required: true },
          { name: 'erc3643_config', label: 'ERC-3643 Configuration', type: 'select', options: ['Standard T-REX', 'Custom Compliance'], required: true }
        ]
      },
      {
        id: 'compliance_rules',
        title: 'Transfer Rules',
        icon: '🚦',
        fields: [
          { name: 'investor_whitelist_jurisdictions', label: 'Whitelisted Jurisdictions', type: 'array_text', placeholder: 'e.g. US, DE, FR' },
          { name: 'transfer_restrictions', label: 'Global Restriction Type', type: 'select', options: ['Reg D Lockup', 'Reg S Geofence', 'Fully Transferable'], required: true },
          { name: 'agent_transfer_rules', label: 'Agent Rules', type: 'array_text', placeholder: 'e.g. Max 10k per day' }
        ]
      }
    ]
  },
  'digishares': {
    partnerId: 'digishares',
    sections: [
      {
        id: 'general',
        title: 'Platform Configuration',
        icon: '⚙️',
        fields: [
          { name: 'spv_info', label: 'SPV Details', type: 'text', required: true, placeholder: 'Name and Reg Number' },
          { name: 'jurisdiction_rules', label: 'Jurisdiction Logic', type: 'select', options: ['US Setup', 'EU Setup', 'Global Setup'], required: true }
        ]
      },
      {
        id: 'cap_table',
        title: 'Cap Table & Distribution',
        icon: '📊',
        fields: [
          { name: 'cap_table', label: 'Initial Cap Table (CSV)', type: 'upload', required: true },
          { name: 'distribution_rules', label: 'Dividend Rules', type: 'text', placeholder: 'e.g. Quarterly USDC to holders' }
        ]
      },
      {
        id: 'kyc_docs',
        title: 'Investor Onboarding',
        icon: '👥',
        fields: [
          { name: 'investor_documents', label: 'Investor Agreements', type: 'upload', helperText: 'Subscription Agreement Template' }
        ]
      }
    ]
  }
};
