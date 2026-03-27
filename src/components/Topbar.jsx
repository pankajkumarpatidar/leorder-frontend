export default function Topbar() {
  const name = localStorage.getItem("name");

  return (
    <div className="topbar">
      <div>👋 Welcome, {name}</div>

      <button
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