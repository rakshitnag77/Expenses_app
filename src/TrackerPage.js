import React, { useState } from "react";

const TrackerPage = ({ expenses, setExpenses, accountBalance, setAccountBalance }) => {
  // State for the form inputs
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Debit");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");

  // New state for edit functionality
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "25px",
      fontSize: "28px",
      fontWeight: "600",
    },
    balance: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#34495e",
      marginBottom: "30px",
      backgroundColor: "#e8f0fe",
      padding: "15px",
      borderRadius: "10px",
      border: "1px solid #c8dcfc",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    fullWidth: {
      gridColumn: "1 / -1",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "16px",
      boxSizing: "border-box",
      transition: "border-color 0.3s, box-shadow 0.3s",
    },
    inputFocus: {
      borderColor: "#4267b2",
      boxShadow: "0 0 5px rgba(66, 103, 178, 0.3)",
    },
    budgetForm: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      gridColumn: "1 / -1",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#4267b2",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "background-color 0.3s",
      width: "100%",
    },
    buttonHover: {
      backgroundColor: "#33558f",
    },
    resetButton: {
      backgroundColor: "#e74c3c",
    },
    fileInputContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      transition: "background-color 0.3s",
    },
    hiddenFileInput: {
      display: "none",
    },
    fileText: {
      color: "#666",
      fontWeight: "500",
    },
    typeDisplay: {
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      backgroundColor: "#f0f0f0",
      textAlign: "center",
      fontWeight: "bold",
    },
    debit: {
      color: "#e74c3c",
    },
    credit: {
      color: "#27ae60",
    },
    editButton: {
      backgroundColor: "#f39c12",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.3s",
      marginLeft: "10px",
    },
    cancelButton: {
      backgroundColor: "#7f8c8d",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "background-color 0.3s",
      width: "100%",
    },
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if ( selectedCategory === "UPI Payment") {
      setType("Credit");
      setIsOtherCategory(false);
    } else if (selectedCategory === "Others") {
      setType("Debit");
      setIsOtherCategory(true);
    } else {
      setType("Debit");
      setIsOtherCategory(false);
    }
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const income = parseFloat(budgetInput);
    if (!isNaN(income)) {
      setAccountBalance((prev) => prev + income);
      setBudgetInput("");
    }
  };

  const handleAddOrUpdateExpense = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !category) return;

    if (editingTransactionId) {
      // Update existing transaction
      const updatedExpenses = expenses.map(exp => {
        if (exp.id === editingTransactionId) {
          const oldAmount = exp.amount;
          const oldType = exp.type;
          
          let newBalance = accountBalance;
          // Reverse the old transaction's effect
          if (oldType === "Debit") {
            newBalance += oldAmount;
          } else {
            newBalance -= oldAmount;
          }

          // Apply the new transaction's effect
          if (type === "Debit") {
            newBalance -= numericAmount;
          } else {
            newBalance += numericAmount;
          }
          setAccountBalance(newBalance);

          return {
            ...exp,
            category,
            description: description.trim(),
            amount: numericAmount,
            type,
            date,
            receipt: receipt ? URL.createObjectURL(receipt) : exp.receipt,
          };
        }
        return exp;
      });
      setExpenses(updatedExpenses);
      setEditingTransactionId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        category,
        description: description.trim(),
        amount: numericAmount,
        type,
        date,
        receipt: receipt ? URL.createObjectURL(receipt) : null,
      };

      setExpenses([...expenses, newTransaction]);
      if (type === "Debit") {
        setAccountBalance(accountBalance - numericAmount);
      } else {
        setAccountBalance(accountBalance + numericAmount);
      }
    }

    // Reset form fields
    setCategory("Groceries");
    setDescription("");
    setAmount("");
    setType("Debit");
    setDate("");
    setReceipt(null);
    setIsOtherCategory(false);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransactionId(transaction.id);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setDate(transaction.date);
    setReceipt(null); // Clear receipt for editing to avoid issues
    setIsOtherCategory(transaction.category === "Others");
  };

  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setCategory("Groceries");
    setDescription("");
    setAmount("");
    setType("Debit");
    setDate("");
    setReceipt(null);
    setIsOtherCategory(false);
  };

  const handleResetMonth = () => {
    setExpenses([]);
    setAccountBalance(0);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Sanghamitra Expense Tracker</h2>

      {/* Monthly Budget Input */}
      <form onSubmit={handleBudgetSubmit} style={styles.budgetForm}>
        <input
          type="number"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
          placeholder="Enter Monthly Budget"
          required
          style={{ ...styles.input, flex: 1 }}
        />
        <button type="submit" style={{ ...styles.button, width: "auto" }}>
          Set Budget
        </button>
      </form>

      <h3 style={styles.balance}>Current Balance: ₹{accountBalance.toFixed(2)}</h3>

      {/* Transaction Form */}
      <form onSubmit={handleAddOrUpdateExpense} style={styles.form}>
        <select
          value={category}
          onChange={handleCategoryChange}
          required
          style={{ ...styles.input, ...styles.fullWidth }}
        >
          <option value="" disabled>
            Choose Category
          </option>
          <option value="Groceries">Groceries</option>
          <option value="Electronic Devices">Electronic Devices</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Books">Books</option>
          <option value="Salaries">Salaries</option>
          <option value="Transport">Transport</option>
          <option value="UPI Payment">UPI Payment</option>
          <option value="Others">Others</option>
        </select>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Specific Description (Optional)"
          style={{ ...styles.input, ...styles.fullWidth }}
        />

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          required
          style={styles.input}
        />

        {isOtherCategory ? (
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.input}
          >
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>
        ) : (
          <div style={{ ...styles.typeDisplay, ...(type === "Credit" ? styles.credit : styles.debit) }}>
            {type}
          </div>
        )}

        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          required
          style={styles.input}
        />

        <div style={styles.fileInputContainer}>
          <label htmlFor="file-upload">
            <span style={styles.fileText}>
              {receipt ? receipt.name : "Choose File"}
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setReceipt(e.target.files[0])}
            style={styles.hiddenFileInput}
          />
        </div>

        <div style={styles.fullWidth}>
          <button type="submit" style={styles.button}>
            {editingTransactionId ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
        {editingTransactionId && (
          <div style={styles.fullWidth}>
            <button onClick={handleCancelEdit} style={styles.cancelButton}>
              Cancel Edit
            </button>
          </div>
        )}
      </form>

      {/* Reset Month Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleResetMonth}
          style={{ ...styles.button, ...styles.resetButton, display: "block", margin: "0 auto" }}
        >
          🔁 Reset Month
        </button>
      </div>

      {/* Display existing transactions with an Edit button */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#34495e", marginBottom: "15px" }}>Recent Transactions</h3>
        {expenses.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {expenses.map(exp => (
              <li key={exp.id} style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: "bold" }}>{exp.category}:</span> {exp.description} ({exp.date})
                  <span style={{ color: exp.type === "Credit" ? styles.credit.color : styles.debit.color, marginLeft: "10px", fontWeight: "bold" }}>
                    ₹{exp.amount.toFixed(2)} ({exp.type})
                  </span>
                </div>
                <button
                  onClick={() => handleEditTransaction(exp)}
                  style={styles.editButton}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#7f8c8d" }}>No transactions recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrackerPage;
