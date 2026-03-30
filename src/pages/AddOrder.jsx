import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function AddOrder() {
  const token = localStorage.getItem("token");

  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);

  const [retailerId, setRetailerId] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

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

    setRetailers(rData.data || []);
    setProducts(pData.data || []);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        qty: 1,
        final_qty: 1,
        price: 0,
        trade_discount: 0,
        special_discount: 0,
        cash_discount: 0,
        net_rate: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setItems(updated);
  };

  const calculateItem = (item, product) => {
    const conversion = product?.pcs_per_box || 1;
    const price = product?.dp_per_pcs || 0;

    const final_qty = item.qty * conversion;

    let base = final_qty * price;

    let afterTrade =
      base - (base * item.trade_discount) / 100;

    let afterSpecial =
      afterTrade - (afterTrade * item.special_discount) / 100;

    let afterCash =
      afterSpecial - (afterSpecial * item.cash_discount) / 100;

    const net_rate =
      final_qty > 0 ? afterCash / final_qty : 0;

    return {
      ...item,
      final_qty,
      price,
      net_rate: Number(net_rate.toFixed(2)),
      total: Number(afterCash.toFixed(2)),
    };
  };

  const handleChange = (i, field, value) => {
    const updated = [...items];

    if (field === "product_id") {
      updated[i][field] = value;
    } else {
      updated[i][field] = Number(value);
    }

    const product = products.find(
      (x) => x.id == updated[i].product_id
    );

    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
  };

  const calculateTotal = () => {
    const sum = items.reduce((s, i) => s + i.total, 0);
    setTotal(sum);
  };

  const getDueDate = () => {
    if (paymentType !== "CREDIT") return null;

    const d = new Date();
    d.setDate(d.getDate() + Number(creditDays));

    return d.toISOString();
  };

  const handleSubmit = async () => {
    if (!retailerId || items.length === 0) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      retailer_id: retailerId,
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

    if (res.ok) {
      alert("✅ Order Created");
      setItems([]);
      setRetailerId("");
      setPaymentType("CASH");
      setCreditDays(0);
    }
  };

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>🧾 Add Order</h3>
      </div>

      {/* RETAILER */}
      <div className="cardItem">
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
      </div>

      {/* PAYMENT */}
      <div className="cardItem">
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
      </div>

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

          <div>
            <small>Qty: {item.final_qty}</small>
            <small>Rate: ₹{item.net_rate}</small>
          </div>

          <h4>₹ {item.total}</h4>

          <button onClick={() => removeItem(i)}>❌</button>
        </div>
      ))}

      <button className="cardItem" onClick={addItem}>
        ➕ Add Product
      </button>

      {/* TOTAL */}
      <div className="highlightCard">
        <p>Total</p>
        <h2>₹ {total}</h2>
      </div>

      <button className="cardItem" onClick={handleSubmit}>
        Submit Order
      </button>

    </div>
  );
}