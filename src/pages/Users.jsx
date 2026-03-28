import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/api"; // बाद में change करेंगे

export default function Users() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // ===== TOAST =====
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `${BASE_URL}/users/${editId}`
        : `${BASE_URL}/users`;

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
        showToast(editId ? "User updated" : "User created");
        setShow(false);
        setEditId(null);
        setForm({ name: "", email: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        showToast(data.message);
      }
    } catch {
      showToast("Error");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("User deleted");
      fetchUsers();
    } catch {
      showToast("Error deleting");
    }
  };

  // ===== EDIT =====
  const handleEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
    });
    setEditId(u.id);
    setShow(true);
  };

  // ===== FILTER =====
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Users 👥</h3>
        <p>{users.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: 20 }}>No users found</p>
      ) : (
        filtered.map((u) => (
          <div key={u.id} className="userCard">
            <div>
              <h4>{u.name}</h4>
              <p>{u.email}</p>
              <span className="roleTag">{u.role}</span>
            </div>

            <div className="actionBtns">
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
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
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
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="staff">Staff</option>
                <option value="salesman">Salesman</option>
              </select>

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