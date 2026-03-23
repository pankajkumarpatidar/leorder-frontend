import React, { useState, useMemo } from "react";

export default function PriceList() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState("All");

  // 🔥 Dummy 2000+ products
  const products = useMemo(() => {
    return Array.from({ length: 2000 }, (_, i) => ({
      id: i + 1,
      name: "Product " + (i + 1),
      brand: ["Amaron", "Exide", "Luminous"][i % 3],
      category: ["Battery", "Inverter", "Solar"][i % 3],
      price: Math.floor(Math.random() * 5000)
    }));
  }, []);

  // 🔍 FILTER LOGIC
  const filtered = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (brand === "All" || p.brand === brand) &&
        (category === "All" || p.category === category)
      );
    });
  }, [search, brand, category, products]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Price List 💰</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search product..."
        autoComplete="off"
        style={styles.search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 Filters */}
      <div style={styles.filters}>
        <select onChange={(e) => setBrand(e.target.value)} style={styles.select}>
          <option>All</option>
          <option>Amaron</option>
          <option>Exide</option>
          <option>Luminous</option>
        </select>

        <select onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option>All</option>
          <option>Battery</option>
          <option>Inverter</option>
          <option>Solar</option>
        </select>
      </div>

      {/* 📦 Product List */}
      <div style={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} style={styles.card}>
            <div>
              <strong>{item.name}</strong>
              <div style={styles.sub}>
                {item.brand} • {item.category}
              </div>
            </div>

            <div style={styles.price}>₹ {item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 10
  },

  select: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd"
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