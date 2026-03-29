import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function Users() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // 🔥 NEW (sidebar)
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    mobile: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      showToast("Error fetching users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      return showToast("Invalid mobile");
    }

    try {
      const url = editId
        ? `${BASE_URL}/users/${editId}`
        : `${BASE_URL}/auth/create-user`;

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
        showToast(editId ? "Updated" : "User created");
        setShow(false);
        setEditId(null);
        setForm({
          name: "",
          email: "",
          password: "",
          role: "staff",
          mobile: "",
        });
        fetchUsers();
      } else {
        showToast(data.message);
      }
    } catch {
      showToast("Error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Deleted");
      fetchUsers();
    } catch {
      showToast("Delete error");
    }
  };

  const handleEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      mobile: u.mobile || "",
    });
    setEditId(u.id);
    setShow(true);
  };

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* 🔥 SIDE MENU */}
      {menuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 1500,
            }}
            onClick={() => setMenuOpen(false)}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "250px",
              height: "100%",
              background: "white",
              padding: "20px",
              zIndex: 2000,
              boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Menu</h3>

            <p style={{ marginTop: 20, cursor: "pointer" }}>Dashboard</p>
            <p style={{ marginTop: 10, cursor: "pointer" }}>Leads</p>
            <p style={{ marginTop: 10, cursor: "pointer" }}>Orders</p>
            <p style={{ marginTop: 10, cursor: "pointer" }}>Products</p>
            <p style={{ marginTop: 10, cursor: "pointer" }}>Users</p>
          </div>
        </>
      )}

      {/* HEADER */}
      <div className="header">

        {/* 🔥 MENU BUTTON */}
        <div
          onClick={() => setMenuOpen(true)}
          style={{
            fontSize: "22px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          ☰
        </div>

        <h3 style={{ flex: 1 }}>Users 👥</h3>
        <p>{users.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search name, email, mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No users</p>
      ) : (
        filtered.map((u) => (
          <div key={u.id} className="userCard">

            <div style={{ maxWidth: "70%" }}>
              <h4>{u.name}</h4>

              <p style={{
                fontSize: "12px",
                color: "#666",
                wordBreak: "break-all"
              }}>
                {u.email}
              </p>

              <p style={{ fontSize: "13px" }}>{u.mobile}</p>

              <span className="roleTag">
                {u.role}
              </span>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}>
              <button onClick={() => handleEdit(u)}>Edit</button>
              <button onClick={() => handleDelete(u.id)}>Delete</button>
            </div>

          </div>
        ))
      )}

      {/* FAB */}
      <button className="fabBtn" onClick={() => setShow(true)}>+</button>

      {/* MODAL */}
      {show && (
        <div className="modal">
          <div className="modalBox">

            <h3>{editId ? "Edit User" : "Add User"}</h3>

            <form onSubmit={handleSubmit}>
              <input placeholder="Name" value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}/>

              <input placeholder="Email" value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}/>

              <input type="password" placeholder="Password"
                value={form.password}
                onChange={(e)=>setForm({...form,password:e.target.value})}/>

              <input placeholder="Mobile" value={form.mobile}
                onChange={(e)=>setForm({...form,mobile:e.target.value})}/>

              <select value={form.role}
                onChange={(e)=>setForm({...form,role:e.target.value})}>
                <option value="staff">Staff</option>
                <option value="salesman">Salesman</option>
              </select>

              <button type="submit">
                {editId ? "Update" : "Create"}
              </button>
            </form>

            <button className="closeBtn"
              onClick={()=>{setShow(false);setEditId(null);}}>
              Close
            </button>

          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}