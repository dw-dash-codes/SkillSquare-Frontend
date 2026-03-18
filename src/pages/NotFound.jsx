import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.heading}>Oops! Page Not Found</h2>
        <p style={styles.text}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary" style={styles.button}>
          <i className="fas fa-home mr-2"></i> Go to Homepage
        </Link>
      </div>
    </div>
  );
};

// Simple internal styling taake aapko alag CSS file na banani pare
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    textAlign: "center",
  },
  content: {
    maxWidth: "500px",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  errorCode: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#dc3545", // Red color like danger
    margin: "0",
  },
  heading: {
    fontSize: "24px",
    marginTop: "10px",
    marginBottom: "20px",
    color: "#333",
  },
  text: {
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "50px", // Rounded pill button
  },
};

export default NotFound;
