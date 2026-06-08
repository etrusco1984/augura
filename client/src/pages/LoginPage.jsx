import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";


export default function LoginPage() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMessage("Email o password incorrecto");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('augura_wm.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <h1
          style={{
            textAlign: "center",
            fontFamily: "'Cinzel', serif",
            fontSize: "42px",
            letterSpacing: "4px",
            marginTop: "-250px",
            marginBottom: "150px",
            color: "#0a3d1e"
          }}
        >
          AVGVRA
        </h1>
      <div
        style={{
          width: "100%",
          maxWidth: 320,
          background: "rgba(255, 255, 255, 0.85)",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

        {errorMessage && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#b30000",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "14px"
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <button type="submit" style={{ width: "100%" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );

}
