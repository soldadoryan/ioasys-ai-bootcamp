import { fetchClientes } from "./lib/api";
import { DashboardClient } from "./components/DashboardClient";

export default async function Home() {
  const clientes = await fetchClientes();

  return (
    <div className="min-h-screen">
      <div className="max-w-360 mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Visão Executiva</h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Visão geral das alocações e métricas dos projetos
            </p>
          </div>
          <span className="text-3xl font-semibold tracking-tight shrink-0">ioasys</span>
        </header>

        <DashboardClient clientes={clientes} />
      </div>
    </div>
  );
}
