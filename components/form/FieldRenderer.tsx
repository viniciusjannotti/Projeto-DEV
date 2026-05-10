import { Field } from '@/types';
import { ImagePlus, Info, UploadCloud, X, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FieldRendererProps {
  field: Field;
  value: any;
  allResponses?: Record<string, any>;
  onChange: (value: any) => void;
}

export function FieldRenderer({ field, value, allResponses, onChange }: FieldRendererProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Configuracao Dropzone (para o tipo File)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    
    // Mock do Upload - Converte pra base64 para o preiew
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    
    // Quando tiver supabase real: supabase.storage.from('logos').upload(...)
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  switch (field.type) {
    case 'text':
      return (
        <input
          id={field.id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          readOnly={field.id === 'protecao_id_nome' && !!value}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow hover:border-gray-400 outline-none ${field.id === 'protecao_id_nome' && !!value ? 'bg-gray-100 cursor-not-allowed font-semibold text-primary' : ''}`}
        />
      );
      
    case 'number':
      return (
        <input
          id={field.id}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow hover:border-gray-400 outline-none"
        />
      );

    case 'textarea':
      return (
        <textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow hover:border-gray-400 outline-none min-h-[100px] resize-y"
        />
      );

    case 'select':
      return (
        <div className="relative">
          <select
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow hover:border-gray-400 bg-white appearance-none outline-none"
          >
            <option value="" disabled>Selecione uma opção...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      );

    case 'info':
      return (
        <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 flex gap-4 mt-2">
          <Info className="w-6 h-6 text-primary shrink-0" />
          <div>
            <p className="text-gray-700 leading-relaxed">{field.placeholder}</p>
          </div>
        </div>
      );

    case 'file':
      return (
        <div className="space-y-4">
          {value ? (
            <div className="relative overflow-hidden w-full max-w-sm rounded-lg border-2 border-gray-200">
              <img src={value} alt="Preview" className="w-full h-auto object-cover max-h-64" />
              <button 
                onClick={() => onChange(null)}
                title="Remover arquivo" 
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-secondary bg-amber-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50 bg-white'}`}
            >
              <input {...getInputProps()} required={field.required && !value} />
              
              <div className="flex flex-col items-center justify-center gap-3">
                {isUploading ? (
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className={`p-4 rounded-full ${isDragActive ? 'bg-amber-100 text-secondary' : 'bg-blue-50 text-primary'}`}>
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {isDragActive ? 'Solte a imagem aqui...' : 'Clique ou arraste uma imagem aqui'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, BMP até 5MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );

    case 'repeatable':
      const list: any[] = value || [];
      return (
        <div className="space-y-6">
          {list.map((item, idx) => (
            <div key={idx} className="bg-gray-50/50 p-6 rounded-xl border border-gray-200 relative group animate-in fade-in slide-in-from-top-2">
              <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-gray-200 rounded text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                {field.label} #{idx + 1}
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newList = [...list];
                  newList.splice(idx, 1);
                  onChange(newList);
                }}
                className="absolute -top-3 -right-3 p-1.5 bg-white border border-red-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm transition-all md:opacity-0 md:group-hover:opacity-100"
                title="Remover item"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 gap-6">
                {field.subFields
                  ?.filter((subField) => {
                    if (subField.id.startsWith('plano_acao_')) {
                      const checkFieldId = subField.id.replace('plano_acao_', 'check_');
                      const val = item[checkFieldId];
                      return val === 'NC' || val === 'PA';
                    }
                    return true;
                  })
                  .map((subField) => (
                  <div key={subField.id} className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      {subField.label} {subField.required && <span className="text-red-400">*</span>}
                    </label>
                    <FieldRenderer 
                      field={subField}
                      value={item[subField.id]}
                      allResponses={allResponses}
                      onChange={(subVal) => {
                        const newList = [...list];
                        newList[idx] = { ...newList[idx], [subField.id]: subVal };
                        onChange(newList);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => {
              const newItem: any = {};
              if (field.id === 'lista_dispositivos_detalhada') {
                newItem.device_posicao = `1.${list.length + 1}`;
              }
              // Item 8 linking: Automatically pull position from Item 7
              if (field.id === 'lista_avaliacao_mecanica') {
                const item7List = allResponses?.['lista_dispositivos_detalhada'] || [];
                if (item7List[list.length]) {
                  newItem.protecao_id_nome = item7List[list.length].device_posicao;
                }
              }
              onChange([...list, newItem]);
            }}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-bold bg-white/50"
          >
            <Plus className="w-5 h-5" />
            Adicionar {field.label}
          </button>
        </div>
      );

    default:
      return <div className="text-red-500 text-sm">Tipo de campo desconhecido: {field.type}</div>;
  }
}
