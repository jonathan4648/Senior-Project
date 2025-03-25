import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// Define the Task Type
interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
}

// Props Type
interface DashboardProps {
  tasks: Task[];
}

// Colors for the charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Count tasks per category
  const categoryCount: Record<string, number> = {};
  tasks.forEach(task => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
  });

  // Format data for charts
  const completionData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  const categoryData = Object.keys(categoryCount).map((category, index) => ({
    name: category,
    value: categoryCount[category],
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📊 To-Do App Analytics Dashboard</h2>
      <h4>Total Tasks: {totalTasks}</h4>
      <h4>Completed: {completedTasks}</h4>
      <h4>Pending: {pendingTasks}</h4>
      <h4>Completion Rate: {completionPercentage.toFixed(2)}%</h4>

      <div style={{ display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap" }}>
        {/* Completion Pie Chart */}
        <PieChart width={300} height={300}>
          <Pie data={completionData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
            {completionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Task Category Bar Chart */}
        <BarChart width={400} height={300} data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default Dashboard;
