// Transaction.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Transaction = ({ expenses = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="container dark-background">
      <h2>All Transactions</h2>
      <ul>
        {expenses.length === 0 ? (
          <li>No transactions found</li>
        ) : (
          expenses.map((e, i) => (
            <li key={i}>
              <strong>{e.category}</strong> - ₹{e.amount} ({e.type})
              <div className="receipt">📅 Date: {e.date}</div>
              <div className="receipt">
                🧾 Receipt:<br />
                <img src={e.receiptURL} alt="Receipt" width="100" style={{ marginTop: "5px", borderRadius: "4px" }} />
              </div>
            </li>
          ))
        )}
      </ul>
      <button onClick={() => navigate("/")}>⬅ Back to Home</button>
    </div>
  );
};

export default Transaction;
