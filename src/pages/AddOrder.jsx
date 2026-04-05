// ===== FILE: AddOrder.jsx =====

import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function AddOrder() {
  const token = localStorage.getItem("token");

  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);

  const [retailerId, setRetailerId] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

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

  // ================= ADD ITEM =================
  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        qty: 1,
        unit: "",
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

  // ================= CALCULATION =================
  const calculateItem = (item, product) => {
    if (!product) return item;

    const isBig = item.unit === product.unit_big;

    const conversion = isBig
      ? Number(product.conversion || 1)
      : 1;

    const price = Number(product.dp_small || 0);

    const final_qty = Number(item.qty || 0) * conversion;

    let base = final_qty * price;

    let afterTrade =
      base - (base * (item.trade_discount || 0)) / 100;

    let afterSpecial =
      afterTrade - (afterTrade * (item.special_discount || 0)) / 100;

    let afterCash =
      afterSpecial - (afterSpecial * (item.cash_discount || 0)) / 100;

    return {
      ...item,
      final_qty,
      price,
      net_rate: final_qty ? afterCash / final_qty : 0,
      total: afterCash,
    };
  };

  // ================= CHANGE =================
  const handleChange = (i, field, value) => {
    const updated = [...items];

    updated[i][field] =
      field === "unit" ? value : Number(value);

    const product = products.find(
      (p) => p.id == updated[i].product_id
    );

    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
  };

  // ================= SELECT PRODUCT =================
  const handleSelectProduct = (i, product) => {
    const updated = [...items];

    updated[i].product_id = product.id;

    // 🔥 AUTO SET UNIT SMALL
    updated[i].unit = product.unit_small;

    updated[i] = calculateItem(updated[i], product);

    setItems(updated);
    setShowProductIndex(null);
  };

  // ================= SUBMIT =================
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
          {retailers.find(r => r.id == retailerId)?.business_name || "Select Retailer"}
        </h4>
      </div>

      {/* ITEMS */}
      {items.map((item, i) => {
        const product = products.find(p => p.id == item.product_id);

        return (
          <div key={i} className="cardItem">

            {/* PRODUCT */}
            <div onClick={() => setShowProductIndex(i)}>
              <p>Product</p>
              <h4>
                {product?.name || "Select Product"}
              </h4>
            </div>

            {/* QTY + UNIT */}
            <div className="row">

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
                <option value={product?.unit_small}>
                  {product?.unit_small}
                </option>

                <option value={product?.unit_big}>
                  {product?.unit_big}
                </option>
              </select>

            </div>

            {/* PRICE */}
            <input value={item.price} readOnly />

            {/* DISCOUNTS */}
            <div className="row">
              <input placeholder="T%" onChange={(e) => handleChange(i, "trade_discount", e.target.value)} />
              <input placeholder="S%" onChange={(e) => handleChange(i, "special_discount", e.target.value)} />
              <input placeholder="C%" onChange={(e) => handleChange(i, "cash_discount", e.target.value)} />
            </div>

            {/* RESULT */}
            <div className="highlightCard">
              <p>
                {item.qty} {item.unit} → {item.final_qty} {product?.unit_small}
              </p>
              <p>Rate: ₹ {item.net_rate?.toFixed(2)}</p>
              <h3>₹ {Math.round(item.total)}</h3>
            </div>

          </div>
        );
      })}

      <button className="cardItem addBtn" onClick={addItem}>
        ➕ Add Product
      </button>

      <div className="highlightCard">
        <p>Total</p>
        <h2>₹ {Math.round(total).toLocaleString()}</h2>
      </div>

      <button className="cardItem" onClick={handleSubmit}>
        Submit Order
      </button>

      {/* RETAILER MODAL */}
      {showRetailer && (
        <div className="modal">
          <div className="modalBox">

            <input
              className="searchBox"
              placeholder="Search Retailer..."
              value={searchRetailer}
              onChange={(e) => setSearchRetailer(e.target.value)}
            />

            {retailers
              .filter(r =>
                r.business_name?.toLowerCase().includes(searchRetailer.toLowerCase())
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
                  {r.business_name}
                </div>
              ))}

          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {showProductIndex !== null && (
        <div className="modal">
          <div className="modalBox">

            <input
              className="searchBox"
              placeholder="Search Product..."
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

          </div>
        </div>
      )}

    </div>
  );
}
