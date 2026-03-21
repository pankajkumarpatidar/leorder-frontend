import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const invoiceRef = useRef();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/order/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrder(res.data.order);
      setItems(res.data.items);
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Error loading order");
      setLoading(false);
    }
  };

  // 🔥 APPROVE / REJECT
  const updateStatus = async (status) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/status",
        {
          order_id: order.id,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Order ${status} ✅`);
      fetchOrder();

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating status ❌");
    }
  };

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 180, 0);
    pdf.save(`invoice-${id}.pdf`);
  };

  // 📱 WhatsApp
  const shareWhatsApp = () => {
    const text = `Order #${order.id}
Retailer: ${order.retailer_name}
Total: ₹${order.total_amount}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (!order) {
    return <p style={{ textAlign: "center" }}>Order not found</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Invoice</h2>

      {/* 🔥 INVOICE */}
      <div ref={invoiceRef} style={styles.card}>
        <div style={styles.header}>
          <h3>Leorder</h3>
          <span>#{order.id}</span>
        </div>

        <div style={styles.info}>
          <p><b>Retailer:</b> {order.retailer_name}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><b>Status:</b> {order.status}</p>
        </div>

        {/* ITEMS */}
        {items.map((item, i) => (
          <div key={i} style={styles.item}>
            <p style={styles.name}>{item.product_name}</p>

            <div style={styles.row}>
              <span>{item.qty} {item.unit}</span>
              <span>₹ {item.total}</span>
            </div>

            <div style={styles.sub}>
              Rate ₹{item.net_rate} |
              T:{item.trade_discount}% 
              S:{item.special_discount}% 
              C:{item.cash_discount}%
            </div>
          </div>
        ))}

        <h3 style={styles.total}>₹ {order.total_amount}</h3>
      </div>

      {/* 🔥 ADMIN ACTION */}
      {role === "admin" && order.status === "pending" && (
        <>
          <button
            style={styles.approve}
            onClick={() => updateStatus("approved")}
          >
            Approve
          </button>

          <button
            style={styles.reject}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </button>
        </>
      )}

      {/* ACTIONS */}
      <button style={styles.btn} onClick={downloadPDF}>
        Download PDF
      </button>

      <button style={styles.wa} onClick={shareWhatsApp}>
        Share WhatsApp
      </button>

      <button style={styles.back} onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

// 🎨 FINAL PREMIUM UI
const styles = {
  container: {
    padding: 15,
    paddingBottom: 80,
    minHeight: "100vh",
    background: "#f5f6fa",
    fontFamily: "Poppins",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 10,
  },
  item: {
    borderTop: "1px solid #eee",
    marginTop: 10,
    paddingTop: 8,
  },
  name: {
    fontWeight: "600",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  sub: {
    fontSize: 12,
    color: "#666",
  },
  total: {
    textAlign: "right",
    marginTop: 10,
  },
  approve: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#00c853",
    color: "#fff",
    marginTop: 10,
  },
  reject: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#ff4d4d",
    color: "#fff",
    marginTop: 8,
  },
  btn: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#000",
    color: "#fff",
    marginTop: 10,
  },
  wa: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#25D366",
    color: "#fff",
    marginTop: 8,
  },
  back: {
    width: "100%",
    padding: 12,
    borderRadius: 15,
    background: "#ddd",
    marginTop: 8,
  },
};

export default OrderDetail;