import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    type: "Debit",
    amount: "",
    receipt: null,
    date: ""
  });
  const [accountBalance, setAccountBalance] = useState(""); // Require user to input income
  const [carryOverAmount, setCarryOverAmount] = useState(""); // carry-over value
  const [showTransactions, setShowTransactions] = useState(false);

  const categories = [
    "Grocery",
    "Household Work",
    "Computer Repair",
    "D-Mart",
    "Utilities",
    "Others"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setNewExpense((prev) => ({ ...prev, receipt: files[0] }));
    } else {
      setNewExpense((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleIncomeInput = (e) => {
    const income = parseFloat(e.target.value);
    if (!isNaN(income)) {
      setAccountBalance(income);
      setCarryOverAmount(income);
    }
  };

  const addExpense = () => {
    const { category, amount, type, receipt, date } = newExpense;

    if (!accountBalance || accountBalance === "") {
      alert("Please set your income first.");
      return;
    }

    if (!category || !amount || !type || !receipt || !date) {
      alert("Please fill in all fields including uploading a receipt.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    const updatedBalance = type === "Debit"
      ? accountBalance - parsedAmount
      : accountBalance + parsedAmount;

    const expenseWithPreview = {
      ...newExpense,
      amount: parsedAmount,
      receiptURL: URL.createObjectURL(receipt)
    };

    setExpenses([...expenses, expenseWithPreview]);
    setAccountBalance(updatedBalance);
    setNewExpense({
      category: "",
      type: "Debit",
      amount: "",
      receipt: null,
      date: ""
    });
  };

  const getTotal = (type) => {
    return expenses
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalByCategory = () => {
    const totals = {};
    expenses.forEach((expense) => {
      const key = `${expense.category}-${expense.type}`;
      if (!totals[key]) totals[key] = 0;
      totals[key] += expense.amount;
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  const resetMonth = () => {
    if (!accountBalance || accountBalance === "") {
      alert("Please set your income first.");
      return;
    }
    setCarryOverAmount(accountBalance);
    setExpenses([]);
  };

  if (showTransactions) {
    return (
      <div className="container dark-background">
        <h1>All Transactions</h1>
        <button onClick={() => setShowTransactions(false)}>⬅ Back</button>
        <ul>
          {expenses.map((e, i) => (
            <li key={i}>
              <strong>{e.category}</strong> - ₹{e.amount} ({e.type})
              <div className="receipt">📅 Date: {e.date}</div>
              <div className="receipt">
                🧾 Receipt:<br />
                <img src={e.receiptURL} alt="Receipt" width="100" style={{ marginTop: "5px", borderRadius: "4px" }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="container dark-background">
      <h1>Sanghamitra Expense Tracker</h1>

      <div className="form">
        <input
          type="number"
          placeholder="Enter Monthly Income (₹)"
          value={accountBalance}
          onChange={handleIncomeInput}
        />

        <select name="category" value={newExpense.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="type" value={newExpense.type} onChange={handleChange}>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
        </select>

        <input
          name="amount"
          value={newExpense.amount}
          onChange={handleChange}
          placeholder="Amount (₹)"
          type="number"
        />

        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleChange}
        />

        <input
          name="receipt"
          onChange={handleChange}
          type="file"
          accept="image/*"
        />

        <button onClick={addExpense}>Add</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowTransactions(true)}>📄 View Transaction Details</button>
      </div>

      <h2 style={{ marginTop: "30px" }}>Totals by Category and Type</h2>
      <ul>
        {Object.entries(categoryTotals).map(([key, total]) => (
          <li key={key}>{key.replace("-", " ➝ ")}: ₹{total}</li>
        ))}
      </ul>

      <h2>Grand Totals</h2>
      <p>🟢 Total Credited: ₹{getTotal("Credit")}</p>
      <p>🔴 Total Debited: ₹{getTotal("Debit")}</p>
      <p>💼 Current Balance: ₹{accountBalance}</p>
      <p>📦 Carry-Over Amount: ₹{carryOverAmount}</p>
      <button onClick={resetMonth}>Reset Month & Carry Over</button>
    </div>
  );
};

export default App;
