import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const SuperAdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔐 LOGIN VIA SERVICE
      await loginUser({ email, password });

      const role = localStorage.getItem("role");

      // 🔥 ROLE BASED REDIRECT
      if (role === "Admin") {
        navigate("/admin/");
      } else {
        setError("You are not authorized as Admin");
        localStorage.clear();
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="admin-brand">
                <i className="fas fa-shield-alt me-2"></i>Skill Square
              </span>
              <p className="admin-subtitle">Admin Control Panel</p>
            </div>
            <div className="text-white-50">
              <i className="fas fa-lock me-1"></i>Secure Login
            </div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="container">
        <div className="card login-card">
          <div className="row g-0">
            {/* Left */}
            <div className="col-md-6">
              <div className="login-form-section">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">
                  Sign in to access admin dashboard
                </p>

                <form onSubmit={handleLogin}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <i className="fas fa-envelope input-icon"></i>
                      <input
                        className="form-control with-icon"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@skillsquare.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <i className="fas fa-lock input-icon"></i>
                      <input
                        className="form-control with-icon"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-admin-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right */}
            <div className="col-md-6 d-none d-md-block">
              <div className="illustration-section">
                <div className="illustration-content">
                  <div className="illustration-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <h3 className="illustration-title">Admin Access</h3>
                  <p className="illustration-text">
                    Manage users, providers, services, and monitor all
                    activities from your secure dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="admin-footer">
        <div className="container">
          <p className="mb-0">
            <strong>&copy; 2025 Skill Square.</strong> All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default SuperAdminLogin;
