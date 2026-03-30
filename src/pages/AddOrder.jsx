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
    setTotal(items.reduce((s, i) => s + i.total, 0));
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

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        qty: 1,
        final_qty: 0,
        price: 0,
        trade_discount: 0,
        special_discount: 0,
        cash_discount: 0,
        net_rate: 0,
        total: 0,
      },
    ]);
  };

  const calculateItem = (item, product) => {
    const conversion = product?.pcs_per_box || 1;
    const price = product?.dp_per_pcs || 0;

    const final_qty = item.qty * conversion;
    let base = final_qty * price;

    let afterTrade = base - (base * item.trade_discount) / 100;
    let afterSpecial = afterTrade - (afterTrade * item.special_discount) / 100;
    let afterCash = afterSpecial - (afterSpecial * item.cash_discount) / 100;

    return {
      ...item,
      final_qty,
      price,
      net_rate: final_qty ? afterCash / final_qty : 0,
      total: afterCash,
    };
  };

  const handleChange = (i, field, value) => {
    const updated = [...items];

    updated[i][field] =
      field === "product_id" ? value : Number(value);

    const product = products.find(
      (p) => p.id == updated[i].product_id
    );

    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
  };

  const getDueDate = () => {
    if (paymentType !== "CREDIT") return null;
    const d = new Date();
    d.setDate(d.getDate() + Number(creditDays));
    return d.toISOString();
  };

  const handleSubmit = async () => {
    if (!retailerId || !items.length) {
      return alert("Fill all fields");
    }

    await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        retailer_id: retailerId,
        payment_type: paymentType,
        credit_days: creditDays,
        due_date: getDueDate(),
        items,
      }),
    });

    alert("Order Created");
    setItems([]);
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>🧾 Add Order</h3>
      </div>

      <div className="cardItem">
        <select onChange={(e) => setRetailerId(e.target.value)}>
          <option>Select Retailer</option>
          {retailers.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="cardItem">
        <select onChange={(e) => setPaymentType(e.target.value)}>
          <option value="CASH">Cash</option>
          <option value="CREDIT">Credit</option>
        </select>

        {paymentType === "CREDIT" && (
          <input
            type="number"
            placeholder="Days"
            onChange={(e) => setCreditDays(e.target.value)}
          />
        )}
      </div>

      {items.map((item, i) => (
        <div key={i} className="cardItem">

          <select
            onChange={(e) =>
              handleChange(i, "product_id", e.target.value)
            }
          >
            <option>Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qty"
            onChange={(e) =>
              handleChange(i, "qty", e.target.value)
            }
          />

          <input value={item.price} readOnly />

          <div className="row">
            <input
              placeholder="T%"
              onChange={(e) =>
                handleChange(i, "trade_discount", e.target.value)
              }
            />
            <input
              placeholder="S%"
              onChange={(e) =>
                handleChange(i, "special_discount", e.target.value)
              }
            />
            <input
              placeholder="C%"
              onChange={(e) =>
                handleChange(i, "cash_discount", e.target.value)
              }
            />
          </div>

          <div className="highlightCard">
            <p>Qty: {item.final_qty}</p>
            <p>Rate: ₹{item.net_rate?.toFixed(2)}</p>
            <h3>₹ {item.total?.toFixed(0)}</h3>
          </div>

        </div>
      ))}

      <button className="cardItem" onClick={addItem}>
        ➕ Add Product
      </button>

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