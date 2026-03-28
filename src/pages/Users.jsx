import { useEffect, useState } from "react";
import Fab from "../components/Fab";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  const token = localStorage.getItem("token");

  // 🔥 FETCH
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    if (data.success) setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:5000/api/users/${editId}`
      : "http://localhost:5000/api/users";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      setToast(editId ? "User updated" : "User created");
      setShowForm(false);
      setEditId(null);
      setForm({ name: "", email: "", password: "", role: "staff" });
      fetchUsers();
    } else {
      setToast(data.message);
    }

    setTimeout(() => setToast(""), 2000);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    setToast("User deleted");
    fetchUsers();
    setTimeout(() => setToast(""), 2000);
  };

  // 🔥 EDIT
  const handleEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role
    });
    setEditId(u.id);
    setShowForm(true);
  };

  // 🔥 FILTER
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}
      <div className="header">
        <h3>Users</h3>
        <p>{filtered.length}</p>
      </div>

      {/* SEARCH */}
      <input
        className="searchBox"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {filtered.map((u) => (
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
      ))}

      {/* FAB */}
      <Fab onClick={() => {
        setShowForm(true);
        setEditId(null);
      }} />

      {/* MODAL */}
      {showForm && (
        <div className="modal">
          <div className="modalBox">
            <h3>{editId ? "Edit User" : "Add User"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e)=>setForm({...form, name:e.target.value})}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e)=>setForm({...form, email:e.target.value})}
              />
              {!editId && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e)=>setForm({...form, password:e.target.value})}
                />
              )}
              <select
                value={form.role}
                onChange={(e)=>setForm({...form, role:e.target.value})}
              >
                <option value="staff">Staff</option>
                <option value="salesman">Salesman</option>
              </select>

              <button>{editId ? "Update" : "Create"}</button>
            </form>

            <button className="closeBtn" onClick={()=>setShowForm(false)}>
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