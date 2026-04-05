// ===== FILE: Users.jsx =====

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import BottomNav from "../components/BottomNav";

export default function Users() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => setUsers(res.data || []));
  }, []);

  const filtered = users.filter(u =>
    `${u.name} ${u.email} ${u.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Users</h3>
        <p>{filtered.length}</p>
      </div>

      <input
        className="searchBox"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map(u => (
        <div
          key={u.id}
          className="userCard"
          onClick={() => navigate(`/users/${u.id}`)}
        >
          <div>
            <h4>{u.name}</h4>
            <p>{u.email}</p>
            <span className="roleTag">{u.role}</span>
          </div>
        </div>
      ))}

      <button
        className="fabBtn"
        onClick={() => navigate("/add-user")}
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}
