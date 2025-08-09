import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = ({ expenses }) => {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const styles = {
    container: {
      padding: "30px",
      backgroundColor: "#f4f7f9",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "20px",
      borderBottom: "2px solid #e0e6ed",
      paddingBottom: "10px",
    },
    filters: {
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      alignItems: "center",
    },
    select: {
      padding: "10px 15px",
      borderRadius: "8px",
      border: "1px solid #c8dcfc",
      fontSize: "16px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      transition: "border-color 0.3s",
    },
    section: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      padding: "25px",
      marginBottom: "25px",
    },
    sectionHeader: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#34495e",
      marginBottom: "20px",
      textAlign: "center",
    },
    description: {
      fontSize: "16px",
      color: "#555",
      lineHeight: "1.6",
      textAlign: "justify",
      marginTop: "20px",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "25px",
    },
    statCard: {
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "18px",
      color: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    debitCard: { backgroundColor: "#e74c3c" },
    creditCard: { backgroundColor: "#27ae60" },
    chartContainer: {
      width: "100%",
      height: "400px",
      marginTop: "20px",
    },
    report: {
      fontSize: "18px",
      color: "#2c3e50",
      lineHeight: "1.8",
      backgroundColor: "#e8f0fe",
      padding: "25px",
      borderRadius: "10px",
    },
  };

  const getMonths = () => {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

  const monthOptions = getMonths();
  const yearOptions = getYears();

  useEffect(() => {
    let filtered = expenses;
    if (selectedYear) {
      filtered = filtered.filter(exp => new Date(exp.date).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth) {
      const monthIndex = monthOptions.indexOf(selectedMonth);
      filtered = filtered.filter(exp => new Date(exp.date).getMonth() === monthIndex);
    }
    setFilteredExpenses(filtered);
  }, [expenses, selectedMonth, selectedYear]);

  // Data for the Line Chart
  const lineChartData = monthOptions.map((month, index) => {
    const monthlyDebits = expenses
      .filter(exp => new Date(exp.date).getFullYear().toString() === selectedYear && new Date(exp.date).getMonth() === index && exp.type === "Debit")
      .reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyCredits = expenses
      .filter(exp => new Date(exp.date).getFullYear().toString() === selectedYear && new Date(exp.date).getMonth() === index && exp.type === "Credit")
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { month, Debits: monthlyDebits, Credits: monthlyCredits };
  });

  const totalDebits = filteredExpenses.filter(e => e.type === "Debit").reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = filteredExpenses.filter(e => e.type === "Credit").reduce((sum, e) => sum + e.amount, 0);

  const renderAnalyticsReport = () => {
    const highestDebitCategory = filteredExpenses
      .filter(exp => exp.type === "Debit")
      .reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});
    
    let maxCategory = null;
    let maxAmount = 0;
    for (const category in highestDebitCategory) {
      if (highestDebitCategory[category] > maxAmount) {
        maxAmount = highestDebitCategory[category];
        maxCategory = category;
      }
    }

    const formattedDate = selectedMonth ? `${selectedMonth}, ${selectedYear}` : (selectedYear ? selectedYear : "all time");
    const summary = `During the period of **${formattedDate}**, a total of **₹${totalCredits.toFixed(2)}** was credited to your account, while total debits amounted to **₹${totalDebits.toFixed(2)}**. Your overall financial position has seen a change of **₹${(totalCredits - totalDebits).toFixed(2)}**. The primary source of spending was identified as **${maxCategory || 'uncategorized'}**, with expenses totaling **₹${maxAmount.toFixed(2)}**. This report highlights key financial movements, allowing you to easily track your cash flow and identify major spending areas.`;

    return (
      <div style={styles.report}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px", textAlign: "center", color: "#34495e" }}>Financial Performance Summary</h2>
        <p style={{ margin: "0" }}>{summary}</p>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Analytics Dashboard</h1>

      <div style={styles.filters}>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.select}>
          <option value="">All Years</option>
          {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={styles.select}>
          <option value="">All Months</option>
          {monthOptions.map(month => <option key={month} value={month}>{month}</option>)}
        </select>
      </div>

      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, ...styles.debitCard }}>
          Total Debits: ₹{totalDebits.toFixed(2)}
        </div>
        <div style={{ ...styles.statCard, ...styles.creditCard }}>
          Total Credits: ₹{totalCredits.toFixed(2)}
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Monthly Cash Flow Trend</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer>
            <LineChart
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Debits" stroke="#e74c3c" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Credits" stroke="#27ae60" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.section}>
        {renderAnalyticsReport()}
      </div>
    </div>
  );
};

export default AnalyticsPage;
