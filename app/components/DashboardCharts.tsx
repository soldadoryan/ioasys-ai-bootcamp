"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell,
  LabelList,
  CartesianGrid,
} from "recharts";

const revenueData = [
  { name: "Empresa A", value: 154000, pct: "42.3%", color: "#10b981" },
  { name: "Empresa D", value: 80300, pct: "22.0%", color: "#3b82f6" },
  { name: "Empresa C", value: 52900, pct: "14.5%", color: "#a855f7" },
  { name: "Empresa E", value: 44200, pct: "12.1%", color: "#f59e0b" },
  { name: "Empresa B", value: 33200, pct: "9.1%", color: "#06b6d4" },
];

const monthlyData = [
  { month: "abr", pf: 90000, pj: 0, total: 90000 },
  { month: "mai", pf: 0, pj: 0, total: 2000 },
  { month: "jun", pf: 0, pj: 0, total: 0 },
  { month: "jul", pf: 0, pj: 0, total: 0 },
  { month: "ago", pf: 0, pj: 0, total: 0 },
  { month: "set", pf: 0, pj: 0, total: 0 },
  { month: "out", pf: 0, pj: 0, total: 0 },
  { month: "nov", pf: 0, pj: 0, total: 118000 },
  { month: "dez", pf: 70000, pj: 58000, total: 128000 },
  { month: "jan", pf: 65000, pj: 52000, total: 117000 },
  { month: "fev", pf: 68000, pj: 54000, total: 122000 },
  { month: "mar", pf: 62000, pj: 48000, total: 110000 },
];

const formatCurrency = (value: number) =>
  `R$ ${(value / 1000).toFixed(0)}k`;

const CustomBarLabel = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: string;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, value } = props;
  if (!value || height < 30) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
      fontWeight={600}
    >
      {value}
    </text>
  );
};

const tooltipStyle = {
  background: "#1e1e1e",
  border: "1px solid #27272a",
  borderRadius: "8px",
  color: "white",
  fontSize: 13,
};

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Receita por Cliente */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-base">
          Receita por Cliente
        </h3>
        <p className="text-zinc-400 text-sm mt-0.5 mb-6">
          Top 5 clientes por receita
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueData} barCategoryGap="20%">
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(v: number) => [
                `R$ ${(v / 1000).toFixed(0)}k`,
                "Receita",
              ]}
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {revenueData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
              <LabelList
                dataKey="pct"
                content={(props) => <CustomBarLabel {...(props as Parameters<typeof CustomBarLabel>[0])} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Faturamento Mensal */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-base">
          Faturamento Mensal
        </h3>
        <p className="text-zinc-400 text-sm mt-0.5 mb-6">
          Últimos 12 meses por tipo de cliente
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(v: number, name: string) => [
                `R$ ${(v / 1000).toFixed(0)}k`,
                name === "pf" ? "Pessoa Física" : name === "pj" ? "Pessoa Jurídica" : "Total",
              ]}
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar
              dataKey="pf"
              fill="#8b5cf6"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="pj"
              fill="#06b6d4"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
