import { useState } from "react";
import BASE_URL from "../api";

export default function AddWorksheet() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    mobile: "",
    notes: "",
  });

  const handleSubmit = async () => {
    if (!form.mobile) {
      return alert("Mobile required");
    }

    const res = await fetch(`${BASE_URL}/worksheets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Worksheet Added");
      setForm({ mobile: "", notes: "" });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Add Worksheet</h3>
      </div>

      <div className="cardItem">
        <p>Mobile</p>
        <input
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />
      </div>

      <div className="cardItem">
        <p>Notes</p>
        <input
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />
      </div>

      <button className="cardItem" onClick={handleSubmit}>
        Submit
      </button>

    </div>
  );
}
