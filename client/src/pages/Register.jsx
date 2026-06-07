import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    lang: "en"
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await register(form.name, form.email, form.password, form.lang);
      navigate("/"); // auto-login after registration
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Create Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="lang" value={form.lang} onChange={handleChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
        </select>

        <button type="submit" style={{ marginTop: "10px" }}>
          Register
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
