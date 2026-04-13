import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-primary">ATerra</h1>
        <p className="text-lg text-slate-600">Sistema de Geração de Documentos Técnicos</p>
        <Link 
          href="/login" 
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all font-semibold shadow-md"
        >
          Acessar Sistema
        </Link>
      </div>
    </main>
  );
}
