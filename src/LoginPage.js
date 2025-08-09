import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "rakshitnag2@gmail.com" && password === "12345") {
      navigate("/admin-dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  const styles = {
    pageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f7f9",
    },
    loginCard: {
      backgroundColor: "#ffffff",
      padding: "40px 50px",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      maxWidth: "400px",
      width: "100%",
    },
    header: {
      fontSize: "28px",
      color: "#2c3e50",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      fontSize: "32px",
      marginRight: "10px",
      color: "#3498db",
    },
    inputGroup: {
      marginBottom: "25px",
    },
    input: {
      width: "100%",
      padding: "15px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #dcdfe6",
      boxSizing: "border-box",
      transition: "border-color 0.3s, box-shadow 0.3s",
    },
    inputFocus: {
      borderColor: "#3498db",
      boxShadow: "0 0 8px rgba(52, 152, 219, 0.2)",
    },
    button: {
      width: "100%",
      padding: "15px",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#2980b9",
    },
    error: {
      color: "#e74c3c",
      marginTop: "15px",
      marginBottom: "0",
    },
    signupText: {
      marginTop: "20px",
      color: "#7f8c8d",
    },
    signupLink: {
      color: "#3498db",
      textDecoration: "none",
      fontWeight: "bold",
      cursor: "pointer", // Add cursor pointer to indicate it's clickable
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        <h2 style={styles.header}>
          <span style={styles.icon}>&#128274;</span> Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
          >
            Login
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.signupText}>
          Already have an account? <span style={styles.signupLink}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;