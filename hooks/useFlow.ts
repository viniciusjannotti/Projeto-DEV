import { useState, useCallback, useEffect } from 'react';
import { Flow, Page } from '@/types';
import { resolveNextPage } from '@/lib/flow-engine/resolver';

export function useFlow(flow: Flow, initialResponses: Record<string, any> = {}, initialPageId?: string) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialPageId) {
      const page = flow.pages.find(p => p.id === initialPageId);
      if (page) return page;
    }
    return flow.pages[0];
  });

  const [responses, setResponses] = useState<Record<string, any>>(initialResponses);
  const [history, setHistory] = useState<string[]>([]);

  // Update responses
  const updateResponse = useCallback((fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  // Navigate to next page
  const handleNext = useCallback(() => {
    const nextPage = resolveNextPage(flow, currentPage.id, responses);
    if (nextPage) {
      setHistory(prev => [...prev, currentPage.id]);
      setCurrentPage(nextPage);
    } else {
      // Final do fluxo
      // TODO: Marcar documento como concluído
    }
  }, [flow, currentPage, responses]);

  // Navigate to previous page
  const handlePrevious = useCallback(() => {
    if (history.length > 0) {
      const prevPageId = history[history.length - 1];
      const prevPage = flow.pages.find(p => p.id === prevPageId);
      
      if (prevPage) {
        setHistory(prev => prev.slice(0, -1));
        setCurrentPage(prevPage);
      }
    }
  }, [flow, history]);

  const canGoBack = history.length > 0;
  const isLastPage = currentPage.isTerminal || resolveNextPage(flow, currentPage.id, responses) === null;

  return {
    currentPage,
    responses,
    updateResponse,
    handleNext,
    handlePrevious,
    canGoBack,
    isLastPage,
    history
  };
}
