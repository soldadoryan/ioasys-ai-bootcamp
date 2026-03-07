"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  ClipboardList,
  BarChart2,
  Clock,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Cliente } from "../lib/api";
import { getAllAlocacoes } from "../lib/api";
import {
  calcValorTotal,
  calcQtdClientes,
  calcQtdProjetos,
  calcTotalHoras,
  calcTotalColaboradores,
  calcContratosFaturar,
  calcContratosVencer,
  calcRevenueByCliente,
  calcMonthlyData,
  buildFilterOptions,
  applyFilters,
  DEFAULT_FILTERS,
  type FilterState,
} from "../lib/calc";
import { FilterPanel } from "./FilterPanel";
import { CollaboratorSearch } from "./CollaboratorSearch";
import { ExportButton } from "./ExportButton";
import { DashboardCharts } from "./DashboardCharts";

type KpiCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; up: boolean };
  sub?: string;
  href?: string;
};

function KpiCard({ label, value, icon, iconBg, trend, sub, href }: KpiCardProps) {
  const inner = (
    <div className={`bg-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between gap-2 h-full${href ? " hover:bg-[#222] transition-colors cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-zinc-400 text-sm leading-tight">{label}</p>
        <div className={`${iconBg} p-2 rounded-xl shrink-0`}>{icon}</div>
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
            <span className={`text-xs font-semibold ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
              {trend.value}
            </span>
          </div>
        )}
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function pctChange(current: number, previous: number): { value: string; up: boolean } | undefined {
  if (previous === 0) return undefined;
  const pct = ((current - previous) / previous) * 100;
  return { value: `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`, up: pct >= 0 };
}

export function DashboardClient({ clientes }: { clientes: Cliente[] }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const allAlocacoes = useMemo(() => getAllAlocacoes(clientes), [clientes]);

  const filterOptions = useMemo(() => buildFilterOptions(clientes), [clientes]);

  const collaborators = useMemo(
    () => [...new Set(allAlocacoes.map((a) => a.pessoa_colaborador))].sort(),
    [allAlocacoes]
  );

  const { clientes: filteredClientes, alocacoes: filteredAlocacoes } = useMemo(
    () => applyFilters(clientes, filters),
    [clientes, filters]
  );

  // KPIs - current
  const valorTotal = useMemo(() => calcValorTotal(filteredAlocacoes), [filteredAlocacoes]);
  const qtdClientes = useMemo(() => calcQtdClientes(filteredClientes), [filteredClientes]);
  const qtdProjetos = useMemo(() => calcQtdProjetos(filteredAlocacoes), [filteredAlocacoes]);
  const totalHoras = useMemo(() => calcTotalHoras(filteredAlocacoes), [filteredAlocacoes]);
  const horasContratadas = useMemo(() => calcTotalHoras(allAlocacoes), [allAlocacoes]);
  const totalColabs = useMemo(() => calcTotalColaboradores(filteredAlocacoes), [filteredAlocacoes]);
  const contratosFaturar = useMemo(() => calcContratosFaturar(filteredAlocacoes), [filteredAlocacoes]);
  const contratosVencer = useMemo(() => calcContratosVencer(filteredAlocacoes), [filteredAlocacoes]);

  // KPIs - previous (unfiltered, for trend reference)
  const valorTotalAll = useMemo(() => calcValorTotal(allAlocacoes), [allAlocacoes]);
  const horasTrend =
    horasContratadas > 0
      ? pctChange(totalHoras, horasContratadas)
      : undefined;

  // Chart data
  const revenueData = useMemo(() => calcRevenueByCliente(filteredClientes), [filteredClientes]);
  const monthlyData = useMemo(() => calcMonthlyData(filteredAlocacoes), [filteredAlocacoes]);

  return (
    <>
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterPanel
          options={filterOptions}
          onApply={setFilters}
        />
        <CollaboratorSearch collaborators={collaborators} />
        <ExportButton />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:grid-rows-[1fr_1fr]">
        {/* Valor Total */}
        <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2 bg-[#1a1a1a] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <p className="text-zinc-400 text-sm">Valor Total</p>
            <div className="bg-emerald-500 p-3 rounded-xl shrink-0">
              <DollarSign size={20} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold mt-4">{fmt(valorTotal)}</p>
            {pctChange(valorTotal, valorTotalAll - valorTotal) && (
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">
                  {pctChange(valorTotal, valorTotalAll - valorTotal)?.value}
                </span>
              </div>
            )}
            <p className="text-zinc-500 text-sm mt-1">
              Total: {fmt(valorTotalAll)}
            </p>
          </div>
        </div>

        <KpiCard
          label="Quantidade de Clientes"
          value={String(qtdClientes)}
          icon={<ClipboardList size={18} className="text-white" />}
          iconBg="bg-indigo-500"
        />
        <KpiCard
          label="Quantidade de Projetos"
          value={String(qtdProjetos)}
          icon={<BarChart2 size={18} className="text-white" />}
          iconBg="bg-violet-500"
        />
        <KpiCard
          label="Total de Horas alocadas"
          value={totalHoras.toLocaleString("pt-BR")}
          icon={<Clock size={18} className="text-white" />}
          iconBg="bg-orange-500"
          trend={horasTrend}
          sub={`Contratado: ${horasContratadas.toLocaleString("pt-BR")} horas`}
        />
        <KpiCard
          label="Total de colaboradores"
          value={String(totalColabs)}
          icon={<Users size={18} className="text-white" />}
          iconBg="bg-blue-500"
        />
        <KpiCard
          label="Contratos para Faturar"
          value={String(contratosFaturar)}
          icon={<FileText size={18} className="text-white" />}
          iconBg="bg-zinc-600"
        />
        <KpiCard
          label="Contratos a Vencer"
          value={String(contratosVencer)}
          icon={<Calendar size={18} className="text-white" />}
          iconBg="bg-amber-500"
          href="/detalhes?vencer=true"
        />
      </div>

      {/* Charts */}
      <DashboardCharts revenueData={revenueData} monthlyData={monthlyData} />
    </>
  );
}
