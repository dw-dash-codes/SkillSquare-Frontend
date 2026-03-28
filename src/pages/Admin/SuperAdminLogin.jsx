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
      await loginUser({ email, password });

      const role = localStorage.getItem("role");

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
    <section className="app-section app-section-hero auth-page min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="card app-card border-0 auth-card admin-login-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon-circle mx-auto mb-3">
                    <i className="fas fa-user-shield"></i>
                  </div>

                  <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                    Admin Access
                  </span>

                  <h1 className="h3 fw-bold mb-2">Skill Square Admin</h1>
                  <p className="text-secondary mb-0">
                    Secure login to access the admin dashboard.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger rounded-4 mb-4" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label auth-label">Email Address</label>
                      <input
                        className="form-control auth-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label auth-label">Password</label>
                      <input
                        className="form-control auth-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 fw-semibold mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center text-secondary mt-3 mb-0 small">
              © 2025 Skill Square
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperAdminLogin;