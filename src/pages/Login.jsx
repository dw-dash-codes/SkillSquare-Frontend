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
    <section className="app-section app-section-hero auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-10 col-xl-11">
            <div className="card app-card border-0 auth-card overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="auth-form-panel p-4 p-md-5">
                    <div className="auth-form-header text-center text-lg-start mb-4">
                      <div className="auth-icon-circle mb-3">
                        <i className="fas fa-user"></i>
                      </div>

                      <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                        Welcome Back
                      </span>

                      <h1 className="h3 fw-bold mb-2">Login to Your Account</h1>

                      <p className="text-secondary mb-0">
                        Access your account and connect with trusted service
                        providers in your neighborhood.
                      </p>
                    </div>

                    {error && (
                      <div className="alert alert-danger rounded-4 mb-4" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label auth-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control auth-input"
                            placeholder="Enter email address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label auth-label">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control auth-input"
                            placeholder="Enter password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
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

                        <a href="#" className="auth-link text-decoration-none">
                          Forgot password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill py-3 fw-semibold mt-4"
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

                      <div className="text-center mt-4">
                        <p className="text-secondary mb-0">
                          Don’t have an account?{" "}
                          <Link to="/getstarted" className="auth-link text-decoration-none">
                            Get started
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-lg-6 d-none d-lg-block">
                  <div className="auth-side-panel h-100">
                    <div className="auth-side-content text-center">
                      <div className="auth-side-emoji mb-4">👋</div>
                      <h3 className="fw-bold mb-3">Welcome Back!</h3>
                      <p className="text-secondary mb-0">
                        Log in to continue exploring trusted professionals and
                        managing your service experience with ease.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;