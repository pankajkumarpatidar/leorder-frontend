import { useState } from "react";
import BASE_URL from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
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
        // ✅ SAVE TOKEN + USER
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);

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
      <h2>Login</h2>

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

        <button disabled={loading}>
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
}