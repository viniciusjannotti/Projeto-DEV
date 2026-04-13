import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/types';
import * as mockStore from '@/lib/mock/store';

export function useDocuments(userId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os documentos (mocked)
  const refreshDocuments = useCallback(() => {
    setLoading(true);
    // Simula rede
    setTimeout(() => {
      const allDocs = mockStore.getDocuments();
      // Filtro simples por user no mock
      const userDocs = allDocs.filter(d => d.userId === userId);
      // Sort by updated_at desc
      userDocs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setDocuments(userDocs);
      setLoading(false);
    }, 300);
  }, [userId]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const createDocument = async (flowId: string, title: string) => {
    const newDoc = mockStore.createDocument(userId, flowId, title);
    refreshDocuments();
    return newDoc;
  };

  const deleteDocument = async (id: string) => {
    mockStore.deleteDocument(id);
    refreshDocuments();
  };

  return {
    documents,
    loading,
    refreshDocuments,
    createDocument,
    deleteDocument
  };
}
