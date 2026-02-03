import { useState } from "react";
import api from "../api/axios";
import { setAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function RegisterCard({ onClose, onSuccess }) {

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      setAuth(res.data.token, res.data.user);

      onSuccess?.();      // notify modal
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="card auth-card">
      <h1 className="title">Register</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Jon Snow"
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="your@email.com"
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="••••••"
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkbox">
          <input type="checkbox" />
          <span>I want to receive updates via email.</span>
        </div>

        <button className="primary-btn" type="submit">
          Register
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="social-btn google">
          Sign up with Google
        </button>

        <button className="social-btn facebook">
          Sign up with Facebook
        </button>

        <p className="footer-text">
          Already have an account? <span>Login</span>
        </p>
      </form>
    </div>
  );
}

export default RegisterCard;
