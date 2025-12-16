
import React, { useState } from 'react';
import { PartnerFormSchema, PartnerFormFieldConfig } from '../../domain/partner_forms.types';
import { Button } from '../../../../components/ui/Button';

interface Props {
  schema: PartnerFormSchema;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const DynamicPartnerForm: React.FC<Props> = ({ schema, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayAdd = (name: string, newItem: string) => {
    if (!newItem) return;
    const currentArray = formData[name] || [];
    setFormData(prev => ({ ...prev, [name]: [...currentArray, newItem] }));
  };

  const handleArrayRemove = (name: string, index: number) => {
    const currentArray = formData[name] || [];
    setFormData(prev => ({ ...prev, [name]: currentArray.filter((_: any, i: number) => i !== index) }));
  };

  const renderField = (field: PartnerFormFieldConfig) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : (field.defaultValue || '');

    // READ ONLY / FIXED
    if (field.readOnly) {
      return (
        <div key={field.name} className="mb-4">
           <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{field.label}</label>
           <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 font-mono">
              {value}
              {field.helperText && <span className="block text-[10px] text-slate-500 mt-1 italic">{field.helperText}</span>}
           </div>
        </div>
      );
    }

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="mb-4">
             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                 {field.label} {field.required && <span className="text-red-500">*</span>}
             </label>
             <div className="relative">
                 <select
                    value={value}
                    onChange={e => handleChange(field.name, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                 >
                    <option value="">Select...</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
             </div>
             {field.helperText && <p className="text-[10px] text-slate-500 mt-1">{field.helperText}</p>}
          </div>
        );

      case 'upload':
        return (
          <div key={field.name} className="mb-4">
             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                 {field.label} {field.required && <span className="text-red-500">*</span>}
             </label>
             <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 hover:bg-slate-900 transition-colors cursor-pointer text-center group">
                 <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                 <p className="text-sm text-slate-400 font-medium">
                     {value ? 'File Selected' : 'Click to Upload'}
                 </p>
                 <p className="text-xs text-slate-500 mt-1">{field.helperText || 'PDF, DOCX, JSON'}</p>
             </div>
          </div>
        );

      case 'switch':
        return (
           <div key={field.name} className="mb-4 flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div>
                  <label className="text-sm font-bold text-white block">{field.label}</label>
                  {field.helperText && <p className="text-[10px] text-slate-500">{field.helperText}</p>}
              </div>
              <div 
                  onClick={() => handleChange(field.name, !value)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-indigo-500' : 'bg-slate-600'}`}
              >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${value ? 'left-6' : 'left-1'}`}></div>
              </div>
           </div>
        );

      case 'array_text':
        return (
          <div key={field.name} className="mb-4">
             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                 {field.label}
             </label>
             <div className="space-y-2 mb-2">
                 {(Array.isArray(value) ? value : []).map((item: string, idx: number) => (
                     <div key={idx} className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded border border-slate-700">
                         <span className="text-sm text-white">{item}</span>
                         <button onClick={() => handleArrayRemove(field.name, idx)} className="text-red-500 hover:text-red-400 text-xs font-bold">✕</button>
                     </div>
                 ))}
             </div>
             <div className="flex gap-2">
                 <input 
                    id={`input-${field.name}`}
                    type="text"
                    placeholder={field.placeholder || 'Add new item...'}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            handleArrayAdd(field.name, target.value);
                            target.value = '';
                        }
                    }}
                 />
                 <button 
                    onClick={() => {
                        const el = document.getElementById(`input-${field.name}`) as HTMLInputElement;
                        if(el) { handleArrayAdd(field.name, el.value); el.value = ''; }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm border border-slate-700"
                 >
                     Add
                 </button>
             </div>
             {field.helperText && <p className="text-[10px] text-slate-500 mt-1">{field.helperText}</p>}
          </div>
        );

      default: // Text, Number, Email, Date
        return (
          <div key={field.name} className="mb-4">
             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                 {field.label} {field.required && <span className="text-red-500">*</span>}
             </label>
             <input 
                type={field.type}
                value={value}
                onChange={e => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
             />
             {field.helperText && <p className="text-[10px] text-slate-500 mt-1">{field.helperText}</p>}
          </div>
        );
    }
  };

  return (
    <div className="animate-fadeIn pb-10">
        {schema.sections.map(section => (
            <div key={section.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                    <span className="text-2xl">{section.icon || '📝'}</span>
                    <h3 className="text-lg font-bold text-white font-display">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {section.fields.map(field => (
                         <div key={field.name} className={field.type === 'array_text' || field.type === 'upload' ? 'md:col-span-2' : 'col-span-1'}>
                             {renderField(field)}
                         </div>
                    ))}
                </div>
            </div>
        ))}

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSubmit(formData)} className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 px-8">
                Save & Deploy Configuration
            </Button>
        </div>
    </div>
  );
};
