import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddLead() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile: "",
    brand_id: "",
  });

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API = import.meta.env.VITE_API_URL;

  // 🔥 ROLE CHECK (only salesman)
  useEffect(() => {
    if (user.role !== "salesman") {
      alert("Only Salesman can create leads");
      navigate("/dashboard");
    }
  }, []);

  // 🔥 FETCH BRANDS
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API}/api/brand/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBrands(res.data.data || res.data);
    } catch (err) {
      console.log("Brand fetch error", err);
    }
  };

  // 🔥 INPUT HANDLE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!form.mobile || !form.brand_id) {
      alert("Mobile & Brand required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/lead/create`,
        {
          mobile: form.mobile,
          brand_id: Number(form.brand_id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      alert("Lead Created ✅");
      navigate("/leads");

    } catch (err) {
      console.log("Create error", err);
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Lead</h2>

      <div style={styles.form}>

        {/* 🔥 MOBILE */}
        <input
          name="mobile"
          placeholder="Retailer Mobile"
          value={form.mobile}
          onChange={handleChange}
          style={styles.input}
        />

        {/* 🔥 BRAND SELECT */}
        <select
          name="brand_id"
          value={form.brand_id}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* 🔥 BUTTON */}
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Lead"}
        </button>

      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "70px 15px 90px",
    maxWidth: 500,
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: 15,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  input: {
    padding: 12,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    fontSize: 14,
  },

  button: {
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontWeight: "bold",
  },
};