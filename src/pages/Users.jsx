import { useEffect, useState } from "react";
import Fab from "../components/Fab";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  const token = localStorage.getItem("token");

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 CREATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        setShowForm(false);
        setForm({ name: "", email: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    fetchUsers();
  };

  return (
    <div>

      {/* HEADER */}
      <div className="header">
        <h3>Users</h3>
        <p>Total: {users.length}</p>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 16 }}>
        {users.map((u) => (
          <div key={u.id} className="userCard">
            <div>
              <h4>{u.name}</h4>
              <p>{u.email}</p>
              <span className="roleTag">{u.role}</span>
            </div>

            <button
              className="deleteBtn"
              onClick={() => handleDelete(u.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* FAB */}
      <Fab onClick={() => setShowForm(true)} />

      {/* MODAL */}
      {showForm && (
        <div className="modal">
          <div className="modalBox">
            <h3>Add User</h3>

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
                placeholder="Password"
                type="password"
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

              <button>Create</button>
            </form>

            <button
              className="closeBtn"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}