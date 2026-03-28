import { useState } from "react";

export default function Users() {
  const [show, setShow] = useState(false);

  return (
    <div className="appContainer">

      {/* HEADER */}
      <div className="header">
        <h3>Users</h3>
      </div>

      {/* LIST EMPTY */}
      <p style={{ marginTop: 20, color: "#888" }}>No users yet</p>

      {/* FLOAT BUTTON */}
      <button className="fab" onClick={() => setShow(true)}>
        +
      </button>

      {/* OVERLAY */}
      {show && <div className="overlay" onClick={() => setShow(false)} />}

      {/* BOTTOM SHEET */}
      <div className={`bottomSheet ${show ? "show" : ""}`}>

        <h2>Add User</h2>

        <input placeholder="Name" />
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />

        <select>
          <option>Staff</option>
          <option>Salesman</option>
        </select>

        <button className="btnPrimary">Create</button>

      </div>

    </div>
  );
}