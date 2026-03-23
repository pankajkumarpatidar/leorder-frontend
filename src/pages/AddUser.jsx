import React, { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/api/auth/create-user`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("User Created ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add User</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />

      <select name="role" onChange={handleChange}>
        <option value="staff">Staff</option>
        <option value="salesman">Salesman</option>
      </select>

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}