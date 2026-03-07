"use client";

import { useState } from "react";
import { Download, ChevronDown, X, Check } from "lucide-react";

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

export function ExportModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(FIELDS));

  function toggle(field: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(field) ? next.delete(field) : next.add(field);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(FIELDS));
  }

  function deselectAll() {
    setSelected(new Set());
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-sm text-white font-medium transition-colors cursor-pointer"
      >
        <Download size={14} />
        Exportar
        <ChevronDown size={14} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <h2 className="text-gray-900 font-semibold text-base">
                Selecionar campos para exportação
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-4 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Subheader */}
            <div className="px-6 pb-4 flex items-center gap-3">
              <p className="text-gray-500 text-sm flex-1">
                Selecione os campos que deseja incluir no CSV
              </p>
              <button
                onClick={selectAll}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Selecionar Todos
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Desmarcar Todos
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            {/* Fields grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {FIELDS.map((field) => {
                const checked = selected.has(field);
                return (
                  <label
                    key={field}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div
                      onClick={() => toggle(field)}
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                        checked
                          ? "bg-violet-600 border-violet-600"
                          : "border-gray-300 bg-white"
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

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-sm text-white font-medium transition-colors cursor-pointer"
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
