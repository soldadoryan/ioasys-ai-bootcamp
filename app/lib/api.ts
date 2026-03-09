export type Alocacao = {
  id: number;
  pessoa_colaborador: string;
  tribo: string;
  area: string;
  posição: string;
  nível: string;
  projeto: string;
  percent_projeto: number;
  regime: string;
  gerando_faturamento: string;
  inicio_periodo: number;
  final_periodo?: number;
  cliente: string;
  valor: string;
};

export type Cliente = {
  nome: string;
  alocacoes: Alocacao[];
};

type ApiCliente = {
  client_id: number;
  created_at: string;
  nome: string;
  allocation: Alocacao[];
};

export async function fetchClientes(): Promise<Cliente[]> {
  const res = await fetch("https://n8n.ioasys.com.br/webhook/cliente", {
    next: { revalidate: 1 },
  });
  if (!res.ok) throw new Error("Falha ao buscar dados da API");
  const json: ApiCliente[] = await res.json();
  return json.map((c) => ({ nome: c.nome, alocacoes: c.allocation }));
}

export function getAllAlocacoes(clientes: Cliente[]): Alocacao[] {
  return clientes.flatMap((c) => c.alocacoes);
}
