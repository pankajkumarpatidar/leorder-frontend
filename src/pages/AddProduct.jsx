import React, { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    pcs_per_box: "",
    dp_per_pcs: "",
    mrp_per_pcs: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/api/product/create`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Product Added ✅");
      setForm({ name: "", brand_id: "", pcs_per_box: "", dp_per_pcs: "", mrp_per_pcs: "" });

    } catch (err) {
      console.error(err);
      alert("Error adding product ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Product</h2>

      <input name="name" placeholder="Product Name" onChange={handleChange} />
      <input name="brand_id" placeholder="Brand ID" onChange={handleChange} />
      <input name="pcs_per_box" placeholder="PCS per box" onChange={handleChange} />
      <input name="dp_per_pcs" placeholder="DP price" onChange={handleChange} />
      <input name="mrp_per_pcs" placeholder="MRP price" onChange={handleChange} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20
  }
};