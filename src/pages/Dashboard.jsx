import { useEffect, useState } from "react";
import axios from "axios";

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🔥 DATA
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  const pending = orders.filter((o) => o.status === "pending").length;
  const approved = orders.filter((o) => o.status === "approved").length;

  const chartData = orders.map((o) => ({
    name: `#${o.id}`,
    amount: o.total_amount,
  }));

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* 🔥 HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Dashboard</h2>
            <p style={styles.subText}>
              {user?.business_name || user?.email}
            </p>
          </div>

          <div style={styles.profileBox}>
            <User size={18} />
            <LogOut size={18} onClick={handleLogout} />
          </div>
        </div>

        {/* 🔥 GRID */}
        <div style={styles.grid}>
          <Card title="Total Orders" value={totalOrders} />
          <Card title="Total Sales" value={`₹ ${totalSales}`} />
          <Card title="Pending" value={pending} />
          <Card title="Approved" value={approved} />
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
    </div>
  );
}

// 🔥 CARD
const Card = ({ title, value }) => (
  <div style={styles.card}>
    <p style={styles.cardTitle}>{title}</p>
    <h3>{value}</h3>
  </div>
);

// 🎨 STYLES
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
  },

  container: {
    padding: "70px 12px 90px", // 🔥 auto nav spacing
    maxWidth: 500,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    margin: 0,
  },

  subText: {
    fontSize: 12,
    color: "#666",
  },

  profileBox: {
    display: "flex",
    gap: 10,
    background: "#fff",
    padding: "6px 10px",
    borderRadius: 20,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    alignItems: "center",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 15,
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },

  chartBox: {
    background: "#fff",
    borderRadius: 18,
    padding: 15,
    marginTop: 15,
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },
};

export default Dashboard;