export default function Topbar({ setOpen }) {
  const name = localStorage.getItem("name");

  return (
    <div className="topbar">

      <button className="menuBtn" onClick={()=>setOpen(true)}>
        ☰
      </button>

      <div className="welcome">
        👋 {name}
      </div>

      <button
        className="logout"
        onClick={()=>{
          localStorage.clear();
          window.location.href="/login";
        }}
      >
        Logout
      </button>

    </div>
  );
}