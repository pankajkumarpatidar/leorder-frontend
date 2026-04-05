// ===== FILE: Products.jsx =====

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Products() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data.data || [];

      setProducts(list);

    } catch (err) {
      console.log("Product fetch error", err);
    }
  };

  // ================= FILTER =================
  const filtered = products.filter((p) =>
    `${p.name} ${p.brand_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Products</h3>
        <p>{filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="cardItem">
          <p>No products found</p>
        </div>
      )}

      {/* LIST */}
      {filtered.map((p) => (
        <div
          key={p.id}
          className="userCard"
          onClick={() => navigate(`/products/${p.id}`)}
        >
          <div style={{ maxWidth: "70%" }}>

            {/* NAME */}
            <h4>{p.name}</h4>

            {/* BRAND */}
            <p style={{ fontSize: 12, color: "#666" }}>
              {p.brand_name}
            </p>

            {/* UNIT */}
            <p style={{ fontSize: 13 }}>
              1 {p.unit_big} = {p.conversion} {p.unit_small}
            </p>

            {/* PRICE */}
            <p style={{ fontSize: 13 }}>
              MRP: ₹ {Math.round(p.mrp_small || 0)} | 
              DP: ₹ {Math.round(p.dp_small || 0)}
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div style={{ textAlign: "right" }}>
            <span className="roleTag">
              {p.unit_small}
            </span>
          </div>

        </div>
      ))}

      {/* FAB */}
      <button
        className="fabBtn"
        onClick={() => navigate("/add-product")}
      >
        +
      </button>

    </div>
  );
}
