import React, { useState } from "react";
import "./App.css";

const TransactionsPage = ({ expenses }) => {
  const [globalFilter, setGlobalFilter] = useState({ day: "", month: "", year: "" });
  const [debitFilter, setDebitFilter] = useState({ day: "", month: "", year: "" });
  const [creditFilter, setCreditFilter] = useState({ day: "", month: "", year: "" });

  const styles = {
    container: {
      maxWidth: "900px",
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
    filterContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "#eef2f6",
      borderRadius: "10px",
    },
    filterSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px",
    },
    dropdown: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #adb5bd",
      minWidth: "100px",
      fontWeight: "600",
    },
    sectionHeader: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#34495e",
      marginTop: "30px",
      marginBottom: "15px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "20px",
    },
    tableHeader: {
      backgroundColor: "#1abc9c",
      color: "white",
      fontWeight: "bold",
    },
    th: {
      padding: "15px",
      textAlign: "left",
      borderBottom: "2px solid #adb5bd",
    },
    td: {
      padding: "15px",
      borderBottom: "1px solid #adb5bd",
    },
    tr: {
      transition: "background-color 0.2s",
      backgroundColor: "#f8f9fa",
    },
    trHover: {
      backgroundColor: "#e9ecef",
    },
    debitRow: {
      color: "#e74c3c",
    },
    creditRow: {
      color: "#2ecc71",
    },
    totalSection: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "10px",
      marginBottom: "30px",
      gap: "20px",
    },
    totalCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      textAlign: "center",
      flex: 1,
    },
    totalLabel: {
      fontSize: "18px",
      color: "#34495e",
      marginBottom: "5px",
    },
    totalAmount: {
      fontSize: "28px",
      fontWeight: "bold",
    },
    noTransactions: {
      textAlign: "center",
      color: "#95a5a6",
      marginTop: "50px",
      fontSize: "18px",
    },
    receiptLink: {
      color: "#3498db",
      textDecoration: "none",
      fontWeight: "bold",
      transition: "color 0.2s",
    },
    receiptLinkHover: {
      color: "#2980b9",
    },
    categoryTotals: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "15px",
    },
    categoryCard: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      textAlign: "left",
      borderLeft: "4px solid #3498db",
    },
    categoryTotalAmount: {
      fontSize: "20px",
      fontWeight: "bold",
    },
  };

  const getFiltered = (tx, filter) => {
    const txDate = new Date(tx.date);
    const day = txDate.getDate().toString();
    const month = (txDate.getMonth() + 1).toString();
    const year = txDate.getFullYear().toString();

    return (
      (!filter.day || filter.day === day) &&
      (!filter.month || filter.month === month) &&
      (!filter.year || filter.year === year)
    );
  };

  const globalFiltered = expenses.filter((tx) => getFiltered(tx, globalFilter));
  const debitFiltered = globalFiltered.filter((tx) => tx.type === "Debit" && getFiltered(tx, debitFilter));
  const creditFiltered = globalFiltered.filter((tx) => tx.type === "Credit" && getFiltered(tx, creditFilter));

  const totalDebit = debitFiltered.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalCredit = creditFiltered.reduce((sum, tx) => sum + Number(tx.amount), 0);

  const categoryTotals = globalFiltered.reduce((acc, tx) => {
    const key = `${tx.category} (${tx.type})`;
    acc[key] = (acc[key] || 0) + Number(tx.amount);
    return acc;
  }, {});

  const renderFilterDropdowns = (filterState, setFilterState) => (
    <div style={{ display: "flex", gap: "10px" }}>
      <select
        style={styles.dropdown}
        value={filterState.day}
        onChange={(e) => setFilterState({ ...filterState, day: e.target.value })}
      >
        <option value="">Day</option>
        {[...Array(31)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        style={styles.dropdown}
        value={filterState.month}
        onChange={(e) => setFilterState({ ...filterState, month: e.target.value })}
      >
        <option value="">Month</option>
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        style={styles.dropdown}
        value={filterState.year}
        onChange={(e) => setFilterState({ ...filterState, year: e.target.value })}
      >
        <option value="">Year</option>
        {[2023, 2024, 2025].map((yr) => (
          <option key={yr} value={yr}>{yr}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📜 Transactions</h2>

      {/* Global Filter Section */}
      <div style={styles.filterContainer}>
        <label style={{ fontWeight: "bold", color: "#000" }}>📅 Filter All:</label>
        {renderFilterDropdowns(globalFilter, setGlobalFilter)}
      </div>

      {expenses.length === 0 ? (
        <p style={styles.noTransactions}>No transactions yet. Add some from the Home page!</p>
      ) : (
        <>
          {/* Debit Transactions Table */}
          <h3 style={styles.sectionHeader}>🔻 Debit Transactions</h3>
          <div style={styles.filterSection}>
            <label style={{ fontWeight: "bold", color: "#000" }}>📅 Filter Debit:</label>
            {renderFilterDropdowns(debitFilter, setDebitFilter)}
          </div>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={{ ...styles.th, borderTopLeftRadius: "10px" }}>Category</th>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>Date</th>
                <th style={{ ...styles.th, borderTopRightRadius: "10px" }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {debitFiltered.map((tx) => (
                <tr
                  key={tx.id}
                  style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.tr.backgroundColor}
                >
                  <td style={{ ...styles.td, color: "#000" }}>{tx.category}</td>
                  <td style={{ ...styles.td, color: styles.debitRow.color }}>{tx.amount}</td>
                  <td style={{ ...styles.td, color: "#000" }}>{tx.date}</td>
                  <td style={{ ...styles.td, color: "#000" }}>
                    {tx.receipt ? (
                      <a href={tx.receipt} target="_blank" rel="noopener noreferrer" style={styles.receiptLink}>
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Debit Section */}
          <div style={styles.totalSection}>
            <div style={styles.totalCard}>
              <div style={styles.totalLabel}>Total Debit</div>
              <div style={{ ...styles.totalAmount, color: styles.debitRow.color }}>
                ₹{totalDebit}
              </div>
            </div>
          </div>

          {/* Credit Transactions Table */}
          <h3 style={styles.sectionHeader}>🔺 Credit Transactions</h3>
          <div style={styles.filterSection}>
            <label style={{ fontWeight: "bold", color: "#000" }}>📅 Filter Credit:</label>
            {renderFilterDropdowns(creditFilter, setCreditFilter)}
          </div>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={{ ...styles.th, borderTopLeftRadius: "10px" }}>Category</th>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>Date</th>
                <th style={{ ...styles.th, borderTopRightRadius: "10px" }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {creditFiltered.map((tx) => (
                <tr
                  key={tx.id}
                  style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.tr.backgroundColor}
                >
                  <td style={{ ...styles.td, color: "#000" }}>{tx.category}</td>
                  <td style={{ ...styles.td, color: styles.creditRow.color }}>{tx.amount}</td>
                  <td style={{ ...styles.td, color: "#000" }}>{tx.date}</td>
                  <td style={{ ...styles.td, color: "#000" }}>
                    {tx.receipt ? (
                      <a href={tx.receipt} target="_blank" rel="noopener noreferrer" style={styles.receiptLink}>
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Credit Section */}
          <div style={styles.totalSection}>
            <div style={styles.totalCard}>
              <div style={styles.totalLabel}>Total Credit</div>
              <div style={{ ...styles.totalAmount, color: styles.creditRow.color }}>
                ₹{totalCredit}
              </div>
            </div>
          </div>

          <h3 style={styles.sectionHeader}>📊 Category Totals</h3>
          <div style={styles.categoryTotals}>
            {Object.entries(categoryTotals).map(([key, value]) => (
              <div key={key} style={styles.categoryCard}>
                <div>{key}</div>
                <div style={{ ...styles.categoryTotalAmount, color: key.includes("(Debit)") ? styles.debitRow.color : styles.creditRow.color }}>
                  ₹{value}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
