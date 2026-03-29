import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Orders() {
  const token = localStorage.getItem("token");

  const [count, setCount] = useState(0);

  // 🔥 NEW STATES (hidden logic only)
  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);

  // ===== FETCH =====
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [orderRes, retailerRes, productRes] = await Promise.all([
          fetch(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/retailers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const o = await orderRes.json();
        const r = await retailerRes.json();
        const p = await productRes.json();

        setCount(o.data?.length || 0);
        setRetailers(r.data || []);
        setProducts(p.data || []);
      } catch (err) {
        console.log("Orders error", err);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  // ===== CREATE ORDER =====
  const handleCreateOrder = async () => {
    try {
      if (!retailers.length || !products.length) {
        return alert("No data available");
      }

      // 🔥 DEMO: first retailer + first product
      const retailer = retailers[0];
      const product = products[0];

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          retailer_id: retailer.id,
          items: [
            {
              product_id: product.id,
              qty: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Order created");
        setCount((prev) => prev + 1);
      } else {
        alert(data.message); // 🔥 yaha "lead not approved" aayega
      }
    } catch (err) {
      console.log(err);
      alert("Error creating order");
    }
  };

  return (
    <div>
      <div className="header">
        <h3>Orders</h3>
        <p>Total: {count}</p>
      </div>

      <div className="highlightCard">
        <p>Manage your orders</p>
        <h2>{count}</h2>
      </div>

      {/* 🔥 ONLY LOGIC CHANGE */}
      <Fab onClick={handleCreateOrder} />
    </div>
  );
}