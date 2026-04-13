'use client';

import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, FileKey } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Proteção extra
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShieldAlert className="text-secondary" />
          Painel de Administração
        </h1>
        <p className="text-gray-500 mt-2">Gerencie fluxos (decision trees), formulários e opções do sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <FileKey className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Editor de Fluxos</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Crie e edite as rotas dinâmicas, páginas e regras lógicas (se X = Y vá para Z).
          </p>
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer">
              <div>
                <h3 className="font-bold text-primary">Apreciação e Laudo</h3>
                <p className="text-xs text-gray-500">4 Páginas • 2 Ramificações</p>
              </div>
              <span className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-700">Editar</span>
            </div>
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors font-medium">
              + Criar Novo Fluxo
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-70">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Em Breve: Módulos Nível 2</h2>
          <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
            <li>Editor visual drag-and-drop de regras</li>
            <li>Campos repetíveis dinâmicos</li>
            <li>API de Webhooks</li>
            <li>Integração com Gateway de Pagamento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
