"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Download, ChevronDown, X, Check, Loader2 } from "lucide-react";
import { exportSimplificado, exportDetalhado } from "../actions/export";

const FIELDS = [
  "Nome do Cliente",
  "Projeto",
  "Perfil Contratado",
  "Nível Contratado",
  "Período do Contrato",
  "Horas Contratadas",
  "Faturamento Contratado",
  "Colaborador Alocado",
  "Perfil do Colaborador",
  "Nível do Colaborador",
  "Horas Alocadas",
  "Tribo",
  "Líder do Colaborador",
  "Período de Alocação",
  "Faturamento Alocado",
];

function downloadCsv(content: string, filename: string) {
  const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(FIELDS));
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(field: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(field) ? next.delete(field) : next.add(field);
      return next;
    });
  }

  function handleSimplificado() {
    setDropdownOpen(false);
    startTransition(async () => {
      const csv = await exportSimplificado();
      downloadCsv(csv, "faturamento-simplificado.csv");
    });
  }

  function handleDetalhado() {
    setModalOpen(false);
    startTransition(async () => {
      const csv = await exportDetalhado([...selected]);
      downloadCsv(csv, "faturamento-detalhado.csv");
    });
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-sm text-white font-medium transition-colors cursor-pointer disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Exportar
          <ChevronDown
            size={14}
            className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
            <button
              onClick={handleSimplificado}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} className="text-gray-400" />
              Faturamento Simplificado
            </button>
            <button
              onClick={() => { setDropdownOpen(false); setModalOpen(true); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} className="text-gray-400" />
              Faturamento Detalhado
            </button>
          </div>
        )}
      </div>

      {/* Modal — Faturamento Detalhado */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 pb-4">
              <h2 className="text-gray-900 font-semibold text-base">
                Selecionar campos para exportação
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-4 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-4 flex items-center gap-3">
              <p className="text-gray-500 text-sm flex-1">
                Selecione os campos que deseja incluir no CSV
              </p>
              <button
                onClick={() => setSelected(new Set(FIELDS))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Selecionar Todos
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Desmarcar Todos
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {FIELDS.map((field) => {
                const checked = selected.has(field);
                return (
                  <label key={field} className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => toggle(field)}
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        checked ? "bg-violet-600 border-violet-600" : "border-gray-300 bg-white"
                      }`}
                    >
                      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                );
              })}
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="flex items-center justify-end gap-3 p-6 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDetalhado}
                disabled={selected.size === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-sm text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download size={14} />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
