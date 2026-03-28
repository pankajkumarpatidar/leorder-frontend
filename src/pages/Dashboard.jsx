import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const name = localStorage.getItem("name") || "User";

  const [stats, setStats] = useState({
    leads: 0,
    orders: 0,
    retailers: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [leadsRes, ordersRes, retailersRes, productsRes] =
          await Promise.all([
            fetch(`${BASE_URL}/leads`, { headers }),
            fetch(`${BASE_URL}/orders`, { headers }),
            fetch(`${BASE_URL}/retailers`, { headers }),
            fetch(`${BASE_URL}/products`, { headers }),
          ]);

        // 🔥 SAFE JSON PARSE
        const leads = leadsRes.ok ? await leadsRes.json() : { data: [] };
        const orders = ordersRes.ok ? await ordersRes.json() : { data: [] };
        const retailers = retailersRes.ok ? await retailersRes.json() : { data: [] };
        const products = productsRes.ok ? await productsRes.json() : { data: [] };

        setStats({
          leads: leads.data?.length || 0,
          orders: orders.data?.length || 0,
          retailers: retailers.data?.length || 0,
          products: products.data?.length || 0,
        });

      } catch (err) {
        console.log("Dashboard error", err);
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Hello, {name} 👋</h3>
          <p>Welcome back</p>
        </div>

        <div
          className="avatar"
          onClick={() => navigate("/profile")}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="highlightCard">
        <p>Total Business</p>
        <h2>₹ 1,25,000</h2>
        <span>+12% this month</span>
      </div>

      {/* SMALL CARDS */}
      <div className="cards">

        <div className="cardItem purple">
          <p>Leads</p>
          <h3>{stats.leads}</h3>
        </div>

        <div className="cardItem green">
          <p>Orders</p>
          <h3>{stats.orders}</h3>
        </div>

        <div className="cardItem yellow">
          <p>Retailers</p>
          <h3>{stats.retailers}</h3>
        </div>

        <div className="cardItem blue">
          <p>Products</p>
          <h3>{stats.products}</h3>
        </div>

      </div>

    </div>
  );
}