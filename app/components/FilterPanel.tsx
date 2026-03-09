"use client";

import { useState } from "react";
import { Filter, X, Calendar, ChevronDown } from "lucide-react";
import type { FilterOptions, FilterState } from "../lib/calc";
import { DEFAULT_FILTERS, countActiveFilters } from "../lib/calc";

type SelectFieldProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

type Props = {
  options?: FilterOptions;
  onApply?: (filters: FilterState) => void;
  initialFilters?: FilterState;
};

const defaultOptions: FilterOptions = {
  clientes: ["Todos os clientes"],
  projetos: ["Todos os projetos"],
  areas: ["Todas as áreas"],
  senioridades: ["Todas as senioridades"],
  tribos: ["Todas as tribos"],
  lideres: ["Todos os líderes"],
};

export function FilterPanel({ options = defaultOptions, onApply, initialFilters = DEFAULT_FILTERS }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FilterState>(initialFilters);
  const [applied, setApplied] = useState<FilterState>(initialFilters);

  const activeCount = countActiveFilters(applied);

  const set = (key: keyof FilterState) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  function handleApply() {
    setApplied(form);
    onApply?.(form);
    setOpen(false);
  }

  function handleClear() {
    setForm(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    onApply?.(DEFAULT_FILTERS);
    setOpen(false);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-white hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Filter size={13} />
        Filtros
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-violet-600 rounded-full text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[80%] md:w-[55%] lg:w-[35%] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Filter size={16} />
            Filtros
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <SelectField
            label="Nome do Cliente"
            options={options.clientes}
            value={form.cliente}
            onChange={set("cliente")}
          />
          <SelectField
            label="Projeto"
            options={options.projetos}
            value={form.projeto}
            onChange={set("projeto")}
          />
          <SelectField
            label="Área"
            options={options.areas}
            value={form.area}
            onChange={set("area")}
          />
          <SelectField
            label="Senioridade"
            options={options.senioridades}
            value={form.senioridade}
            onChange={set("senioridade")}
          />
          <SelectField
            label="Tribo"
            options={options.tribos}
            value={form.tribo}
            onChange={set("tribo")}
          />
          <SelectField
            label="Líder"
            options={options.lideres}
            value={form.lider}
            onChange={set("lider")}
          />

          {/* Data */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-900">Data</label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                value={form.data}
                onChange={(e) => set("data")(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded-lg bg-violet-600 text-sm text-white font-medium hover:bg-violet-700 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
}
