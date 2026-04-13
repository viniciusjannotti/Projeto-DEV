import { Document, DocumentStatus } from '@/types';

const DOCUMENTS_KEY = 'aterra_documents';

// Função auxiliar para inicializar mock state
export function getDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem(DOCUMENTS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

export function saveDocuments(docs: Document[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
  }
}

export function createDocument(userId: string, flowId: string, title: string): Document {
  const newDoc: Document = {
    id: `doc_${Date.now()}`,
    userId,
    flowId,
    title,
    status: 'draft',
    isPaid: false,
    responses: {},
    currentPageId: '', // Vai ser o ID da primeira página
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const docs = getDocuments();
  docs.push(newDoc);
  saveDocuments(docs);
  
  return newDoc;
}

export function updateDocument(id: string, updates: Partial<Document>): Document | null {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === id);
  if (index === -1) return null;

  docs[index] = { ...docs[index], ...updates, updated_at: new Date().toISOString() };
  saveDocuments(docs);
  
  return docs[index];
}

export function getDocumentById(id: string): Document | null {
  const docs = getDocuments();
  return docs.find(d => d.id === id) || null;
}

export function deleteDocument(id: string) {
  const docs = getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  saveDocuments(filtered);
}
