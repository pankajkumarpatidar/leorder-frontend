import { useState } from "react";
import BASE_URL from "../api";

export default function Signup(){
  const [form,setForm] = useState({});

  const submit = async()=>{
    await fetch(`${BASE_URL}/auth/register`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    alert("Registered");
  };

  return(
    <div className="app">
      <h2>Signup</h2>

      <input placeholder="Business Name" onChange={e=>setForm({...form,business_name:e.target.value})}/>
      <input placeholder="Person Name" onChange={e=>setForm({...form,person_name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>

      <button onClick={submit}>Register</button>
    </div>
  );
}
