import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface NavigationBarProps {
  canGoBack: boolean;
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function NavigationBar({ canGoBack, isLastPage, onPrevious, onNext, onFinish }: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={!canGoBack}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      {isLastPage ? (
        <button
          onClick={onFinish}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-success hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
        >
          <Check className="w-5 h-5" />
          Concluir e Salvar
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-primary hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
        >
          Próximo
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
