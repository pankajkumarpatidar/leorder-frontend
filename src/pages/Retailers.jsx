import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function Retailers() {
  const token = localStorage.getItem("token");

  const [retailers, setRetailers] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    email: "",
    mobile: "",
    gst_no: "",
    address: "",
    pincode: "",
  });

  // ===== FETCH (🔥 FIXED) =====
  const fetchRetailers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/retailers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // 🔥 SAFE FIX (IMPORTANT)
      const list = Array.isArray(data)
        ? data
        : data.data || [];

      console.log("Retailers:", list);

      setRetailers(list);

    } catch (err) {
      console.log("Retailer fetch error:", err);
      showToast("Error loading");
    }
  };

  useEffect(() => {
    if (token) fetchRetailers();
  }, [token]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.business_name || !form.mobile) {
      return showToast("Business & Mobile required");
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return showToast("Invalid mobile");
    }

    try {
      const url = editId
        ? `${BASE_URL}/retailers/${editId}`
        : `${BASE_URL}/retailers`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showToast(editId ? "Updated" : "Created");

        setShow(false);
        setEditId(null);

        setForm({
          business_name: "",
          email: "",
          mobile: "",
          gst_no: "",
          address: "",
          pincode: "",
        });

        fetchRetailers();
      } else {
        showToast(data.message);
      }
    } catch {
      showToast("Error");
    }
  };

  // ===== EDIT =====
  const handleEdit = (r) => {
    setForm({
      business_name: r.business_name,
      email: r.email || "",
      mobile: r.mobile,
      gst_no: r.gst_no || "",
      address: r.address || "",
      pincode: r.pincode || "",
    });

    setEditId(r.id);
    setShow(true);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete retailer?")) return;

    try {
      await fetch(`${BASE_URL}/retailers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Deleted");
      fetchRetailers();
    } catch {
      showToast("Delete error");
    }
  };

  // ===== FILTER (🔥 SAFE FIX) =====
  const filtered = retailers.filter((r) =>
    `${r.business_name || ""} ${r.mobile || ""} ${r.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Retailers</h3>
        <p>{filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search retailer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No retailers</p>
      ) : (
        filtered.map((r) => (
          <div key={r.id} className="userCard">

            <div style={{ maxWidth: "70%" }}>
              <h4>{r.business_name}</h4>

              <p style={{ fontSize: 12, color: "#666" }}>
                {r.email}
              </p>

              <p style={{ fontSize: 13 }}>{r.mobile}</p>

              {r.gst_no && (
                <p style={{ fontSize: 12 }}>GST: {r.gst_no}</p>
              )}

              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  wordBreak: "break-all",
                }}
              >
                {r.address}
              </p>

              <span className="roleTag">
                {r.pincode}
              </span>
            </div>

            <div className="actionBtns">

              <button
                onClick={() => handleEdit(r)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "12px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>

            </div>

          </div>
        ))
      )}

      {/* FAB */}
      <button className="fabBtn" onClick={() => setShow(true)}>
        +
      </button>

      {/* MODAL */}
      {show && (
        <div className="modal">
          <div className="modalBox">

            <h3>{editId ? "Edit Retailer" : "Add Retailer"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Business Name"
                value={form.business_name}
                onChange={(e) =>
                  setForm({ ...form, business_name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <input
                placeholder="GST No"
                value={form.gst_no}
                onChange={(e) =>
                  setForm({ ...form, gst_no: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value })
                }
              />

              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <button type="submit">
                {editId ? "Update" : "Create"}
              </button>
            </form>

            <button
              className="closeBtn"
              onClick={() => {
                setShow(false);
                setEditId(null);
              }}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}