'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { FileText, PlusCircle, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents, loading } = useDocuments(user?.id || '');

  const completedCount = documents.filter(d => d.status === 'completed').length;
  const draftCount = documents.filter(d => d.status === 'draft').length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name || user?.email}</h1>
        <p className="text-gray-500 mt-1">Bem-vindo ao sistema de geração de documentos técnicos do ATerra.</p>
      </header>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-primary">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Documentos</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : documents.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-lg text-secondary">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Em Andamento</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : draftCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Concluídos</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : completedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="space-y-4">
            <Link 
              href="/documents" 
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-md group"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Novo Documento (Laudo)
            </Link>
            <Link 
              href="/documents" 
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Ver todos os documentos
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Documentos Recentes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="rounded-md bg-slate-200 h-12 w-full"></div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              Nenhum documento criado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 3).map(doc => (
                <Link key={doc.id} href={`/documents/${doc.id}`} className="block border border-gray-100 p-3 rounded-lg hover:border-primary hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500">{new Date(doc.updated_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      doc.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
