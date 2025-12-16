
export type PartnerFieldType = 'text' | 'number' | 'select' | 'email' | 'date' | 'upload' | 'switch' | 'array_text';

export interface PartnerFormFieldConfig {
  name: string; // The key (e.g., spv_legal_name)
  label: string;
  type: PartnerFieldType;
  placeholder?: string;
  helperText?: string;
  options?: string[]; // For select inputs
  required?: boolean;
  defaultValue?: any;
  readOnly?: boolean; // For fixed values like token_standard=ERC3643
  visibilityCondition?: { field: string; value: any }; // Advanced logic
}

export interface PartnerFormSection {
  id: string;
  title: string;
  icon?: string;
  fields: PartnerFormFieldConfig[];
}

export interface PartnerFormSchema {
  partnerId: string;
  sections: PartnerFormSection[];
}
