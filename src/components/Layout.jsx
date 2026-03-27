import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔥 AUTO DETECT SCREEN
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setOpen(false); // reset sidebar on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* SIDEBAR (ONLY FOR DESKTOP OR OPEN MOBILE) */}
      <Sidebar open={open} setOpen={setOpen} isMobile={isMobile} />

      <div className="main">
        <Topbar setOpen={setOpen} isMobile={isMobile} />

        <div className="content">
          {children}
        </div>
      </div>

      {/* 🔥 MOBILE ONLY */}
      {isMobile && <BottomNav />}
    </>
  );
}