// ===== FILE: AddLead.jsx =====

import { useState } from "react";
import BASE_URL from "../api";
import { useNavigate } from "react-router-dom";

export default function AddLead() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    business_name: "",
    person_name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst_status: "UNREGISTERED",
    gst_no: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    if (!form.business_name || !form.mobile) {
      alert("Business name & mobile required");
      return;
    }

    if (form.gst_status === "REGISTERED" && !form.gst_no) {
      alert("GST number required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Lead created ✅");
      navigate("/leads");

    } catch (e) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appContainer">

      <div className="header">
        <h3>Add Lead</h3>
      </div>

      <div className="cardItem">

        <input name="business_name" placeholder="Business Name *" onChange={handleChange}/>
        <input name="person_name" placeholder="Owner Name" onChange={handleChange}/>
        <input name="mobile" placeholder="Mobile *" onChange={handleChange}/>
        <input name="email" placeholder="Email" onChange={handleChange}/>
        <input name="address" placeholder="Address" onChange={handleChange}/>
        
        <div className="row">
          <input name="city" placeholder="City" onChange={handleChange}/>
          <input name="state" placeholder="State" onChange={handleChange}/>
        </div>

        <input name="pincode" placeholder="Pincode" onChange={handleChange}/>

        <select name="gst_status" onChange={handleChange}>
          <option value="UNREGISTERED">No GST</option>
          <option value="REGISTERED">GST Registered</option>
        </select>

        {form.gst_status === "REGISTERED" && (
          <input name="gst_no" placeholder="GST Number" onChange={handleChange}/>
        )}

        <button onClick={submit}>
          {loading ? "Saving..." : "Save Lead"}
        </button>

      </div>
    </div>
  );
}
