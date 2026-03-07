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
  Legend,
} from "recharts";

type RevenueEntry = {
  name: string;
  value: number;
  pct: string;
  color: string;
};

type MonthlyEntry = {
  month: string;
  antigos: number;
  encerrar: number;
  novos: number;
  meta: number;
};

type Props = {
  revenueData: RevenueEntry[];
  monthlyData: MonthlyEntry[];
};

const formatK = (value: number) => `R$ ${(value / 1000).toFixed(0)}k`;

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
  background: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  color: "#18181b",
  fontSize: 13,
};

export function DashboardCharts({ revenueData, monthlyData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Receita por Cliente */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-base">Receita por Cliente</h3>
        <p className="text-zinc-400 text-sm mt-0.5 mb-6">Top 5 clientes por receita</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueData} barCategoryGap="20%">
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(v) => [`R$ ${(Number(v) / 1000).toFixed(0)}k`, "Receita"]}
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
        <h3 className="text-white font-semibold text-base">Faturamento Mensal</h3>
        <p className="text-zinc-400 text-sm mt-0.5 mb-6">
          Últimos 12 meses por tipo de cliente
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(v, name) => [
                formatK(Number(v)),
                name === "antigos"
                  ? "Clientes Antigos"
                  : name === "encerrar"
                  ? "A Encerrar"
                  : name === "novos"
                  ? "Clientes Novos"
                  : "Meta",
              ]}
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Legend
              formatter={(value) =>
                value === "antigos"
                  ? "Clientes Antigos"
                  : value === "encerrar"
                  ? "A Encerrar"
                  : value === "novos"
                  ? "Clientes Novos"
                  : "Meta"
              }
              wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
            />
            <Bar dataKey="antigos" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} stackId="a" />
            <Bar dataKey="encerrar" fill="#8b5cf6" radius={[0, 0, 0, 0]} barSize={14} stackId="a" />
            <Bar dataKey="novos" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} stackId="a" />
            <Line
              type="monotone"
              dataKey="meta"
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
