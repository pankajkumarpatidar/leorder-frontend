import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Users() {

  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get("/api/salesman/list"); // salesman + staff logic backend se
    setData(res.data.data);
  };

  // ➕ CREATE USER
  const createUser = async () => {
    await api.post("/api/auth/create-user", form);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "staff"
    });

    setShowForm(false);
    loadData();
  };

  // ❌ DELETE USER
  const deleteUser = async (id) => {
    await api.delete(`/api/salesman/delete/${id}`);
    loadData();
  };

  return (
    <Layout>
      <h2>Users</h2>

      <button onClick={() => setShowForm(true)}>
        + Add User
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card">
          <h3>Create User</h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <select
            value={form.role}
            onChange={(e)=>setForm({...form,role:e.target.value})}
          >
            <option value="staff">Staff</option>
            <option value="salesman">Salesman</option>
          </select>

          <button onClick={createUser}>Save</button>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="card">

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map(u=>(
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile || "-"}</td>
                <td>{u.role || "salesman"}</td>

                <td>
                  <button onClick={()=>deleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </Layout>
  );
}