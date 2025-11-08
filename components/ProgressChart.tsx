"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface ProgressData {
  date: string;
  weight: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM d"),
    weight: item.weight,
  }));

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weight Progress</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8d5c4" />
            <XAxis dataKey="date" stroke="#8b7d6b" />
            <YAxis stroke="#8b7d6b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e8d5c4",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#ff8c69"
              strokeWidth={2}
              dot={{ fill: "#ff8c69", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-warm-gray">
          No progress data yet. Start logging your progress!
        </div>
      )}
    </div>
  );
}

