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
        setError("Unauthorized access.");
        localStorage.clear();
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-light min-vh-100 d-flex align-items-center justify-content-center px-3">
      
      {/* Ultra-minimal, centered card restricted to 400px width */}
      <div className="card border-0 rounded-4 shadow-sm w-100" style={{ maxWidth: '400px', background: '#ffffff' }}>
        <div className="card-body p-4 p-sm-5">
          
          <div className="text-center mb-4">
            <h2 className="font-display fw-bold text-dark mb-1">Admin Portal</h2>
            <p className="text-secondary font-body small mb-0">Secure restricted access</p>
          </div>

          {error && (
            <div className="alert alert-danger rounded-3 font-body small py-2 text-center border-0" style={{ background: '#fef2f2', color: '#ef4444' }} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="font-body">
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small mb-1">Email</label>
              <input
                className="form-control px-3 py-2 bg-light border-0 shadow-none"
                style={{ borderRadius: '0.5rem' }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillsquare.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-1">Password</label>
              <input
                className="form-control px-3 py-2 bg-light border-0 shadow-none"
                style={{ borderRadius: '0.5rem' }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-bold"
              disabled={loading}
              style={{ borderRadius: '0.5rem', transition: 'all 0.2s ease', backgroundColor: '#0f172a' }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

        </div>
      </div>

    </section>
  );
};

export default SuperAdminLogin;