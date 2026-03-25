import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const API = "https://leorder-api.onrender.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);

      if (res.data.success) {
        // 🔥 clear old session
        localStorage.clear();

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.location.href = "/dashboard";
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Login</h2>

        <input
          name="email"
          placeholder="Email"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={handleChange}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.linkText}>
          New user?{" "}
          <span onClick={() => (window.location.href = "/signup")}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)"
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 20,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)"
  },
  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 20
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "none"
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#fff",
    fontWeight: "bold"
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
    color: "#fff",
    cursor: "pointer"
  }
};