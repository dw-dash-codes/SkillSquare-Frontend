import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        const decoded = jwtDecode(data.token);
        const role =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (role === "Admin") {
          setError("Login failed. Please check your credentials.");
          setSubmitting(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (role === "Customer") {
          navigate("/");
        } else if (role === "Provider") {
          navigate("/provider/");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="app-section bg-light min-vh-100 d-flex align-items-center py-5" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          {/* Centered Compact Card */}
          <div className="col-md-8 mt-5 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card app-card border-0 rounded-4 shadow-lg bg-white">
              <div className="p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '64px', height: '64px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)', fontSize: '1.5rem' }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                  <h1 className="font-display fw-bold text-dark mb-2">Welcome Back</h1>
                  <p className="text-secondary font-body mb-0">
                    Log in to your account to continue
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger rounded-3 font-body small py-2 mb-4 d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="font-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control px-3 py-2 bg-light border-0 shadow-none"
                      style={{ borderRadius: '0.75rem' }}
                      placeholder="Enter email address"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control px-3 py-2 bg-light border-0 shadow-none"
                      style={{ borderRadius: '0.75rem' }}
                      placeholder="Enter password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4 small">
                    <div className="form-check m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>

                    <a href="#" className="text-decoration-none hover-primary" style={{ color: 'var(--app-primary)' }}>
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold shadow-warm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Log In
                      </>
                    )}
                  </button>

                  <div className="text-center mt-4 pt-2">
                    <p className="text-secondary small mb-0">
                      Don’t have an account?{" "}
                      <Link to="/getstarted" className="text-decoration-none fw-bold hover-primary" style={{ color: 'var(--app-primary)' }}>
                        Get started
                      </Link>
                    </p>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;