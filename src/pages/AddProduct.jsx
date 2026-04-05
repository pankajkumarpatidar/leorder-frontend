// ===== FILE: AddProduct.jsx =====

import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function AddProduct() {
  const token = localStorage.getItem("token");

  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    unit_small: "PCS",
    unit_big: "BOX",
    conversion: 1,
    mrp_small: "",
    dp_small: "",
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${BASE_URL}/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBrands(data.data || []);
    } catch (e) {
      showToast("Brand load error");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.brand_id) {
      return showToast("Fill required fields");
    }

    if (Number(form.conversion) <= 0) {
      return showToast("Invalid conversion");
    }

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          conversion: Number(form.conversion),
          mrp_small: Number(form.mrp_small || 0),
          dp_small: Number(form.dp_small || 0),
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("✅ Product Created");

        setForm({
          name: "",
          brand_id: "",
          unit_small: "PCS",
          unit_big: "BOX",
          conversion: 1,
          mrp_small: "",
          dp_small: "",
        });
      } else {
        showToast(data.message);
      }

    } catch {
      showToast("Error");
    }
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Add Product</h3>
      </div>

      <form onSubmit={handleSubmit} className="cardItem">

        {/* NAME */}
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* BRAND */}
        <select
          value={form.brand_id}
          onChange={(e) =>
            setForm({ ...form, brand_id: e.target.value })
          }
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* UNITS */}
        <div className="row">

          <select
            value={form.unit_small}
            onChange={(e) =>
              setForm({ ...form, unit_small: e.target.value })
            }
          >
            <option value="PCS">PCS</option>
            <option value="GM">GM</option>
            <option value="ML">ML</option>
          </select>

          <select
            value={form.unit_big}
            onChange={(e) =>
              setForm({ ...form, unit_big: e.target.value })
            }
          >
            <option value="BOX">BOX</option>
            <option value="BUNDLE">BUNDLE</option>
            <option value="KG">KG</option>
            <option value="LTR">LTR</option>
          </select>

        </div>

        {/* CONVERSION */}
        <input
          type="number"
          placeholder="1 Big Unit = ? Small Units"
          value={form.conversion}
          onChange={(e) =>
            setForm({ ...form, conversion: e.target.value })
          }
        />

        {/* PRICE */}
        <div className="row">

          <input
            type="number"
            placeholder="MRP (Small Unit)"
            value={form.mrp_small}
            onChange={(e) =>
              setForm({ ...form, mrp_small: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="DP (Small Unit)"
            value={form.dp_small}
            onChange={(e) =>
              setForm({ ...form, dp_small: e.target.value })
            }
          />

        </div>

        {/* PREVIEW */}
        <div className="highlightCard">
          <p>Preview</p>
          <p>
            1 {form.unit_big} = {form.conversion} {form.unit_small}
          </p>
          <p>MRP: ₹ {form.mrp_small || 0}</p>
          <p>DP: ₹ {form.dp_small || 0}</p>
        </div>

        <button type="submit">
          Create Product
        </button>

      </form>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}
