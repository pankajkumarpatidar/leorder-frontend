import { useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agree) {
      return alert("Please accept terms");
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // 🔥 CLEAR OLD USER
        localStorage.clear();

        // ✅ SAVE FULL USER
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role);

        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="authContainer">

      {/* 🔥 LOGO */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700" }}>
          LEORDER 🚀
        </h1>
        <p style={{ color: "#777", fontSize: "13px" }}>
          Smart Business Manager
        </p>
      </div>

      <h2 style={{ marginTop: "20px" }}>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 AGREEMENT */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span style={{ fontSize: "12px" }}>
            I agree to Terms & Privacy Policy
          </span>
        </div>

        <button disabled={loading}>
          {loading ? "Logging..." : "Login"}
        </button>

      </form>

      {/* 🔥 SIGNUP LINK */}
      <p style={{ marginTop: 14, fontSize: "13px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "#2563eb", fontWeight: "500" }}>
          Signup
        </Link>
      </p>

    </div>
  );
}