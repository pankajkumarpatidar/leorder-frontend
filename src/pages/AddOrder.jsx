import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function AddOrder() {
  const token = localStorage.getItem("token");

  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);

  const [retailerId, setRetailerId] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // 🔥 NEW
  const [paymentType, setPaymentType] = useState("CASH");
  const [creditDays, setCreditDays] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [items]);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const [rRes, pRes] = await Promise.all([
      fetch(`${BASE_URL}/retailers`, { headers }),
      fetch(`${BASE_URL}/products`, { headers }),
    ]);

    const rData = await rRes.json();
    const pData = await pRes.json();

    setRetailers(rData.data || rData || []);
    setProducts(pData.data || pData || []);
  };

  // ➕ Add item
  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        qty: 1,
        unit: "PCS",
        final_qty: 1,
        conversion: 1,
        price: 0,
        trade_discount: 0,
        special_discount: 0,
        cash_discount: 0,
        net_rate: 0,
        total: 0,
      },
    ]);
  };

  // ❌ Remove item
  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setItems(updated);
  };

  // 🧠 Calculation (FULL LOGIC)
  const calculateItem = (item, product) => {
    const conversion = product?.conversion || 1;

    const final_qty = item.qty * conversion;

    let base = final_qty * item.price;

    let afterTrade = base - (base * item.trade_discount) / 100;
    let afterSpecial =
      afterTrade - (afterTrade * item.special_discount) / 100;
    let afterCash =
      afterSpecial - (afterSpecial * item.cash_discount) / 100;

    const net_rate =
      final_qty > 0 ? afterCash / final_qty : 0;

    return {
      ...item,
      conversion,
      final_qty,
      net_rate: Number(net_rate.toFixed(2)),
      total: Number(afterCash.toFixed(2)),
    };
  };

  // 🔄 Handle change
  const handleChange = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = Number(value);

    if (field === "product_id") {
      const p = products.find((x) => x.id == value);
      updated[i].price = p?.price || 0;
    }

    const product = products.find(
      (x) => x.id == updated[i].product_id
    );

    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
  };

  // 💰 Total
  const calculateTotal = () => {
    const sum = items.reduce((s, i) => s + i.total, 0);
    setTotal(sum);
  };

  // 📅 Due Date
  const getDueDate = () => {
    if (paymentType !== "CREDIT") return null;

    const d = new Date();
    d.setDate(d.getDate() + Number(creditDays));

    return d.toISOString();
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    if (!retailerId || items.length === 0) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      retailer_id: retailerId,
      distributor_id: 1, // dynamic later
      created_by: 1,
      total,
      status: "pending",
      payment_type: paymentType,
      credit_days: paymentType === "CREDIT" ? creditDays : 0,
      due_date: getDueDate(),
      items,
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Order Created");
      setItems([]);
      setRetailerId("");
      setPaymentType("CASH");
      setCreditDays(0);
    } else {
      alert(data.message || "Error");
    }
  };

  return (
    <div className="appContainer">

      <h2>🧾 Add Order (PRO)</h2>

      {/* Retailer */}
      <select
        value={retailerId}
        onChange={(e) => setRetailerId(e.target.value)}
      >
        <option value="">Select Retailer</option>
        {retailers.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {/* PAYMENT */}
      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
      >
        <option value="CASH">Cash</option>
        <option value="CREDIT">Credit</option>
      </select>

      {paymentType === "CREDIT" && (
        <input
          type="number"
          placeholder="Credit Days"
          value={creditDays}
          onChange={(e) => setCreditDays(e.target.value)}
        />
      )}

      {/* ITEMS */}
      {items.map((item, i) => (
        <div key={i} className="cardItem">

          <select
            value={item.product_id}
            onChange={(e) =>
              handleChange(i, "product_id", e.target.value)
            }
          >
            <option value="">Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={item.qty}
            onChange={(e) =>
              handleChange(i, "qty", e.target.value)
            }
            placeholder="Qty"
          />

          <input value={item.price} readOnly />

          <input
            type="number"
            placeholder="Trade %"
            value={item.trade_discount}
            onChange={(e) =>
              handleChange(i, "trade_discount", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Special %"
            value={item.special_discount}
            onChange={(e) =>
              handleChange(i, "special_discount", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Cash %"
            value={item.cash_discount}
            onChange={(e) =>
              handleChange(i, "cash_discount", e.target.value)
            }
          />

          <input value={item.final_qty} readOnly />
          <input value={item.net_rate} readOnly />
          <input value={item.total} readOnly />

          <button onClick={() => removeItem(i)}>❌</button>
        </div>
      ))}

      <button onClick={addItem}>➕ Add Item</button>

      <h3>Total: ₹ {total}</h3>

      <button onClick={handleSubmit}>Submit Order</button>

    </div>
  );
}