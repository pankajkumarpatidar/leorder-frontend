import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {

  const [open, setOpen] = useState(false);

  return (
    <div className="app">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="main">

        <Topbar setOpen={setOpen} />

        <div className="content">
          {children}
        </div>

        <BottomNav />

      </div>

    </div>
  );
}