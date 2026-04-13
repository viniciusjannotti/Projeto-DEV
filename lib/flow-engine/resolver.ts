import { Flow, Page, Rule, RuleCondition } from '@/types';

export function evaluateCondition(condition: RuleCondition, responses: Record<string, any>): boolean {
  const answer = responses[condition.fieldId];
  
  if (answer === undefined || answer === null) return false;

  switch (condition.operator) {
    case 'equals':
      return answer === condition.value;
    case 'not_equals':
      return answer !== condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(answer);
    default:
      return false;
  }
}

export function resolveNextPage(flow: Flow, currentPageId: string, responses: Record<string, any>): Page | null {
  const currentPageIndex = flow.pages.findIndex(p => p.id === currentPageId);
  
  if (currentPageIndex === -1) return null;
  const currentPage = flow.pages[currentPageIndex];

  // Se é uma página terminal, não há próxima página
  if (currentPage.isTerminal) return null;

  // Avaliar as regras na ordem
  for (const rule of currentPage.rules) {
    if (evaluateCondition(rule.condition, responses)) {
      if (rule.action.type === 'go_to_page' && rule.action.targetPageId) {
        const targetPage = flow.pages.find(p => p.id === rule.action.targetPageId);
        if (targetPage) return targetPage;
      }
      if (rule.action.type === 'end_flow') return null;
    }
  }

  // Se nenhuma regra bater, ir para a próxima página na ordem sequencial
  if (currentPageIndex + 1 < flow.pages.length) {
    return flow.pages[currentPageIndex + 1];
  }

  return null;
}
