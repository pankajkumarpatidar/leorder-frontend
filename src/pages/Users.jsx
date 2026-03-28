import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const token = localStorage.getItem("token");

  // FETCH USERS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      alert("Error fetching users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // CREATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("User created");
        setForm({ name: "", email: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Users 👥</h3>
          <p>Manage your staff</p>
        </div>
      </div>

      {/* ADD USER FORM */}
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="staff">Staff</option>
          <option value="salesman">Salesman</option>
        </select>

        <button type="submit">Add User</button>
      </form>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="cardItem blue">
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <p>{u.role}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}