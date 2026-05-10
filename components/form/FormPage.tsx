import { Page } from '@/types';
import { FieldRenderer } from './FieldRenderer';

interface FormPageProps {
  page: Page;
  responses: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function FormPage({ page, responses, onChange }: FormPageProps) {
  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">{page.title}</h3>
        {page.description && (
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">{page.description}</p>
        )}
      </div>

      <div className="space-y-8">
        {page.fields.sort((a, b) => a.order - b.order).map((field) => (
          <div key={field.id} className="animate-in fade-in duration-300">
            <label htmlFor={field.id} className="block text-sm font-semibold text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500 ml-1" title="Obrigatório">*</span>}
            </label>
            <FieldRenderer 
              field={field} 
              value={responses[field.id]} 
              allResponses={responses}
              onChange={(val: any) => onChange(field.id, val)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
