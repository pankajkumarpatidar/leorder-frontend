import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      
      {/* MAIN CONTENT */}
      <main className="appContainer">
        {children}
      </main>

      {/* BOTTOM NAV */}
      <BottomNav />

    </div>
  );
}