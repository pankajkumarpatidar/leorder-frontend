import React, { useState } from "react";
import axios from "axios";

export default function AddRetailer() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/api/retailer/create`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Retailer Added ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Retailer</h2>

      <input name="name" placeholder="Shop Name" onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}