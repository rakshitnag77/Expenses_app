import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import TrackerPage from "./TrackerPage";
import TransactionsPage from "./TransactionsPage";
import LoginPage from "./LoginPage";
import AdminDashboard from "./AdminDashboard";
import CategorySummaryPage from "./CategorySummaryPage";
import AnalyticsPage from "./AnalyticsPage"; // Import the new page
import "./App.css";

const sidebarStyles = {
  container: {
    width: "240px",
    backgroundColor: "#1a237e",
    minHeight: "100vh",
    padding: "20px 0",
    boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ecf0f1",
    padding: "0 20px",
    marginBottom: "40px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    textDecoration: "none",
    color: "#bdc3c7",
    fontSize: "16px",
    fontWeight: "500",
    padding: "15px 20px",
    transition: "background-color 0.3s, color 0.3s",
    borderLeft: "4px solid transparent",
  },
  linkHover: {
    backgroundColor: "rgba(0, 123, 255, 0.2)",
    color: "#fff",
  },
  linkActive: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "600",
    borderLeftColor: "#fff",
    borderRadius: "0 50px 50px 0",
  },
  subLink: {
    textDecoration: "none",
    color: "#bdc3c7",
    fontSize: "14px",
    padding: "10px 20px 10px 40px",
    transition: "background-color 0.3s, color 0.3s",
    display: "block",
  },
  subLinkActive: {
    color: "#fff",
    fontWeight: "bold",
  },
};

const Sidebar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const isAdminActive = currentPath.startsWith("/admin") || currentPath.startsWith("/category-summary") || currentPath.startsWith("/analytics");

  return (
    <div style={sidebarStyles.container}>
      <h2 style={sidebarStyles.logo}>💰 Expense App</h2>
      <nav style={sidebarStyles.nav}>
        <Link
          to="/"
          style={{
            ...sidebarStyles.link,
            ...(hoveredLink === "/" ? sidebarStyles.linkHover : {}),
            ...(currentPath === "/" ? sidebarStyles.linkActive : {}),
          }}
          onMouseEnter={() => setHoveredLink("/")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Home
        </Link>
        <Link
          to="/transactions"
          style={{
            ...sidebarStyles.link,
            ...(hoveredLink === "/transactions" ? sidebarStyles.linkHover : {}),
            ...(currentPath === "/transactions" ? sidebarStyles.linkActive : {}),
          }}
          onMouseEnter={() => setHoveredLink("/transactions")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Transactions
        </Link>
        <Link
          to="/login"
          style={{
            ...sidebarStyles.link,
            ...(hoveredLink === "/login" ? sidebarStyles.linkHover : {}),
            ...(isAdminActive ? sidebarStyles.linkActive : {}),
          }}
          onMouseEnter={() => setHoveredLink("/login")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Admin
        </Link>
        {isAdminActive && (
          <div style={{ paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <Link
              to="/admin-dashboard"
              style={{
                ...sidebarStyles.subLink,
                ...(currentPath === "/admin-dashboard" ? sidebarStyles.subLinkActive : {}),
              }}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/category-summary"
              style={{
                ...sidebarStyles.subLink,
                ...(currentPath === "/category-summary" ? sidebarStyles.subLinkActive : {}),
              }}
            >
              Category Summary
            </Link>
            <Link
              to="/analytics"
              style={{
                ...sidebarStyles.subLink,
                ...(currentPath === "/analytics" ? sidebarStyles.subLinkActive : {}),
              }}
            >
              Analytics
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <TrackerPage
                  expenses={expenses}
                  setExpenses={setExpenses}
                  accountBalance={accountBalance}
                  setAccountBalance={setAccountBalance}
                />
              }
            />
            <Route
              path="/transactions"
              element={<TransactionsPage expenses={expenses} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard expenses={expenses} />} />
            <Route path="/category-summary" element={<CategorySummaryPage expenses={expenses} />} />
            <Route path="/analytics" element={<AnalyticsPage expenses={expenses} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

