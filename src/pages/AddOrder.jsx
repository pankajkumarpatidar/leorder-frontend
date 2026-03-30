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

  const [showRetailer, setShowRetailer] = useState(false);
  const [showProductIndex, setShowProductIndex] = useState(null);

  const [searchRetailer, setSearchRetailer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotal(items.reduce((s, i) => s + i.total, 0));
  }, [items]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [rRes, pRes] = await Promise.all([
        fetch(`${BASE_URL}/retailers`, { headers }),
        fetch(`${BASE_URL}/products`, { headers }),
      ]);

      const rData = await rRes.json();
      const pData = await pRes.json();

      // 🔥 DEBUG (important)
      console.log("Retailers API:", rData);

      // 🔥 SAFE FIX
      const retailerList = Array.isArray(rData)
        ? rData
        : rData.data || [];

      const productList = Array.isArray(pData)
        ? pData
        : pData.data || [];

      setRetailers(retailerList);
      setProducts(productList);

      console.log("Final Retailers:", retailerList);

    } catch (err) {
      console.log("Fetch error", err);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        qty: 1,
        unit: "PCS",
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
    const conversion =
      item.unit === "BOX"
        ? product?.pcs_per_box || 1
        : 1;

    const price = product?.dp_per_pcs || 0;

    const final_qty = item.qty * conversion;
    let base = final_qty * price;

    let afterTrade = base - (base * item.trade_discount) / 100;
    let afterSpecial =
      afterTrade - (afterTrade * item.special_discount) / 100;
    let afterCash =
      afterSpecial - (afterSpecial * item.cash_discount) / 100;

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

    if (field === "product_id" || field === "unit") {
      updated[i][field] = value;
    } else {
      updated[i][field] = Number(value);
    }

    const product = products.find(
      (p) => p.id == updated[i].product_id
    );

    updated[i] = calculateItem(updated[i], product);
    setItems(updated);
  };

  const handleSelectProduct = (i, product) => {
    const updated = [...items];
    updated[i].product_id = product.id;
    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
    setShowProductIndex(null);
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
        items,
      }),
    });

    alert("✅ Order Created");
    setItems([]);
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Add Order</h3>
      </div>

      {/* RETAILER */}
      <div className="cardItem" onClick={() => setShowRetailer(true)}>
        <p>Retailer</p>
        <h4>
          {retailers.find(r => r.id == retailerId)?.name || "Select Retailer"}
        </h4>
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
            onChange={(e) => setCreditDays(e.target.value)}
          />
        )}
      </div>

      {/* ITEMS */}
      {items.map((item, i) => (
        <div key={i} className="cardItem">

          <div onClick={() => setShowProductIndex(i)}>
            <p>Product</p>
            <h4>
              {products.find(p => p.id == item.product_id)?.name || "Select Product"}
            </h4>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="number"
              value={item.qty}
              onChange={(e) =>
                handleChange(i, "qty", e.target.value)
              }
            />

            <select
              value={item.unit}
              onChange={(e) =>
                handleChange(i, "unit", e.target.value)
              }
            >
              <option value="PCS">PCS</option>
              <option value="BOX">BOX</option>
            </select>
          </div>

          <input value={item.price} readOnly />

          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="T%" onChange={(e) => handleChange(i, "trade_discount", e.target.value)} />
            <input placeholder="S%" onChange={(e) => handleChange(i, "special_discount", e.target.value)} />
            <input placeholder="C%" onChange={(e) => handleChange(i, "cash_discount", e.target.value)} />
          </div>

          <div className="highlightCard">
            <p>Final Qty: {item.final_qty}</p>
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

      {/* 🔍 RETAILER MODAL */}
      {showRetailer && (
        <div className="modal">
          <div className="modalBox">
            <input
              placeholder="Search Retailer"
              value={searchRetailer}
              onChange={(e) => setSearchRetailer(e.target.value)}
            />

            {retailers.length === 0 && (
              <p style={{ textAlign: "center" }}>No retailers found</p>
            )}

            {retailers
              .filter(r =>
                r.name?.toLowerCase().includes(searchRetailer.toLowerCase())
              )
              .map(r => (
                <div
                  key={r.id}
                  className="userCard"
                  onClick={() => {
                    setRetailerId(r.id);
                    setShowRetailer(false);
                  }}
                >
                  {r.name}
                </div>
              ))}

            <button className="closeBtn" onClick={() => setShowRetailer(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔍 PRODUCT MODAL */}
      {showProductIndex !== null && (
        <div className="modal">
          <div className="modalBox">

            <input
              placeholder="Search Product"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />

            {products
              .filter(p =>
                p.name?.toLowerCase().includes(searchProduct.toLowerCase())
              )
              .map(p => (
                <div
                  key={p.id}
                  className="userCard"
                  onClick={() => handleSelectProduct(showProductIndex, p)}
                >
                  {p.name}
                </div>
              ))}

            <button className="closeBtn" onClick={() => setShowProductIndex(null)}>
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}