"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

interface ChartData {
  chart_type: "bar" | "line" | "pie";
  title: string;
  labels: string[];
  values: number[];
}

interface Props {
  chartData: ChartData;
}

interface DataPoint {
  name: string;
  value: number;
}

const COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#f59e0b"];

export default function DynamicChart({ chartData }: Props) {
  if (!chartData || !chartData.labels || !chartData.values) {
    return null;
  }

  const data: DataPoint[] = chartData.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.values[index],
  }));

  return (
    <div className="bg-zinc-950/65 backdrop-blur-xl rounded-[32px] border border-zinc-900 p-8 w-full overflow-hidden">
      {/* TITLE */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {chartData.title}
        </h2>
      </div>

      {/* CHART CONTAINER */}
      <div className="w-full h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* ========================= */}
          {/* BAR CHART */}
          {/* ========================= */}
          {chartData.chart_type === "bar" ? (
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 10,
              }}
              barCategoryGap={18}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#71717a" 
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                stroke="#71717a"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "16px" }}
                itemStyle={{ color: "#fff", fontSize: "12px" }}
                labelStyle={{ color: "#a1a1aa", fontSize: "11px", fontWeight: "bold" }}
              />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          ) : chartData.chart_type === "line" ? (
            /* ========================= */
            /* LINE CHART */
            /* ========================= */
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 40,
              }}
            >
              <defs>
                <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={80}
                stroke="#71717a"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "16px" }}
                itemStyle={{ color: "#fff", fontSize: "12px" }}
                labelStyle={{ color: "#a1a1aa", fontSize: "11px", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3.5}
                dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          ) : (
            /* ========================= */
            /* PIE CHART */
            /* ========================= */
            <PieChart>
              <Tooltip 
                contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "16px" }}
                itemStyle={{ color: "#fff", fontSize: "12px" }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={160}
                innerRadius={60}
                paddingAngle={3}
                label={{ fill: '#a1a1aa', fontSize: 11 }}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}