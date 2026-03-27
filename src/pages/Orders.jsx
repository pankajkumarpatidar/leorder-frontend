import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Orders() {

  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({
    retailer_id: "",
    items: []
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const r = await api.get("/api/retailer/list");
    const p = await api.get("/api/product/list");
    const o = await api.get("/api/order/list");

    setRetailers(r.data.data);
    setProducts(p.data.data);
    setOrders(o.data.data);
  };

  // ➕ add item row
  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { product_id: "", qty: 1, unit: "pcs" }
      ]
    });
  };

  // ✏️ update item
  const updateItem = (index, key, value) => {
    const newItems = [...form.items];
    newItems[index][key] = value;
    setForm({ ...form, items: newItems });
  };

  // ❌ remove item
  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  // 💰 calculate total
  const getTotal = () => {
    let total = 0;

    form.items.forEach(item => {
      const product = products.find(p => p.id == item.product_id);
      if (!product) return;

      let price = product.dp_per_pcs;

      if (item.unit === "box") {
        price = product.dp_per_pcs * product.pcs_per_box;
      }

      total += item.qty * price;
    });

    return total;
  };

  // 🚀 create order
  const createOrder = async () => {
    await api.post("/api/order/create", form);

    setShowForm(false);
    setForm({ retailer_id: "", items: [] });

    loadData();
  };

  return (
    <Layout>
      <h2>Orders</h2>

      <button onClick={() => setShowForm(true)}>
        + Create Order
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card">

          <h3>New Order</h3>

          {/* retailer */}
          <select
            value={form.retailer_id}
            onChange={(e) =>
              setForm({ ...form, retailer_id: e.target.value })
            }
          >
            <option>Select Retailer</option>
            {retailers.map(r => (
              <option key={r.id} value={r.id}>
                {r.business_name}
              </option>
            ))}
          </select>

          {/* items */}
          {form.items.map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>

              <select
                onChange={(e) =>
                  updateItem(i, "product_id", e.target.value)
                }
              >
                <option>Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={item.qty}
                onChange={(e) =>
                  updateItem(i, "qty", e.target.value)
                }
              />

              <select
                onChange={(e) =>
                  updateItem(i, "unit", e.target.value)
                }
              >
                <option value="pcs">PCS</option>
                <option value="box">BOX</option>
              </select>

              <button onClick={() => removeItem(i)}>X</button>

            </div>
          ))}

          <button onClick={addItem}>+ Add Item</button>

          <h3>Total: ₹{getTotal()}</h3>

          <button onClick={createOrder}>Save Order</button>

        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Retailer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.retailer_name}</td>
                <td>₹{o.total}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}