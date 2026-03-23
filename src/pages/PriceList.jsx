import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function PriceList() {
  const API = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState(1); // 🔥 default brand

  // 🔥 FETCH PRICE LIST (YOUR API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API}/api/product/price-list/${brandId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setProducts(res.data);

      } catch (err) {
        console.error("PRICE LIST ERROR ❌", err);
      }
    };

    fetchData();
  }, [brandId]);

  // 🔍 SEARCH FILTER
  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Price List 💰</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search product..."
        autoComplete="off"
        style={styles.search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 BRAND FILTER */}
      <select
        style={styles.select}
        onChange={(e) => setBrandId(e.target.value)}
      >
        <option value={1}>Brand 1</option>
        <option value={2}>Brand 2</option>
        <option value={3}>Brand 3</option>
      </select>

      {/* 📦 LIST */}
      <div style={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} style={styles.card}>
            <div>
              <strong>{item.name}</strong>
              <div style={styles.sub}>
                PCS: {item.pcs_per_box}
              </div>
            </div>

            <div style={styles.price}>
              ₹ {item.dp_per_pcs}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// 🎨 STYLES
const styles = {
  container: {
    padding: 15,
    paddingBottom: 100
  },

  title: {
    marginBottom: 10
  },

  search: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    marginBottom: 10
  },

  select: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 10
  },

  list: {
    maxHeight: "70vh",
    overflowY: "auto"
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },

  sub: {
    fontSize: 12,
    color: "#666"
  },

  price: {
    fontWeight: "bold",
    color: "#2563eb"
  }
};