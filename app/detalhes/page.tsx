import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  BarChart2,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import { fetchClientes, getAllAlocacoes } from "../lib/api";
import {
  calcValorTotal,
  calcQtdProjetos,
  calcTotalHoras,
  calcTotalColaboradores,
  buildTableGroups,
  buildFilterOptions,
  formatCurrency,
} from "../lib/calc";
import { TeamTable } from "../components/TeamTable";
import { ExportButton } from "../components/ExportButton";
import { FilterPanel } from "../components/FilterPanel";
import { CollaboratorSearch } from "../components/CollaboratorSearch";

export default async function Detalhes({
  searchParams,
}: {
  searchParams: Promise<{ colaborador?: string; cliente?: string; vencer?: string }>;
}) {
  const { colaborador, cliente, vencer } = await searchParams;
  const clientes = await fetchClientes();
  const allAlocacoes = getAllAlocacoes(clientes);

  // Apply URL filters
  const filteredClientes = cliente
    ? clientes.filter((c) => c.nome === cliente)
    : clientes;

  const filteredAlocacoes = filteredClientes
    .flatMap((c) => c.alocacoes)
    .filter((a) => {
      if (colaborador && a.pessoa_colaborador !== colaborador) return false;
      if (vencer === "true" && !a.final_periodo) return false;
      return true;
    });

  // KPIs
  const valorTotal = calcValorTotal(filteredAlocacoes);
  const valorTotalAll = calcValorTotal(allAlocacoes);
  const qtdProjetos = calcQtdProjetos(filteredAlocacoes);
  const totalHoras = calcTotalHoras(filteredAlocacoes);
  const horasContratadas = calcTotalHoras(allAlocacoes);
  const totalColabs = calcTotalColaboradores(filteredAlocacoes);

  const horasPct =
    horasContratadas > 0
      ? (((totalHoras - horasContratadas) / horasContratadas) * 100).toFixed(2)
      : null;

  // Table data
  const groups = buildTableGroups(filteredAlocacoes, allAlocacoes);

  // Filter options & collaborators for search
  const filterOptions = buildFilterOptions(clientes);
  const collaborators = [
    ...new Set(allAlocacoes.map((a) => a.pessoa_colaborador)),
  ].sort();

  const activeFilterCount = (colaborador ? 1 : 0) + (cliente ? 1 : 0) + (vencer ? 1 : 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-360 mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Detalhes da previsão do faturamento
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Acompanhe a alocação de equipes e métricas dos projetos
              </p>
            </div>
          </div>
          <span className="text-3xl font-semibold tracking-tight shrink-0">ioasys</span>
        </header>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 mb-4">
          <FilterPanel
            options={filterOptions}
            onApply={undefined}
          />
          <CollaboratorSearch collaborators={collaborators} />
          <ExportButton />
        </div>

        {/* Active filter tags */}
        {(colaborador || cliente || vencer) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-zinc-400 text-sm">Filtros ativos:</span>
            {vencer && (
              <Link
                href="/detalhes"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500 bg-amber-500/10 text-sm text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                Contratos a Vencer
                <X size={12} />
              </Link>
            )}
            {cliente && (
              <Link
                href={`/detalhes${colaborador ? `?colaborador=${encodeURIComponent(colaborador)}` : ""}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-violet-600 bg-violet-600/10 text-sm text-violet-300 hover:bg-violet-600/20 transition-colors"
              >
                Cliente: {cliente}
                <X size={12} />
              </Link>
            )}
            {colaborador && (
              <Link
                href={`/detalhes${cliente ? `?cliente=${encodeURIComponent(cliente)}` : ""}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-violet-600 bg-violet-600/10 text-sm text-violet-300 hover:bg-violet-600/20 transition-colors"
              >
                Colaborador: {colaborador}
                <X size={12} />
              </Link>
            )}
            {activeFilterCount > 1 && (
              <Link
                href="/detalhes"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline"
              >
                Limpar todos
              </Link>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Valor Total */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <p className="text-zinc-400 text-sm">Valor Total</p>
              <div className="bg-emerald-500 p-2 rounded-xl shrink-0">
                <DollarSign size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(valorTotal)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp size={13} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold">
                {valorTotalAll > 0
                  ? `${((valorTotal / valorTotalAll) * 100).toFixed(1)}% do total`
                  : "—"}
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">
              Total geral: {formatCurrency(valorTotalAll)}
            </p>
          </div>

          {/* Qtd Projetos */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Quantidade de Projetos</p>
              <div className="bg-violet-500 p-2 rounded-xl shrink-0">
                <BarChart2 size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{qtdProjetos}</p>
          </div>

          {/* Total Horas */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Total de Horas alocadas</p>
              <div className="bg-orange-500 p-2 rounded-xl shrink-0">
                <Clock size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mt-4">
                {totalHoras.toLocaleString("pt-BR")}
              </p>
              {horasPct && (
                <div className="flex items-center gap-1.5 mt-2">
                  {Number(horasPct) >= 0 ? (
                    <TrendingUp size={13} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={13} className="text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      Number(horasPct) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {horasPct}%
                  </span>
                </div>
              )}
              <p className="text-zinc-500 text-xs mt-1">
                Contratado: {horasContratadas.toLocaleString("pt-BR")} horas
              </p>
            </div>
          </div>

          {/* Total Colaboradores */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Total de colaboradores</p>
              <div className="bg-cyan-600 p-2 rounded-xl shrink-0">
                <Users size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{totalColabs}</p>
          </div>
        </div>

        {/* Table */}
        <TeamTable groups={groups} />
      </div>
    </div>
  );
}
