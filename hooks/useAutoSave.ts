import { useEffect, useRef } from 'react';
import * as mockStore from '@/lib/mock/store';

export function useAutoSave(documentId: string, responses: Record<string, any>, currentPageId: string, delay: number = 1000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Quando conecta ao Supabase, isso seria uma chamada de API
      mockStore.updateDocument(documentId, {
        responses,
        currentPageId
      });
      console.log(`Auto-saved document ${documentId} at ${new Date().toLocaleTimeString()}`);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [documentId, responses, currentPageId, delay]);
}
