import { useState } from "react";
import BASE_URL from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    business_name: "",
    person_name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ auto login
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);

        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="authContainer">
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>

        <input
          placeholder="Business Name"
          value={form.business_name}
          onChange={(e) =>
            setForm({ ...form, business_name: e.target.value })
          }
        />

        <input
          placeholder="Your Name"
          value={form.person_name}
          onChange={(e) =>
            setForm({ ...form, person_name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

      </form>
    </div>
  );
}