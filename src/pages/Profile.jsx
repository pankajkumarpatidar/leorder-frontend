import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "User",
    email: localStorage.getItem("email") || "user@email.com",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // 👉 current logged-in user find
        if (data.data?.length) {
          const current = data.data[0]; // (simple logic for now)

          setUser({
            name: current.name,
            email: current.email,
          });

          // save for reuse
          localStorage.setItem("name", current.name);
          localStorage.setItem("email", current.email);
        }
      } catch (err) {
        console.log("Profile error", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="appContainer">

      {/* HEADER WITH BACK */}
      <div className="profileHeader">

        <div className="backBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </div>

        <h3>Profile</h3>

        <div style={{ width: 22 }}></div>
      </div>

      {/* PROFILE CARD */}
      <div className="profileCard">

        <div className="profileAvatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <div className="profileActions">

          <button
            className="primaryBtn"
            onClick={() => alert("Reset Password next")}
          >
            Reset Password
          </button>

          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}