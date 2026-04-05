import { useState } from "react";
import BASE_URL from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async()=>{
    const res = await fetch(`${BASE_URL}/auth/login`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    });

    const data = await res.json();

    if(data.token){
      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));
      nav("/home");
    } else alert(data.message);
  };

  return(
    <div className="app">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={login}>Login</button>
    </div>
  );
}
