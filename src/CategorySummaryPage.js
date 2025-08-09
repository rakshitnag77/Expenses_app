import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CategorySummaryPage = ({ expenses }) => {
  // Styles for the component
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center",
    },
    chartContainer: {
      position: "relative",
      height: "300px",
      marginBottom: "30px",
    },
    totalAmountLabel: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#34495e",
    },
    totalAmountValue: {
      display: "block",
      marginTop: "5px",
      fontSize: "32px",
      color: "#1a237e",
    },
    list: {
      listStyle: "none",
      padding: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "15px",
    },
    listItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f4f7f9",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      transition: "background-color 0.2s",
      cursor: "pointer",
    },
    listItemHover: {
      backgroundColor: "#e8edf0",
    },
    colorDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      marginRight: "15px",
    },
    categoryName: {
      flex: 1,
      fontWeight: "bold",
      fontSize: "16px",
      color: "#34495e",
    },
    categoryAmount: {
      fontWeight: "600",
      color: "#1a237e",
    },
  };

  // Calculate totals and format data for the chart
  const categoryTotals = expenses.reduce((acc, expense) => {
    const key = expense.category;
    acc[key] = (acc[key] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa33ff", "#ff3377", "#34495e"];
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Category Summary</h2>

      {expenses.length > 0 ? (
        <>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  fill="#8884d8"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={styles.totalAmountLabel}>
              Total
              <span style={styles.totalAmountValue}>₹{totalAmount}</span>
            </div>
          </div>
          
          <h3 style={{ ...styles.header, fontSize: "24px", textAlign: "left" }}>Spending by Category</h3>
          <ul style={styles.list}>
            {chartData.map((entry, index) => (
              <li
                key={entry.name}
                style={styles.listItem}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.listItemHover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f7f9'}
              >
                <div style={{ ...styles.colorDot, backgroundColor: COLORS[index % COLORS.length] }} />
                <div style={styles.categoryName}>{entry.name}</div>
                <div style={styles.categoryAmount}>₹{entry.value}</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#95a5a6" }}>
          No expenses to summarize.
        </p>
      )}
    </div>
  );
};

export default CategorySummaryPage;