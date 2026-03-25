import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    business_name: "",
    person_name: "",
    email: "",
    password: "",
    gst_no: "",
    mobile: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);

      if (res.data.success) {
        alert("Account Created ✅");
        window.location.href = "/login";
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Register</h2>

        <input name="business_name" placeholder="Business Name" style={styles.input} onChange={handleChange} />
        <input name="person_name" placeholder="Owner Name" style={styles.input} onChange={handleChange} />
        <input name="email" placeholder="Email" style={styles.input} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" style={styles.input} onChange={handleChange} />
        <input name="gst_no" placeholder="GST No" style={styles.input} onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" style={styles.input} onChange={handleChange} />
        <textarea name="address" placeholder="Address" style={styles.input} onChange={handleChange} />

        <button style={styles.button} onClick={handleSignup}>
          Register
        </button>

        <p style={styles.linkText}>
          Already have account?{" "}
          <span onClick={() => (window.location.href = "/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
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
    marginBottom: 10,
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