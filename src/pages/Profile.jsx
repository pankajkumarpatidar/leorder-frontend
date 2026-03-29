import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "User",
    email: localStorage.getItem("email") || "user@email.com",
    role: localStorage.getItem("role") || "",
  });

  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.data?.length) {
          const current = data.data[0];

          setUser({
            name: current.name,
            email: current.email,
            role: current.role,
          });

          localStorage.setItem("name", current.name);
          localStorage.setItem("email", current.email);
          localStorage.setItem("role", current.role);
        }
      } catch (err) {
        console.log("Profile error", err);
      }
    };

    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    if (password.length < 4) {
      return alert("Password too short");
    }

    try {
      const res = await fetch(`${BASE_URL}/users/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password updated");
        setShowPass(false);
        setPassword("");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error updating password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <div className="appContainer">

        {/* HEADER FIX */}
        <div className="header">

          {/* MENU */}
          <div
            onClick={() => navigate("/menu")}
            style={{
              fontSize: 22,
              cursor: "pointer",
              marginRight: 10 // 🔥 spacing fix
            }}
          >
            ☰
          </div>

          <h3 style={{ flex: 1 }}>Profile</h3>

          <div style={{ width: 22 }}></div>
        </div>

        {/* PROFILE CARD */}
        <div className="profileCard">

          <div className="profileAvatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h2>{user.name}</h2>

          {/* 🔥 EMAIL FIX */}
          <p
            style={{
              wordBreak: "break-all",
              fontSize: "14px",
              marginTop: "4px"
            }}
          >
            {user.email}
          </p>

          {/* ROLE */}
          {user.role && (
            <span
              className="roleTag"
              style={{
                marginTop: "6px",
                display: "inline-block",
                background:
                  user.role === "admin"
                    ? "#fee2e2"
                    : user.role === "staff"
                    ? "#dbeafe"
                    : "#dcfce7",
              }}
            >
              {user.role}
            </span>
          )}

          <div className="profileActions">

            {!showPass ? (
              <button
                className="primaryBtn"
                onClick={() => setShowPass(true)}
              >
                Reset Password
              </button>
            ) : (
              <>
                <input
                  placeholder="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="primaryBtn"
                  onClick={handleResetPassword}
                >
                  Save Password
                </button>
              </>
            )}

            <button className="logoutBtn" onClick={handleLogout}>
              Logout
            </button>

          </div>

        </div>

      </div>

      <BottomNav />
    </>
  );
}