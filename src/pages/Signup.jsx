import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const API = import.meta.env.VITE_API_URL || "https://leorder-api.onrender.com";

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);

      if (res.data.success) {
        alert("✅ Account Created Successfully!");
        window.location.href = "/login";
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.error("ERROR 👉", err);
      alert(err.response?.data?.message || "Server Error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          style={styles.input}
          onChange={handleChange}
        />

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

        <button style={styles.button} onClick={handleSubmit}>
          Sign Up
        </button>

        <p style={styles.toggle}>
          Already have account?
          <span
            style={styles.link}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}


// 🎨 SAME STYLES
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "90%",
    maxWidth: 380,
    padding: 25,
    borderRadius: 20,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column"
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 20
  },

  input: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "none",
    outline: "none",
    fontSize: 14
  },

  button: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#fff",
    color: "#333",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10
  },

  toggle: {
    marginTop: 15,
    textAlign: "center",
    color: "#fff",
    fontSize: 14
  },

  link: {
    marginLeft: 5,
    fontWeight: "bold",
    cursor: "pointer",
    color: "#fff"
  }
};