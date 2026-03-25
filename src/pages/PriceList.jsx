import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PriceList() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // 🔥 LOAD BRANDS
  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API}/api/brand/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD PRODUCTS BY BRAND
  const fetchProducts = async (brandId) => {
    try {
      const res = await axios.get(
        `${API}/api/product/price-list/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) fetchProducts(selectedBrand);
  }, [selectedBrand]);

  // 🔍 FILTER PRODUCTS
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Price List</h2>

      {/* 🔍 BRAND SEARCH + SELECT */}
      <input
        placeholder="Search Brand..."
        style={styles.input}
        onChange={(e) => {
          const val = e.target.value.toLowerCase();
          const found = brands.find((b) =>
            b.name.toLowerCase().includes(val)
          );
          if (found) setSelectedBrand(found.id);
        }}
      />

      <select
        style={styles.input}
        onChange={(e) => setSelectedBrand(e.target.value)}
      >
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} {/* 🔥 NAME SHOW */}
          </option>
        ))}
      </select>

      {/* 🔍 PRODUCT SEARCH */}
      <input
        placeholder="Search Product..."
        style={styles.input}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 PRODUCT TABLE */}
      <div style={styles.table}>
        <div style={styles.headerRow}>
          <span>Name</span>
          <span>Category</span>
          <span>Unit</span>
          <span>MRP</span>
          <span>DP</span>
        </div>

        {filteredProducts.map((p) => (
          <div key={p.id} style={styles.row}>
            <span>{p.name}</span>
            <span>{p.category || "-"}</span>
            <span>{p.pcs_per_box} pcs</span>
            <span>₹{p.mrp_per_pcs}</span>
            <span>₹{p.dp_per_pcs}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


// 🎨 STYLES
const styles = {
  page: {
    height: "100vh",
    overflowY: "auto",
    padding: 15,
    paddingBottom: 100
  },

  title: {
    textAlign: "center",
    marginBottom: 15
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd"
  },

  table: {
    marginTop: 10
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    fontWeight: "bold",
    padding: 10,
    background: "#eee",
    borderRadius: 10
  },

  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: 10,
    borderBottom: "1px solid #eee",
    fontSize: 14
  }
};