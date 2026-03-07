import Link from "next/link";
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  DollarSign,
  BarChart2,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ExportModal } from "../components/ExportModal";
import { TeamTable } from "../components/TeamTable";

export default function Detalhes() {
  return (
    <div className="min-h-screen">
      <div className="max-w-360 mx-auto p-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Link
              href="/"
              className="mt-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                Detalhes da previsão do faturamento
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Acompanhe a alocação de equipes e métricas dos projetos
              </p>
            </div>
          </div>
          <span className="text-xl font-semibold tracking-tight">ioasys</span>
        </header>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <button className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-white hover:bg-zinc-800 transition-colors cursor-pointer">
            <Filter size={13} />
            Filtros
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-violet-600 rounded-full text-[10px] font-bold flex items-center justify-center">
              1
            </span>
          </button>
          <input
            type="text"
            placeholder="Pesquisar por colaborador"
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 bg-transparent text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
          />
          <ExportModal />
        </div>

        {/* Active filter tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-zinc-400 text-sm">Cliente:</span>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-sm text-white hover:bg-zinc-800 transition-colors cursor-pointer">
            Empresa A
            <ChevronDown size={13} className="text-zinc-400" />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Valor Total */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <p className="text-zinc-400 text-sm">Valor Total</p>
              <div className="bg-emerald-500 p-2 rounded-xl flex-shrink-0">
                <DollarSign size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold">R$ 153.400,00</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp size={13} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold">
                0.00%
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">Mês passado: R$ 0,00</p>
          </div>

          {/* Qtd Projetos */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Quantidade de Projetos</p>
              <div className="bg-violet-500 p-2 rounded-xl flex-shrink-0">
                <BarChart2 size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">2</p>
          </div>

          {/* Total Horas */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Total de Horas alocadas</p>
              <div className="bg-orange-500 p-2 rounded-xl flex-shrink-0">
                <Clock size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mt-4">1.340</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingDown size={13} className="text-red-400" />
                <span className="text-red-400 text-xs font-semibold">
                  -16.25%
                </span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Contratado: 1.600 horas
              </p>
            </div>
          </div>

          {/* Total Colaboradores */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <p className="text-zinc-400 text-sm">Total de colaboradores</p>
              <div className="bg-cyan-600 p-2 rounded-xl flex-shrink-0">
                <Users size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">10</p>
          </div>
        </div>

        {/* Table */}
        <TeamTable />
      </div>
    </div>
  );
}
