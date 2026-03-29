import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Products() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 FAST LOOKUP
  const brandMap = {};
  brands.forEach((b) => {
    brandMap[b.id] = b.name;
  });

  // ===== FETCH =====
  const fetchData = async () => {
    try {
      const [prodRes, brandRes] = await Promise.all([
        fetch(`${BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/brands`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const p = await prodRes.json();
      const b = await brandRes.json();

      if (!p.success) throw new Error();
      if (!b.success) throw new Error();

      setProducts(p.data || []);
      setBrands(b.data || []);
    } catch (err) {
      console.log("Products error", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // ===== FILTER =====
  const filtered = products.filter((p) =>
    (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Products</h3>
        <p>Total: {filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CARD */}
      <div className="highlightCard">
        <p>Manage products</p>
        <h2>{filtered.length}</h2>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No products</p>
      ) : (
        filtered.map((p) => (
          <div key={p.id} className="userCard">

            {/* LEFT */}
            <div style={{ maxWidth: "70%" }}>
              <h4>{p.name}</h4>

              {/* BRAND */}
              <p style={{ fontSize: 12, color: "#666" }}>
                {brandMap[p.brand_id] || "-"}
              </p>

              {/* UNIT + BOX (SAFE) */}
              <p style={{ fontSize: 12 }}>
                {(p.unit || "-")} • {(p.pcs_per_box || 0)} pcs/box
              </p>

              {/* PRICE (SAFE) */}
              <p style={{ fontSize: 12, color: "#444" }}>
                DP: ₹{p.dp_per_pcs || 0} | MRP: ₹{p.mrp_per_pcs || 0}
              </p>
            </div>

          </div>
        ))
      )}

      {/* FAB */}
      <Fab onClick={() => alert("Add Product")} />
    </div>
  );
}