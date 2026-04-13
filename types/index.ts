// Usuários e Autenticação
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  created_at: string;
}

// Estrutura de Formulários e Decision Tree
export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'file' | 'repeatable' | 'info';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  options?: FieldOption[]; // Usado para 'select'
  placeholder?: string;
  required: boolean;
  order: number;
  subFields?: Field[]; // For 'repeatable' fields
}

export interface RuleCondition {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'in';
  value: string | string[];
}

export interface RuleAction {
  type: 'go_to_page' | 'end_flow';
  targetPageId?: string;
}

export interface Rule {
  id: string;
  condition: RuleCondition;
  action: RuleAction;
}

export interface Page {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  rules: Rule[]; // Avaliadas na ordem. A primeira que bater decide a próxima página. Se nenhuma bater, vai para a próxima página na ordem (+1).
  order: number;
  isTerminal?: boolean; // Se true, o fluxo termina aqui
}

export interface Flow {
  id: string;
  title: string;
  description: string;
  pages: Page[];
  created_at: string;
  updated_at: string;
}

// Respostas e Documentos
export interface Response {
  id: string;
  documentId: string;
  fieldId: string;
  value: any; // Pode ser string, array, ou objeto para arquivos
  created_at: string;
}

export type DocumentStatus = 'draft' | 'completed';

export interface Document {
  id: string;
  userId: string;
  flowId: string;
  title: string; // Nome dado pelo usuário, ex: "Laudo Empresa X"
  status: DocumentStatus;
  isPaid: boolean;
  responses: Record<string, any>; // fieldName -> value temporário para o mock
  currentPageId: string; // Para saber onde parou
  created_at: string;
  updated_at: string;
}
