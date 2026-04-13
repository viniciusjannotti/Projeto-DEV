'use client';

import { Flow, Page, Field } from '@/types';
import { useFlow } from '@/hooks/useFlow';
import { FormPage } from '@/components/form/FormPage';
import { NavigationBar } from '@/components/form/NavigationBar';
import { useAutoSave } from '@/hooks/useAutoSave';
import { FileDown, Save } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as mockStore from '@/lib/mock/store';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentPDF } from '../pdf/DocumentPDF';

interface FlowEngineProps {
  documentId: string;
  flow: Flow;
  initialResponses: Record<string, any>;
  initialPageId?: string;
}

export function FlowEngine({ documentId, flow, initialResponses, initialPageId }: FlowEngineProps) {
  // Retrieve document to get is_paid and title
  const document = mockStore.getDocumentById(documentId) || { title: '', isPaid: false };

  const {
    currentPage,
    responses,
    updateResponse,
    handleNext,
    handlePrevious,
    canGoBack,
    isLastPage,
  } = useFlow(flow, initialResponses, initialPageId);

  // Integração do AutoSave
  useAutoSave(documentId, responses, currentPage.id, 1000);

  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  // Calcula % preenchida das respostas exigidas
  // Simplificado para UI
  const totalRequiredFields = flow.pages.flatMap(p => p.fields).filter(f => f.required).length;
  const answeredRequiredFields = flow.pages.flatMap(p => p.fields).filter(f => f.required && responses[f.id] !== undefined && responses[f.id] !== '').length;
  const progress = Math.min(100, Math.round((answeredRequiredFields / Math.max(1, totalRequiredFields)) * 100));

  const handleFinish = async () => {
    setSaving(true);
    // Marca doc como completado
    mockStore.updateDocument(documentId, {
      status: 'completed',
      responses,
      currentPageId: currentPage.id
    });
    
    // Simula rede
    setTimeout(() => {
      setSaving(false);
      setFinished(true);
    }, 800);
  };

  if (finished) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto mt-12">
        <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Save className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Laudo Concluído com Sucesso!</h2>
        <p className="text-gray-600 mb-8">Todos os dados foram salvos e o documento está pronto para ser gerado.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-left">
          <Link href="/documents" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center">
            Voltar aos Documentos
          </Link>
          <PDFDownloadLink
            document={
              <DocumentPDF 
                title={document.title || flow.title} 
                data={responses} 
                metadata={{ docId: documentId, date: new Date().toLocaleDateString() }}
              />
            }
            fileName={`Laudo-${documentId}.pdf`}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 font-medium flex items-center justify-center gap-2"
          >
            {/* @ts-ignore */}
            {({ blob, url, loading, error }: any) =>
              loading ? 'Gerando...' : (
                <>
                  <FileDown className="w-5 h-5" />
                  Baixar PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header do Formulário progress bar */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{flow.title}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            {saving ? (
              <span className="text-secondary flex items-center gap-1">Salvando...</span>
            ) : (
              <span className="text-success flex items-center gap-1"><Save className="w-3 h-3" /> Salvo automaticamente</span>
            )}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FormPage 
          page={currentPage} 
          responses={responses} 
          onChange={updateResponse} 
        />
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <NavigationBar 
          canGoBack={canGoBack} 
          isLastPage={isLastPage} 
          onPrevious={handlePrevious} 
          onNext={handleNext}
          onFinish={handleFinish}
        />
      </div>
    </div>
  );
}
