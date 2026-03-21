import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

function OrderCreate() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [retailerId, setRetailerId] = useState(null);

  const [items, setItems] = useState([
    {
      product_id: null,
      qty: "",
      unit: "pcs",
      trade_discount: 0,
      special_discount: 0,
      cash_discount: 0,
      total: 0,
    },
  ]);

  useEffect(() => {
    fetchProducts();
    fetchRetailers();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/product/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  const fetchRetailers = async () => {
    const res = await axios.get("http://localhost:5000/api/retailer/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRetailers(res.data);
  };

  const retailerOptions = retailers.map((r) => ({
    value: r.id,
    label: r.firm_name,
  }));

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const calculate = (item) => {
    const product = products.find((p) => p.id == item.product_id);
    if (!product) return item;

    let base =
      item.unit === "box"
        ? product.dp_per_pcs * product.pcs_per_box
        : product.dp_per_pcs;

    let net = base;
    net -= (net * item.trade_discount) / 100;
    net -= (net * item.special_discount) / 100;
    net -= (net * item.cash_discount) / 100;

    return { ...item, total: net * (item.qty || 0) };
  };

  const handleChange = (index, field, value) => {
    let newItems = [...items];

    newItems[index][field] =
      field === "product_id"
        ? value
        : field.includes("discount") || field === "qty"
        ? Number(value)
        : value;

    newItems[index] = calculate(newItems[index]);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: null,
        qty: "",
        unit: "pcs",
        trade_discount: 0,
        special_discount: 0,
        cash_discount: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const grandTotal = items.reduce((sum, i) => sum + (i.total || 0), 0);

  const handleSubmit = async () => {
    if (!retailerId) return alert("Select retailer");

    await axios.post(
      "http://localhost:5000/api/order/create",
      {
        retailer_id: retailerId,
        brand_id: 1,
        salesman_id: 1,
        items: items.map((i) => ({
          product_id: i.product_id,
          qty: i.qty,
          unit: i.unit,
          trade_discount: i.trade_discount,
          special_discount: i.special_discount,
          cash_discount: i.cash_discount,
        })),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Order Created 🎉");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Create Order</div>

      <Select
        options={retailerOptions}
        placeholder="Search Retailer..."
        onChange={(e) => setRetailerId(e.value)}
      />

      {items.map((item, index) => (
        <div key={index} style={styles.card}>
          <Select
            options={productOptions}
            placeholder="Search Product..."
            onChange={(e) =>
              handleChange(index, "product_id", e.value)
            }
          />

          <div style={styles.row}>
            <input
              placeholder="Qty"
              style={styles.input}
              onChange={(e) =>
                handleChange(index, "qty", e.target.value)
              }
            />

            <select
              style={styles.input}
              onChange={(e) =>
                handleChange(index, "unit", e.target.value)
              }
            >
              <option value="pcs">PCS</option>
              <option value="box">BOX</option>
            </select>
          </div>

          <div style={styles.row}>
            <input placeholder="T%" style={styles.small}
              onChange={(e) => handleChange(index, "trade_discount", e.target.value)} />
            <input placeholder="S%" style={styles.small}
              onChange={(e) => handleChange(index, "special_discount", e.target.value)} />
            <input placeholder="C%" style={styles.small}
              onChange={(e) => handleChange(index, "cash_discount", e.target.value)} />
          </div>

          <p style={styles.total}>₹ {item.total}</p>

          <button style={styles.remove} onClick={() => removeItem(index)}>
            Remove
          </button>
        </div>
      ))}

      <button style={styles.add} onClick={addItem}>+ Add Item</button>

      <h3 style={styles.grand}>₹ {grandTotal}</h3>

      <button style={styles.submit} onClick={handleSubmit}>
        Submit Order
      </button>
    </div>
  );
}

// 🎨 PREMIUM WHITE + GLASS
const styles = {
  container: {
    padding: 15,
    paddingBottom: 80,
    background: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "Poppins",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    backdropFilter: "blur(10px)",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 12,
    marginTop: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  row: {
    display: "flex",
    gap: 6,
    marginTop: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #eee",
  },
  small: {
    width: "33%",
    padding: 8,
    borderRadius: 10,
    border: "1px solid #eee",
  },
  total: {
    marginTop: 6,
    fontWeight: "bold",
  },
  remove: {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: 6,
    borderRadius: 6,
    marginTop: 5,
  },
  add: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#111",
    color: "#fff",
    marginTop: 10,
  },
  grand: {
    textAlign: "center",
    marginTop: 10,
  },
  submit: {
    width: "100%",
    padding: 14,
    borderRadius: 20,
    background: "#000",
    color: "#fff",
    marginTop: 10,
  },
};

export default OrderCreate;