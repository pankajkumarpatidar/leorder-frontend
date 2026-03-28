import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "user@email.com";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="appContainer">

      {/* HEADER WITH BACK */}
      <div className="profileHeader">

        {/* 🔙 BACK BUTTON */}
        <div className="backBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </div>

        <h3>Profile</h3>

        {/* EMPTY SPACE FOR ALIGN */}
        <div style={{ width: 22 }}></div>
      </div>

      {/* PROFILE CARD */}
      <div className="profileCard">

        <div className="profileAvatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <h2>{name}</h2>
        <p>{email}</p>

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