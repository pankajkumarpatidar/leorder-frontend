import { useNavigate } from "react-router-dom";

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

      {/* HEADER */}
      <div className="header">
        <h3>Profile 👤</h3>
      </div>

      {/* PROFILE CARD */}
      <div className="profileCard">

        {/* AVATAR */}
        <div className="profileAvatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <h2>{name}</h2>
        <p>{email}</p>

        {/* ACTIONS */}
        <div className="profileActions">

          <button
            className="primaryBtn"
            onClick={() => alert("Reset Password UI next")}
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