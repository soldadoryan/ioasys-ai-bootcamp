"use client";

import { useState } from "react";
import { ArrowUpDown, Pencil, X } from "lucide-react";

type CollaboratorDetail = {
  nome: string;
  perfil: string;
  nivel: string;
  regime: string;
  tribo: string;
  liderTribo: string;
  projetos: { projeto: string; horasAlocadas: string; periodo: string }[];
};

type Row = {
  colaborador: string;
  perfil: string;
  nivel: string;
  horasContratada: string;
  horasAlocada: string;
  fatContratado: string;
  fatAlocado: string;
  detail: CollaboratorDetail;
};

type Group = { projeto: string; rows: Row[] };

const nivelStyles: Record<string, string> = {
  Sênior: "bg-purple-900/60 text-purple-300 border border-purple-700/50",
  Pleno: "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50",
  Júnior: "bg-green-900/60 text-green-300 border border-green-700/50",
};

const tableData: Group[] = [
  {
    projeto: "Portal Web",
    rows: [
      {
        colaborador: "João Silva",
        perfil: "Desenvolvimento",
        nivel: "Sênior",
        horasContratada: "160h",
        horasAlocada: "160h",
        fatContratado: "R$ 24.000,00",
        fatAlocado: "R$ 24.000,00",
        detail: {
          nome: "João Silva",
          perfil: "Desenvolvimento",
          nivel: "Sênior",
          regime: "CLT",
          tribo: "Produto",
          liderTribo: "Ana Lima",
          projetos: [
            { projeto: "Portal Web", horasAlocadas: "160h", periodo: "01/01/2025 - 30/06/2025" },
          ],
        },
      },
      {
        colaborador: "Ana Costa",
        perfil: "Design",
        nivel: "Pleno",
        horasContratada: "120h",
        horasAlocada: "120h",
        fatContratado: "R$ 12.000,00",
        fatAlocado: "R$ 12.000,00",
        detail: {
          nome: "Ana Costa",
          perfil: "Design",
          nivel: "Pleno",
          regime: "PJ",
          tribo: "Design",
          liderTribo: "Carlos Mendes",
          projetos: [
            { projeto: "Portal Web", horasAlocadas: "120h", periodo: "01/01/2025 - 30/06/2025" },
          ],
        },
      },
      {
        colaborador: "Carlos Mendes",
        perfil: "Desenvolvimento",
        nivel: "Júnior",
        horasContratada: "160h",
        horasAlocada: "160h",
        fatContratado: "R$ 12.800,00",
        fatAlocado: "R$ 12.800,00",
        detail: {
          nome: "Carlos Mendes",
          perfil: "Desenvolvimento",
          nivel: "Júnior",
          regime: "CLT",
          tribo: "Produto",
          liderTribo: "Ana Lima",
          projetos: [
            { projeto: "Portal Web", horasAlocadas: "160h", periodo: "01/01/2025 - 30/06/2025" },
          ],
        },
      },
    ],
  },
  {
    projeto: "E-commerce",
    rows: [
      {
        colaborador: "Bruno Ferreira",
        perfil: "Desenvolvimento",
        nivel: "Sênior",
        horasContratada: "160h",
        horasAlocada: "160h",
        fatContratado: "R$ 24.000,00",
        fatAlocado: "R$ 24.000,00",
        detail: {
          nome: "Bruno Ferreira",
          perfil: "Desenvolvimento",
          nivel: "Sênior",
          regime: "PJ",
          tribo: "Plataforma",
          liderTribo: "Fernanda Lima",
          projetos: [
            { projeto: "E-commerce", horasAlocadas: "160h", periodo: "01/12/2025 - 31/03/2026" },
            { projeto: "Sistema de CRM", horasAlocadas: "80h", periodo: "01/12/2025 - 31/03/2026" },
          ],
        },
      },
      {
        colaborador: "Camila Rodrigues",
        perfil: "Desenvolvimento",
        nivel: "Pleno",
        horasContratada: "160h",
        horasAlocada: "160h",
        fatContratado: "R$ 19.200,00",
        fatAlocado: "R$ 19.200,00",
        detail: {
          nome: "Camila Rodrigues",
          perfil: "Desenvolvimento",
          nivel: "Pleno",
          regime: "CLT",
          tribo: "Plataforma",
          liderTribo: "Fernanda Lima",
          projetos: [
            { projeto: "E-commerce", horasAlocadas: "160h", periodo: "01/12/2025 - 31/03/2026" },
          ],
        },
      },
      {
        colaborador: "Diego Santos",
        perfil: "Design",
        nivel: "Sênior",
        horasContratada: "120h",
        horasAlocada: "100h",
        fatContratado: "R$ 14.400,00",
        fatAlocado: "R$ 12.000,00",
        detail: {
          nome: "Diego Santos",
          perfil: "Design",
          nivel: "Sênior",
          regime: "PJ",
          tribo: "Design",
          liderTribo: "Carlos Mendes",
          projetos: [
            { projeto: "E-commerce", horasAlocadas: "100h", periodo: "01/12/2025 - 31/03/2026" },
          ],
        },
      },
      {
        colaborador: "Fernanda Lima",
        perfil: "Desenvolvimento",
        nivel: "Pleno",
        horasContratada: "160h",
        horasAlocada: "160h",
        fatContratado: "R$ 19.200,00",
        fatAlocado: "R$ 19.200,00",
        detail: {
          nome: "Fernanda Lima",
          perfil: "Desenvolvimento",
          nivel: "Pleno",
          regime: "CLT",
          tribo: "Plataforma",
          liderTribo: "Fernanda Lima",
          projetos: [
            { projeto: "E-commerce", horasAlocadas: "160h", periodo: "01/12/2025 - 31/03/2026" },
          ],
        },
      },
    ],
  },
];

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-medium">{value}</p>
    </div>
  );
}

