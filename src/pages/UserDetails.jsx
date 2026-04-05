// ===== FILE: UserDetails.jsx =====

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchHistory();
  }, []);

  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUser(data.data);
  };

  const fetchHistory = async () => {
    const res = await fetch(`${BASE_URL}/audit-logs/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHistory(data.data || []);
  };

  const deleteUser = async () => {
    if (!window.confirm("Delete user?")) return;

    await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Deleted");
    navigate("/users");
  };

  if (!user) return <div className="appContainer">Loading...</div>;

  return (
    <div className="appContainer">

      {/* PROFILE */}
      <div className="profileCard">

        <div className="profileAvatar">
          {user.name?.charAt(0)}
        </div>

        <h2 style={{ fontWeight: "700" }}>{user.name}</h2>

        <p>{user.mobile}</p>
        <p>{user.email}</p>

        <span className="roleTag">{user.role}</span>

        {/* ACTIONS */}
        <div className="profileActions">

          <button className="primaryBtn">
            Update Profile
          </button>

          <button className="primaryBtn">
            Reset Password
          </button>

          <button className="logoutBtn" onClick={deleteUser}>
            Delete User
          </button>

        </div>

      </div>

      {/* HISTORY */}
      <div style={{ marginTop: 20 }}>
        <h4>Activity</h4>

        {history.map((h) => (
          <div key={h.id} className="cardItem">
            <p>{h.action}</p>
            <small>{new Date(h.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>

    </div>
  );
}
