'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { FlowEngine } from '@/components/form/FlowEngine';
import { flowApreciacaoELaudo } from '@/lib/mock/data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DocumentEditorPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const { documents, loading } = useDocuments(user?.id || '');

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Carregando documento...</p>
        </div>
      </div>
    );
  }

  const document = documents.find(d => d.id === params.id);

  if (!document) {
    notFound();
  }

  // No mock atual, usamos sempre o flowApreciacaoELaudo
  const flow = flowApreciacaoELaudo;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <Link href="/documents" className="p-2 text-gray-500 hover:text-primary bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-sm text-gray-500">Ref: {document.id}</p>
        </div>
      </div>

      <FlowEngine 
        documentId={document.id}
        flow={flow}
        initialResponses={document.responses || {}}
        initialPageId={document.currentPageId}
      />
    </div>
  );
}
