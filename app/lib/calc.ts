import type { Alocacao, Cliente } from "./api";

// Excel serial date → JS Date
export function excelToDate(serial: number): Date {
  return new Date((serial - 25569) * 86400 * 1000);
}

export function formatDate(serial: number): string {
  return excelToDate(serial).toLocaleDateString("pt-BR");
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

// --- KPIs ---

export function calcValorTotal(alocacoes: Alocacao[]): number {
  return alocacoes
    .filter((a) => a.gerando_faturamento === "Sim")
    .reduce((sum, a) => sum + parseFloat(a.valor), 0);
}

export function calcQtdClientes(clientes: Cliente[]): number {
  return clientes.length;
}

export function calcQtdProjetos(alocacoes: Alocacao[]): number {
  return new Set(alocacoes.map((a) => a.projeto)).size;
}

export function calcTotalHoras(alocacoes: Alocacao[]): number {
  return Math.round(
    alocacoes.reduce((sum, a) => sum + (160 * a.percent_projeto) / 100, 0)
  );
}

export function calcTotalColaboradores(alocacoes: Alocacao[]): number {
  return new Set(alocacoes.map((a) => a.pessoa_colaborador)).size;
}

export function calcContratosFaturar(alocacoes: Alocacao[]): number {
  return new Set(
    alocacoes
      .filter((a) => a.gerando_faturamento === "Sim")
      .map((a) => a.projeto)
  ).size;
}

export function calcContratosVencer(alocacoes: Alocacao[]): number {
  return alocacoes.filter((a) => a.final_periodo !== undefined).length;
}

// --- Chart helpers ---

const CHART_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4"];

export function calcRevenueByCliente(clientes: Cliente[]) {
  const entries = clientes
    .map((c) => ({
      name: c.nome,
      value: calcValorTotal(c.alocacoes),
    }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const total = entries.reduce((s, e) => s + e.value, 0);

  return entries.map((e, i) => ({
    name: e.name,
    value: e.value,
    pct: total > 0 ? `${((e.value / total) * 100).toFixed(1)}%` : "0%",
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

const MONTH_NAMES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function toExcelSerial(date: Date): number {
  return Math.floor(date.getTime() / 86400000) + 25569;
}

export function calcMonthlyData(alocacoes: Alocacao[]) {
  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = toExcelSerial(new Date(d.getFullYear(), d.getMonth(), 1));
    const monthEnd = toExcelSerial(new Date(d.getFullYear(), d.getMonth() + 1, 0));
    const label = `${MONTH_NAMES[d.getMonth()]}/${d.getFullYear()}`;

    let antigos = 0;
    let encerrar = 0;
    let novos = 0;

    for (const a of alocacoes) {
      if (a.gerando_faturamento !== "Sim") continue;
      const start = a.inicio_periodo;
      const end = a.final_periodo ?? Infinity;

      // Active in this month?
      if (start > monthEnd || end < monthStart) continue;

      const val = parseFloat(a.valor);

      if (a.final_periodo && a.final_periodo >= monthStart && a.final_periodo <= monthEnd) {
        encerrar += val;
      } else if (start >= monthStart && start <= monthEnd) {
        novos += val;
      } else {
        antigos += val;
      }
    }

    const total = antigos + encerrar + novos;
    result.push({ month: label, antigos, encerrar, novos, meta: Math.round(total * 1.1) });
  }

  return result;
}

// --- Table helpers ---

export type TableRow = {
  colaborador: string;
  perfil: string;
  nivel: string;
  horasContratada: string;
  horasAlocada: string;
  fatContratado: string;
  fatAlocado: string;
  detail: {
    nome: string;
    perfil: string;
    nivel: string;
    regime: string;
    tribo: string;
    liderTribo: string;
    projetos: { projeto: string; horasAlocadas: string; periodo: string }[];
  };
};

export type TableGroup = { projeto: string; rows: TableRow[] };

export function buildTableGroups(
  filteredAlocacoes: Alocacao[],
  allAlocacoes: Alocacao[]
): TableGroup[] {
  // Build map: collaborator → all their allocations (for detail modal)
  const collabMap = new Map<string, Alocacao[]>();
  for (const a of allAlocacoes) {
    if (!collabMap.has(a.pessoa_colaborador)) collabMap.set(a.pessoa_colaborador, []);
    collabMap.get(a.pessoa_colaborador)!.push(a);
  }

  // Group filtered allocations by project
  const projectMap = new Map<string, Alocacao[]>();
  for (const a of filteredAlocacoes) {
    if (!projectMap.has(a.projeto)) projectMap.set(a.projeto, []);
    projectMap.get(a.projeto)!.push(a);
  }

  return [...projectMap.entries()].map(([projeto, rows]) => ({
    projeto,
    rows: rows.map((a) => {
      const allForCollab = collabMap.get(a.pessoa_colaborador) ?? [a];
      const horas = `${Math.round((160 * a.percent_projeto) / 100)}h`;
      const valor = parseFloat(a.valor);

      return {
        colaborador: a.pessoa_colaborador,
        perfil: a.posição,
        nivel: a.nível,
        horasContratada: horas,
        horasAlocada: horas,
        fatContratado: formatCurrency(valor),
        fatAlocado: a.gerando_faturamento === "Sim" ? formatCurrency(valor) : "R$ 0,00",
        detail: {
          nome: a.pessoa_colaborador,
          perfil: a.posição,
          nivel: a.nível,
          regime: a.regime,
          tribo: a.tribo,
          liderTribo: "—",
          projetos: allForCollab.map((ca) => ({
            projeto: ca.projeto,
            horasAlocadas: `${Math.round((160 * ca.percent_projeto) / 100)}h`,
            periodo:
              formatDate(ca.inicio_periodo) +
              (ca.final_periodo
                ? ` - ${formatDate(ca.final_periodo)}`
                : " - Em andamento"),
          })),
        },
      };
    }),
  }));
}

// --- Filter options ---

export type FilterOptions = {
  clientes: string[];
  projetos: string[];
  areas: string[];
  senioridades: string[];
  tribos: string[];
  lideres: string[];
};

export function buildFilterOptions(clientes: Cliente[]): FilterOptions {
  const alocacoes = clientes.flatMap((c) => c.alocacoes);
  return {
    clientes: ["Todos os clientes", ...new Set(clientes.map((c) => c.nome))],
    projetos: ["Todos os projetos", ...new Set(alocacoes.map((a) => a.projeto))],
    areas: ["Todas as áreas", ...new Set(alocacoes.map((a) => a.area))],
    senioridades: ["Todas as senioridades", ...new Set(alocacoes.map((a) => a.nível))],
    tribos: ["Todas as tribos", ...new Set(alocacoes.map((a) => a.tribo))],
    lideres: ["Todos os líderes"],
  };
}

export type FilterState = {
  cliente: string;
  projeto: string;
  area: string;
  senioridade: string;
  tribo: string;
  lider: string;
  data: string;
};

export const DEFAULT_FILTERS: FilterState = {
  cliente: "Todos os clientes",
  projeto: "Todos os projetos",
  area: "Todas as áreas",
  senioridade: "Todas as senioridades",
  tribo: "Todas as tribos",
  lider: "Todos os líderes",
  data: "",
};

export function applyFilters(
  clientes: Cliente[],
  filters: FilterState
): { clientes: Cliente[]; alocacoes: Alocacao[] } {
  const filteredClientes =
    filters.cliente === "Todos os clientes"
      ? clientes
      : clientes.filter((c) => c.nome === filters.cliente);

  const alocacoes = filteredClientes.flatMap((c) => c.alocacoes).filter((a) => {
    if (filters.projeto !== "Todos os projetos" && a.projeto !== filters.projeto) return false;
    if (filters.area !== "Todas as áreas" && a.area !== filters.area) return false;
    if (filters.senioridade !== "Todas as senioridades" && a.nível !== filters.senioridade) return false;
    if (filters.tribo !== "Todas as tribos" && a.tribo !== filters.tribo) return false;
    return true;
  });

  return { clientes: filteredClientes, alocacoes };
}

export function countActiveFilters(filters: FilterState): number {
  return Object.values(filters).filter(
    (v, i) => v !== "" && v !== Object.values(DEFAULT_FILTERS)[i]
  ).length;
}
