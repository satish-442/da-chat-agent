import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const ChartRenderer = ({ chart }) => {
  if (!chart || !chart.type || !chart.data) {
    return <pre>{JSON.stringify(chart, null, 2)}</pre>;
  }

  switch (chart.type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={chart.yKey} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={chart.yKey} stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chart.data}
              dataKey={chart.valueKey}
              nameKey={chart.nameKey}
              cx="50%" cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <pre>{JSON.stringify(chart, null, 2)}</pre>;
  }
};

export default ChartRenderer;
