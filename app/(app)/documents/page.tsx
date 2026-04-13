'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { FileText, Plus, Search, ArrowRight, Download, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const { user } = useAuth();
  const { documents, loading, createDocument } = useDocuments(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setIsCreating(true);
    try {
      // Mock flowId para "Apreciação e Laudo"
      const doc = await createDocument('flow_apreciacao_laudo_001', newTitle);
      router.push(`/documents/${doc.id}`);
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Documentos</h1>
          <p className="text-gray-500">Gerencie seus laudos e avaliações</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Novo Documento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Buscar documentos..."
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando documentos...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum documento encontrado</h3>
            <p className="text-gray-500 mb-6">Você ainda não possui documentos criados ou nenhum bate com sua busca.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar meu primeiro documento
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 flex flex-col">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Documento</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Última Edição</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>
            
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="group flex flex-col sm:grid sm:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-6 flex items-center gap-3 w-full sm:w-auto">
                  <div className="bg-blue-100 p-2 rounded-lg text-primary shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500 truncate">Fluxo: Apreciação e Laudo</p>
                  </div>
                </div>
                
                <div className="col-span-2 w-full sm:w-auto flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status === 'completed' ? 'Concluído' : 'Rascunho'}
                  </span>
                </div>
                
                <div className="col-span-2 w-full sm:w-auto text-sm text-gray-500">
                  {new Date(doc.updated_at).toLocaleDateString()}
                </div>
                
                <div className="col-span-2 w-full sm:w-auto flex items-center justify-start sm:justify-end gap-2">
                  {doc.status === 'completed' ? (
                    <button className="flex items-center gap-1 text-primary hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  ) : (
                    <Link href={`/documents/${doc.id}`} className="flex items-center gap-1 text-secondary hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      <FileEdit className="w-4 h-4" />
                      Continuar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Novo Documento</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Documento
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Laudo Máquina XYZ - Empresa Beta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Fluxo utilizado: <strong>Apreciação e Laudo</strong>
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating ? 'Criando...' : (
                    <>
                      Criar <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