export function TeamTable() {
  const [selected, setSelected] = useState<CollaboratorDetail | null>(null);

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold">Equipe Alocada nos Projetos</h2>
          <button className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer">
            <Pencil size={14} />
            Editar
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6 w-32">Projeto</th>
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6">
                <span className="flex items-center gap-1">
                  Colaborador <ArrowUpDown size={12} />
                </span>
              </th>
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Perfil / Nível</th>
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Horas Contratada</th>
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6">Horas Alocada</th>
              <th className="text-left text-zinc-400 font-medium pb-3 pr-6">
                <span className="flex items-center gap-1">
                  Faturamento Contratado <ArrowUpDown size={12} />
                </span>
              </th>
              <th className="text-left text-zinc-400 font-medium pb-3">
                <span className="flex items-center gap-1">
                  Faturamento Alocado <ArrowUpDown size={12} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((group) =>
              group.rows.map((row, rowIndex) => (
                <tr
                  key={`${group.projeto}-${rowIndex}`}
                  className="border-b border-zinc-800/40 last:border-0"
                >
                  {rowIndex === 0 && (
                    <td
                      rowSpan={group.rows.length}
                      className="text-zinc-500 pr-6 align-top pt-4 pb-4"
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
                      className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${nivelStyles[row.nivel]}`}
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
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-3">
              <div>
                <h2 className="text-gray-900 font-bold text-lg">Detalhes do Colaborador</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Informações detalhadas sobre o colaborador e seus projetos alocados.
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 ml-4"
              >
                <X size={15} />
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            {/* Info fields */}
            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Nome do Colaborador" value={selected.nome} />
              <InfoField label="Perfil" value={selected.perfil} />
              <InfoField label="Nível" value={selected.nivel} />
              <InfoField label="Regime" value={selected.regime} />
              <InfoField label="Tribo" value={selected.tribo} />
              <InfoField label="Líder da Tribo" value={selected.liderTribo} />
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            {/* Projects table */}
            <div className="px-6 py-5">
              <h3 className="text-gray-900 font-semibold text-base mb-3">Projetos Alocados</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">Projeto</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">
                        Horas Alocadas
                      </th>
                      <th className="text-left text-gray-500 font-medium px-4 py-2.5">
                        Período de Alocação
                      </th>
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
