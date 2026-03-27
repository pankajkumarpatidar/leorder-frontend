import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} />

      <div className="main">
        <Topbar setOpen={setOpen} />

        <div className="content">
          {children}
        </div>
      </div>

      <BottomNav />
    </>
  );
}