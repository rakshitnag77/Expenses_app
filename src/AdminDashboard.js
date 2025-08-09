import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from "recharts";

const AdminDashboard = ({ expenses }) => {
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#f9fafb",
      borderRadius: "15px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      fontSize: "32px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "30px",
    },
    summaryCards: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
      gap: "20px",
    },
    card: {
      flex: 1,
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      textAlign: "center",
      borderLeft: "5px solid",
    },
    cardHeader: {
      fontSize: "18px",
      color: "#555",
      marginBottom: "10px",
    },
    totalAmount: {
      fontSize: "28px",
      fontWeight: "bold",
    },
    debitColor: {
      color: "#e74c3c",
      borderColor: "#e74c3c",
    },
    creditColor: {
      color: "#2ecc71",
      borderColor: "#2ecc71",
    },
    chartSection: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "30px",
    },
    chartHeader: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#34495e",
      marginBottom: "20px",
      textAlign: "center",
    },
    chartGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "30px",
    },
    tableContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginTop: "30px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
    },
    tableHeader: {
      backgroundColor: "#34495e",
      color: "white",
      fontWeight: "bold",
    },
    th: {
      padding: "15px",
      textAlign: "left",
      borderBottom: "2px solid #ccc",
    },
    td: {
      padding: "15px",
      borderBottom: "1px solid #eee",
      color: "#000",
    },
    tableRow: {
      transition: "background-color 0.2s",
    },
    tableRowHover: {
      backgroundColor: "#f8f9fa",
    },
    receiptLink: {
      color: "#3498db",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  const totalDebit = expenses.filter(e => e.type === "Debit").reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = expenses.filter(e => e.type === "Credit").reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  expenses.forEach(e => {
    const key = `${e.category} (${e.type})`;
    categoryMap[key] = (categoryMap[key] || 0) + e.amount;
  });

  const categoryDebitMap = expenses
    .filter(e => e.type === "Debit")
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  
  const monthlyDataMap = expenses.reduce((acc, e) => {
    const date = new Date(e.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) {
      acc[key] = { name: key, debit: 0, credit: 0 };
    }
    if (e.type === "Debit") {
      acc[key].debit += e.amount;
    } else {
      acc[key].credit += e.amount;
    }
    return acc;
  }, {});

  const monthlyData = Object.values(monthlyDataMap);

  const balanceOverTime = monthlyData.reduce((acc, curr) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    const newBalance = lastBalance + curr.credit - curr.debit;
    acc.push({ ...curr, balance: newBalance });
    return acc;
  }, []);

  const categoryDebitData = Object.entries(categoryDebitMap).map(([name, value]) => ({ name, value }));
  const pieChartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa33ff", "#ff3377"];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      
      {/* Summary Cards Section */}
      <div style={styles.summaryCards}>
        <div style={{ ...styles.card, ...styles.creditColor }}>
          <div style={styles.cardHeader}>Total Credit</div>
          <div style={styles.totalAmount}>₹{totalCredit}</div>
        </div>
        <div style={{ ...styles.card, ...styles.debitColor }}>
          <div style={styles.cardHeader}>Total Debit</div>
          <div style={styles.totalAmount}>₹{totalDebit}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartGrid}>
        <div style={styles.chartSection}>
          <h3 style={styles.chartHeader}>Expenses by Category & Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieChartData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartSection}>
          <h3 style={styles.chartHeader}>Monthly Debit vs Credit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="credit" fill="#2ecc71" stackId="a" name="Credit" />
              <Bar dataKey="debit" fill="#e74c3c" stackId="a" name="Debit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartSection}>
          <h3 style={styles.chartHeader}>Debit by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryDebitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#e74c3c" name="Debit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartSection}>
          <h3 style={styles.chartHeader}>Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={balanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="#8884d8" name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table Section */}
      <h3 style={{ ...styles.chartHeader, marginTop: "2rem" }}>📋 All Transactions</h3>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: "10px" }}>Category</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, borderTopRightRadius: "10px" }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr
                key={i}
                style={styles.tableRow}
                onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor)}
                onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = "white")}
              >
                <td style={styles.td}>{e.category}</td>
                <td style={{ ...styles.td, color: e.type === "Debit" ? styles.debitColor.color : styles.creditColor.color }}>{e.type}</td>
                <td style={styles.td}>₹{e.amount}</td>
                <td style={styles.td}>{e.date}</td>
                <td style={styles.td}>
                  {e.receipt && (
                    <a href={e.receipt} target="_blank" rel="noreferrer" style={styles.receiptLink}>
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
