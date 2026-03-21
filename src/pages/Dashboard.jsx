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

function Dashboard() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/order/list",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrders(res.data);
  };

  // 🔥 CALCULATIONS
  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.total_amount),
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
      <h2 style={styles.title}>Dashboard</h2>

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
  title: {
    textAlign: "center",
    marginBottom: 15,
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