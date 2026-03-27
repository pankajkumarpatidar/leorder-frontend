export default function Topbar({ setOpen }) {
  return (
    <div className="topbar">

      <button className="menuBtn" onClick={() => setOpen(true)}>
        ☰
      </button>

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