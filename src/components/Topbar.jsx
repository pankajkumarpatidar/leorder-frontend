export default function Topbar({ setOpen, isMobile }) {
  return (
    <div className="topbar">

      {/* 🔥 ONLY MOBILE */}
      {isMobile && (
        <button className="menuBtn" onClick={() => setOpen(true)}>
          ☰
        </button>
      )}

      <div>👋 Welcome</div>

      <button onClick={()=>{
        localStorage.clear();
        window.location.href="/login";
      }}>
        Logout
      </button>

    </div>
  );
}