export default function Topbar({ setOpen }) {
  const name = localStorage.getItem("name");

  return (
    <div className="topbar">
      
      {/* 🔥 MENU BUTTON */}
      <button className="menuBtn" onClick={() => setOpen(true)}>
        ☰
      </button>

      <div>👋 {name}</div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

    </div>
  );
}