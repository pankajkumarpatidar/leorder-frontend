import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <Topbar />
      <div className="content">{children}</div>
    </div>
  );
}