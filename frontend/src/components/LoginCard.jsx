import { useState } from "react";
import api from "../api/axios";
import { setAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function LoginCard({ onSuccess }) {

  const [form, setForm] = useState({ email: "", password: "" });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post("/auth/login", form);
        setAuth(res.data.token, res.data.user);

        onSuccess?.(); // notify parent only
    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
};


  return (
    <div className="card auth-card">
      <h1 className="title">Login</h1>

      <form onSubmit={handleSubmit}>
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

        <div className="field password-field">
          <label>Password</label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            value={form.password}
            placeholder="••••••"
            onChange={handleChange}
            required
          />
          <span className="eye" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? "🙈" : "👁"}
          </span>
        </div>

        <div className="row">
          <div className="checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </div>
          <span className="link">Forgot password?</span>
        </div>

        <button className="primary-btn" type="submit">
          Login
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="social-btn google">
          Sign in with Google
        </button>

        <button className="social-btn facebook">
          Sign in with Facebook
        </button>

        <p className="footer-text">
          Don’t have an account? <span>Register now!</span>
        </p>
      </form>
    </div>
  );
}

export default LoginCard;
