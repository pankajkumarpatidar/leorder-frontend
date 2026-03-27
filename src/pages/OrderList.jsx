import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFileInvoice, FaRupeeSign } from "react-icons/fa";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [search, status, date, orders]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/order/list",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      alert("Error loading orders");
      setLoading(false);
    }
  };

  // 🔥 FILTER LOGIC
  const applyFilter = () => {
    let data = [...orders];

    if (search) {
      data = data.filter((o) =>
        o.id.toString().includes(search)
      );
    }

    if (status) {
      data = data.filter((o) => o.status === status);
    }

    if (date) {
      data = data.filter(
        (o) =>
          new Date(o.created_at).toLocaleDateString() ===
          new Date(date).toLocaleDateString()
      );
    }

    setFiltered(data);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Orders</h2>

      {/* 🔍 FILTER UI */}
      <div style={styles.filterBox}>
        <input
          placeholder="Search Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.input}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* 🔥 EMPTY */}
      {filtered.length === 0 && (
        <p style={styles.empty}>No matching orders 😕</p>
      )}

      {/* 🔥 LIST */}
      {filtered.map((o) => (
        <div key={o.id} style={styles.card}>
          <div style={styles.top}>
            <span>Order #{o.id}</span>

            <span
              style={{
                ...styles.status,
                background:
                  o.status === "approved"
                    ? "#00c853"
                    : o.status === "rejected"
                    ? "#ff4d4d"
                    : "#999",
              }}
            >
              {o.status}
            </span>
          </div>

          <p style={styles.amount}>
            <FaRupeeSign /> {o.total_amount}
          </p>

          <p style={styles.date}>
            {new Date(o.created_at).toLocaleDateString()}
          </p>

          <button
            style={styles.btn}
            onClick={() => navigate(`/order/${o.id}`)}
          >
            <FaFileInvoice /> View Invoice
          </button>
        </div>
      ))}
    </div>
  );
}

// 🎨 UI
const styles = {
  container: {
    padding: 15,
    padding: 70,
    paddingBottom: 80,
    minHeight: "100vh",
    background: "#f5f6fa",
  },
  title: {
    textAlign: "center",
  },
  filterBox: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  card: {
    background: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
  },
  status: {
    color: "#fff",
    padding: "3px 8px",
    borderRadius: 10,
    fontSize: 12,
  },
  amount: {
    marginTop: 5,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  btn: {
    marginTop: 8,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    background: "#000",
    color: "#fff",
    border: "none",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
  },
};

export default OrderList;