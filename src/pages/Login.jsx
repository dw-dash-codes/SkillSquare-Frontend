import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        const decoded = jwtDecode(data.token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        
        if (role === "Admin") {
          
          setError("Login failed. Please check your credentials.");
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
    }
  };

  return (
    <div className="loginPage-content">
      <div className="container">
        <h1 className="brand-title">Neighborhood Services</h1>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="login-section">
              <div className="user-icon">
                <i className="fas fa-user"></i>
              </div>

              <h2 className="form-title">Login</h2>

              {error && <p className="text-danger">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn btn-login">
                  Log in
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
            <div className="illustration-section h-100">
              <div>
                <div className="illustration-character">👋</div>
                <h3>Welcome Back!</h3>
                <p className="mb-0">
                  Connect with trusted service providers in your neighborhood
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
