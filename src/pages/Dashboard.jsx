import { useEffect, useState } from "react";
import axios from "axios";
import TopNav from "../components/TopNav";

<TopNav />
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { User, LogOut } from "lucide-react";

function Dashboard() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🔥 CALCULATIONS
  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  const pending = orders.filter((o) => o.status === "pending").length;
  const approved = orders.filter((o) => o.status === "approved").length;

  // 🔥 CHART DATA
  const chartData = orders.map((o) => ({
    name: `#${o.id}`,
    amount: o.total_amount,
  }));

  return (
    <div style={styles.container}>
      
      {/* 🔥 HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={{ fontSize: 12, color: "#666" }}>
            {user?.business_name || user?.email}
          </p>
        </div>

        <div style={styles.profileBox}>
          <User size={20} />
          <LogOut size={20} onClick={handleLogout} />
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <p>Total Orders</p>
          <h3>{totalOrders}</h3>
        </div>

        <div style={styles.card}>
          <p>Total Sales</p>
          <h3>₹ {totalSales}</h3>
        </div>

        <div style={styles.card}>
          <p>Pending</p>
          <h3>{pending}</h3>
        </div>

        <div style={styles.card}>
          <p>Approved</p>
          <h3>{approved}</h3>
        </div>
      </div>

      {/* 🔥 CHART */}
      <div style={styles.chartBox}>
        <h4>Sales Trend</h4>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="amount" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 🎨 PREMIUM UI
const styles = {
  container: {
    padding: 15,
    paddingBottom: 80,
    background: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "Poppins",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  profileBox: {
    display: "flex",
    gap: 10,
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 20,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    alignItems: "center",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  chartBox: {
    background: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
};

export default Dashboard;