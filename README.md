# ATerra — Sistema de Geração de Documentos Técnicos

![ATerra Banner](https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200)

O **ATerra** é uma plataforma moderna e responsiva (PWA) desenvolvida para transformar a forma como engenheiros e técnicos de segurança do trabalho geram documentos técnicos. Com foco inicial em "Apreciação e Laudo", o sistema utiliza inteligência de dados e fluxos dinâmicos para automatizar a conformidade técnica.

## 🚀 Funcionalidades Principais

- **Formulários Dinâmicos**: Sistema de *Decision Tree* que adapta os campos conforme as respostas do usuário (Máquinas vs Equipamentos).
- **Geração de PDF Offline**: Documentos estruturados e profissionais gerados diretamente no navegador.
- **Auto-save Inteligente**: Nunca perca dados. O sistema salva o progresso automaticamente.
- **Painel Administrativo**: Gestão completa de fluxos, campos e regras de ramificação.
- **Suporte PWA**: Funciona em Desktop e Mobile, inclusive offline.

## 🛠️ Stack Tecnológica

- **Frontend**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Estilização**: Tailwind CSS (UI Corporativa Moderna)
- **Backend (Planejado)**: Supabase (PostgreSQL + Auth + Storage)
- **Relatórios**: `@react-pdf/renderer` para processamento client-side.

## 📦 Como rodar o projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Rodar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar o sistema**:
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔑 Acesso Mock (Desenvolvimento)
- **Usuário**: `adm`
- **Senha**: `123`

---

## 🏗️ Estrutura do Projeto

```text
aterra/
├── app/          # Rotas e Páginas (Next.js App Router)
├── components/   # UI, Formulários (FlowEngine) e PDF
├── hooks/        # Lógica de Fluxo, Autenticação e Auto-save
├── lib/          # Motor de Resolução e Mock Store
├── types/        # Definições de Tipos TypeScript
└── public/       # Manifest PWA e Ativos Estáticos
```

---

Desenvolvido por [Vinícius Jannotti](https://github.com/viniciusjannotti).
