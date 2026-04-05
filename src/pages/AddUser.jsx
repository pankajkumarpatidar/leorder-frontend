import { useState } from "react";
import BASE_URL from "../api";

export default function AddUser() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "salesman",
    mobile: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("Fill required fields");
    }

    const res = await fetch(`${BASE_URL}/auth/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ User Created");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "salesman",
        mobile: "",
      });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Add User</h3>
      </div>

      <div className="cardItem">
        <p>Name</p>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div className="cardItem">
        <p>Email</p>
        <input
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </div>

      <div className="cardItem">
        <p>Password</p>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
      </div>

      <div className="cardItem">
        <p>Role</p>
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="staff">Staff</option>
          <option value="salesman">Salesman</option>
        </select>
      </div>

      <div className="cardItem">
        <p>Mobile</p>
        <input
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />
      </div>

      <button className="cardItem" onClick={handleSubmit}>
        Create User
      </button>

    </div>
  );
}
