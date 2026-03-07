"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { TableGroup } from "../lib/calc";

const PAGE_SIZE = 10;

type SortCol = "colaborador" | "fatContratado" | "fatAlocado";
type SortDir = "asc" | "desc";

function parseCurrency(str: string): number {
  return parseFloat(str.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

const nivelStyles: Record<string, string> = {
  Sênior: "bg-purple-900/60 text-purple-300 border border-purple-700/50",
  Pleno: "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50",
  Júnior: "bg-green-900/60 text-green-300 border border-green-700/50",
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-medium">{value}</p>
    </div>
  );
}

type Props = {
  groups: TableGroup[];
};

export function TeamTable({ groups }: Props) {
  const [selected, setSelected] = useState<TableGroup["rows"][0]["detail"] | null>(null);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ col: SortCol; dir: SortDir } | null>(null);

  // Reset page when data changes
  useEffect(() => { setPage(0); }, [groups]);

  function handleSort(col: SortCol) {
    setSort((prev) =>
      prev?.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" }
    );
    setPage(0);
  }

  function SortIcon({ col }: { col: SortCol }) {
    if (sort?.col !== col) return <ArrowUpDown size={12} className="text-zinc-600" />;
    return sort.dir === "asc"
      ? <ArrowUp size={12} className="text-violet-400" />
      : <ArrowDown size={12} className="text-violet-400" />;
  }

  // Flatten all rows for pagination
  const allRows = useMemo(() => {
    const flat = groups.flatMap((g) => g.rows.map((r) => ({ ...r, projeto: g.projeto })));
    if (!sort) return flat;
    return [...flat].sort((a, b) => {
      let cmp = 0;
      if (sort.col === "colaborador") {
        cmp = a.colaborador.localeCompare(b.colaborador, "pt-BR");
      } else if (sort.col === "fatContratado") {
        cmp = parseCurrency(a.fatContratado) - parseCurrency(b.fatContratado);
      } else if (sort.col === "fatAlocado") {
        cmp = parseCurrency(a.fatAlocado) - parseCurrency(b.fatAlocado);
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [groups, sort]);

  const totalPages = Math.ceil(allRows.length / PAGE_SIZE);

  // Get current page rows and regroup by project for rowSpan rendering
  const pagedGroups = useMemo(() => {
    const slice = allRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const result: { projeto: string; rows: typeof slice }[] = [];
    for (const row of slice) {
      const last = result[result.length - 1];
      if (!last || last.projeto !== row.projeto) {
        result.push({ projeto: row.projeto, rows: [row] });
      } else {
        last.rows.push(row);
      }
    }
    return result;
  }, [allRows, page]);

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold">Equipe Alocada nos Projetos</h2>
            {allRows.length > 0 && (
              <p className="text-zinc-500 text-xs mt-0.5">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, allRows.length)} de {allRows.length} colaboradores
              </p>
            )}
          </div>
          <button className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer">
            <Pencil size={14} />
            Editar
          </button>
        </div>

        {groups.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">
            Nenhum colaborador encontrado para os filtros aplicados.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6 w-32">Projeto</th>
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6">
                  <button
                    onClick={() => handleSort("colaborador")}
                    className={`flex items-center gap-1 cursor-pointer hover:text-white transition-colors ${sort?.col === "colaborador" ? "text-white" : ""}`}
                  >
                    Colaborador <SortIcon col="colaborador" />
                  </button>
                </th>
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Perfil / Nível</th>
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Horas Contratada</th>
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Horas Alocada</th>
                <th className="text-left text-zinc-400 font-medium pb-3 pr-6">
                  <button
                    onClick={() => handleSort("fatContratado")}
                    className={`flex items-center gap-1 cursor-pointer hover:text-white transition-colors ${sort?.col === "fatContratado" ? "text-white" : ""}`}
                  >
                    Faturamento Contratado <SortIcon col="fatContratado" />
                  </button>
                </th>
                <th className="text-left text-zinc-400 font-medium pb-3">
                  <button
                    onClick={() => handleSort("fatAlocado")}
                    className={`flex items-center gap-1 cursor-pointer hover:text-white transition-colors ${sort?.col === "fatAlocado" ? "text-white" : ""}`}
                  >
                    Faturamento Alocado <SortIcon col="fatAlocado" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedGroups.map((group) =>
                group.rows.map((row, rowIndex) => (
                  <tr
                    key={`${group.projeto}-${rowIndex}`}
                    className="border-b border-zinc-800/40 last:border-0"
                  >
                    {rowIndex === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        className="text-zinc-500 pr-6 align-top pt-4 pb-4 text-xs leading-snug"
                      >
                        {group.projeto}
                      </td>
                    )}
                    <td className="py-3 pr-6">
                      <button
                        onClick={() => setSelected(row.detail)}
                        className="font-medium text-white hover:text-violet-400 transition-colors cursor-pointer text-left"
                      >
                        {row.colaborador}
                      </button>
                    </td>
                    <td className="py-3 pr-6">
                      <span className="text-white">{row.perfil}</span>
                      <span
                        className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          nivelStyles[row.nivel] ?? "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {row.nivel}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-white">{row.horasContratada}</td>
                    <td className="py-3 pr-6 text-white">{row.horasAlocada}</td>
                    <td className="py-3 pr-6 text-white">{row.fatContratado}</td>
                    <td className="py-3 text-white">{row.fatAlocado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={15} />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const showPage =
                  i === 0 ||
                  i === totalPages - 1 ||
                  Math.abs(i - page) <= 1;
                if (!showPage) {
                  if (i === 1 && page > 2) return <span key={i} className="text-zinc-600 px-1">…</span>;
                  if (i === totalPages - 2 && page < totalPages - 3) return <span key={i} className="text-zinc-600 px-1">…</span>;
                  return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      i === page
                        ? "bg-violet-600 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Collaborator Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 pb-3">
              <div>
                <h2 className="text-gray-900 font-bold text-lg">Detalhes do Colaborador</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Informações detalhadas sobre o colaborador e seus projetos alocados.
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer shrink-0 ml-4"
              >
                <X size={15} />
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Nome do Colaborador" value={selected.nome} />
              <InfoField label="Perfil" value={selected.perfil} />
              <InfoField label="Nível" value={selected.nivel} />
              <InfoField label="Regime" value={selected.regime} />
              <InfoField label="Tribo" value={selected.tribo} />
              <InfoField label="Líder da Tribo" value={selected.liderTribo} />
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="px-6 py-5">
              <h3 className="text-gray-900 font-semibold text-base mb-3">Projetos Alocados</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">Projeto</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">Horas Alocadas</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">Período</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.projetos.map((p, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-800">{p.projeto}</td>
                        <td className="px-4 py-3 text-gray-800">{p.horasAlocadas}</td>
                        <td className="px-4 py-3 text-gray-800">{p.periodo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
