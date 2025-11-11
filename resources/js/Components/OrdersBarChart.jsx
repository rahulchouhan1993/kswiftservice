import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function OrdersBarChart({ orders = [], title = "Orders Overview" }) {
  // Debug logs
  console.log("Raw orders:", orders);

  // Clean and validate chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders
      .filter(
        (o) =>
          o &&
          typeof o === "object" &&
          typeof o.type === "string" &&
          typeof o.total === "number"
      )
      .map((o) => ({
        type: o.type,
        total: o.total,
      }));
  }, [orders]);

  console.log("Chart Data:", chartData);

  // Total orders
  const totalOrders = chartData.reduce((sum, o) => sum + o.total, 0);

  // Assign colors safely
  const typeColors = useMemo(() => {
    const map = {};
    chartData.forEach((item, index) => {
      if (item?.type) {
        map[item.type] = COLORS[index % COLORS.length];
      }
    });
    return map;
  }, [chartData]);

  // Fallback UI
  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400">
          No valid order data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1b213a] rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total Orders: {totalOrders.toLocaleString()}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="type" stroke="#9ca3af" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Orders" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => {
                const color = typeColors[entry?.type] || "#ccc";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
