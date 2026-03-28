import { useEffect, useState } from "react";
import Fab from "../components/Fab";
import BASE_URL from "../api";

export default function Orders() {
  const token = localStorage.getItem("token");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCount(data.data?.length || 0);
      } catch (err) {
        console.log("Orders error", err);
      }
    };

    fetchOrders();
  }, []);

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

      <Fab onClick={() => alert("Create Order")} />
    </div>
  );
}