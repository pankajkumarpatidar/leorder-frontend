import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="bottomNav">

      <NavLink to="/home" className="navItem">
        Home
      </NavLink>

      <NavLink to="/leads" className="navItem">
        Leads
      </NavLink>

      <NavLink to="/orders" className="navItem">
        Orders
      </NavLink>

      <NavLink to="/worksheet" className="navItem">
        Work
      </NavLink>

      <NavLink to="/profile" className="navItem">
        Profile
      </NavLink>

    </div>
  );
}
