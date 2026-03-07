"use server";

import { fetchClientes, getAllAlocacoes } from "../lib/api";
import { formatDate } from "../lib/calc";

function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(";")
    )
    .join("\n");
}

export async function exportSimplificado(): Promise<string> {
  const clientes = await fetchClientes();
  const alocacoes = getAllAlocacoes(clientes);

  const headers = [
    "Cliente",
    "Projeto",
    "Colaborador",
    "Perfil",
    "Nível",
    "Regime",
    "% Projeto",
    "Horas Alocadas",
    "Valor (R$)",
    "Gerando Faturamento",
    "Início",
    "Fim",
  ];

  const rows = alocacoes.map((a) => [
    a.cliente,
    a.projeto,
    a.pessoa_colaborador,
    a.posição,
    a.nível,
    a.regime,
    `${a.percent_projeto}%`,
    Math.round((160 * a.percent_projeto) / 100),
    a.valor,
    a.gerando_faturamento,
    formatDate(a.inicio_periodo),
    a.final_periodo ? formatDate(a.final_periodo) : "Em andamento",
  ]);

  return toCsv([headers, ...rows]);
}

type FieldMapper = (a: Awaited<ReturnType<typeof getAllAlocacoes>>[0]) => string | number;

const FIELD_MAP: Record<string, FieldMapper> = {
  "Nome do Cliente": (a) => a.cliente,
  Projeto: (a) => a.projeto,
  "Perfil Contratado": (a) => a.posição,
  "Nível Contratado": (a) => a.nível,
  "Período do Contrato": (a) =>
    formatDate(a.inicio_periodo) +
    (a.final_periodo ? ` - ${formatDate(a.final_periodo)}` : " - Em andamento"),
  "Horas Contratadas": (a) => Math.round((160 * a.percent_projeto) / 100),
  "Faturamento Contratado": (a) => a.valor,
  "Colaborador Alocado": (a) => a.pessoa_colaborador,
  "Perfil do Colaborador": (a) => a.posição,
  "Nível do Colaborador": (a) => a.nível,
  "Horas Alocadas": (a) => Math.round((160 * a.percent_projeto) / 100),
  Tribo: (a) => a.tribo,
  "Líder do Colaborador": () => "—",
  "Período de Alocação": (a) =>
    formatDate(a.inicio_periodo) +
    (a.final_periodo ? ` - ${formatDate(a.final_periodo)}` : " - Em andamento"),
  "Faturamento Alocado": (a) =>
    a.gerando_faturamento === "Sim" ? a.valor : "0.00",
};

export async function exportDetalhado(selectedFields: string[]): Promise<string> {
  const clientes = await fetchClientes();
  const alocacoes = getAllAlocacoes(clientes);

  const validFields = selectedFields.filter((f) => FIELD_MAP[f]);
  if (validFields.length === 0) return "";

  const rows = alocacoes.map((a) => validFields.map((f) => FIELD_MAP[f](a)));

  return toCsv([validFields, ...rows]);
}
