import { useState } from "react";
import api from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });

  const login = async () => {
    const res = await api.post("/api/auth/login", form);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      window.location.href = "/";
    }
  };

  return (
    <div style={{padding:50}}>
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e=>setForm({...form,email:e.target.value})}
      />

      <input type="password"
        placeholder="Password"
        onChange={e=>setForm({...form,password:e.target.value})}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}