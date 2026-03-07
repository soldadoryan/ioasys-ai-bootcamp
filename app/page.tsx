import {
  DollarSign,
  ClipboardList,
  BarChart2,
  Clock,
  Users,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardCharts } from "./components/DashboardCharts";

type KpiCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; up: boolean };
  sub?: string;
};

function KpiCard({ label, value, icon, iconBg, trend, sub }: KpiCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-zinc-400 text-sm leading-tight">{label}</p>
        <div className={`${iconBg} p-2 rounded-xl flex-shrink-0`}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.up ? (
              <TrendingUp size={13} className="text-emerald-400" />
            ) : (
              <TrendingDown size={13} className="text-red-400" />
            )}
            <span
              className={`text-xs font-semibold ${trend.up ? "text-emerald-400" : "text-red-400"}`}
            >
              {trend.value}
            </span>
          </div>
        )}
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-360 mx-auto p-8">
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Visão Executiva</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Visão geral das alocações e métricas dos projetos
          </p>
        </div>
        <span className="text-xl font-semibold tracking-tight">ioasys</span>
      </header>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-white hover:bg-zinc-800 transition-colors cursor-pointer">
          <Filter size={13} />
          Filtros
        </button>
        <input
          type="text"
          placeholder="Pesquisar por colaborador"
          className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 bg-transparent text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />
      </div>

      {/* KPI Grid */}
      <div
        className="grid grid-cols-4 gap-4 mb-6"
        style={{ gridTemplateRows: "auto auto" }}
      >
        {/* Valor Total — spans 2 rows */}
        <div className="row-span-2 bg-[#1a1a1a] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <p className="text-zinc-400 text-sm">Valor Total</p>
            <div className="bg-emerald-500 p-3 rounded-xl flex-shrink-0">
              <DollarSign size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold mt-4">R$ 362.900,00</p>
            <div className="flex items-center gap-1.5 mt-3">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">
                105.61%
              </span>
            </div>
            <p className="text-zinc-500 text-sm mt-1">
              Mês passado: R$ 176.500,00
            </p>
          </div>
        </div>

        <KpiCard
          label="Quantidade de Clientes"
          value="5"
          icon={<ClipboardList size={18} className="text-white" />}
          iconBg="bg-indigo-500"
        />
        <KpiCard
          label="Quantidade de Projetos"
          value="6"
          icon={<BarChart2 size={18} className="text-white" />}
          iconBg="bg-violet-500"
        />
        <KpiCard
          label="Total de Horas alocadas"
          value="2.940"
          icon={<Clock size={18} className="text-white" />}
          iconBg="bg-orange-500"
          trend={{ value: "-16.48%", up: false }}
          sub="Contratado: 3.520 horas"
        />
        <KpiCard
          label="Total de colaboradores"
          value="22"
          icon={<Users size={18} className="text-white" />}
          iconBg="bg-blue-500"
        />
        <KpiCard
          label="Contratos para Faturar"
          value="3"
          icon={<FileText size={18} className="text-white" />}
          iconBg="bg-zinc-600"
        />
        <KpiCard
          label="Contratos a Vencer"
          value="2"
          icon={<Calendar size={18} className="text-white" />}
          iconBg="bg-amber-500"
        />
      </div>

      {/* Charts */}
      <DashboardCharts />
      </div>
    </div>
  );
}
