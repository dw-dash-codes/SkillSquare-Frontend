import api from "./api";
import { jwtDecode } from "jwt-decode";

// ✅ Register (Customer or Provider dono ke liye)
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/Auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

export const registerProvider = async (userData) =>{
  try {
    const response = await api.post("/Provider/registerServiceProvider" , userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// ✅ Login (Customer, Provider, Admin sab ke liye)
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/Auth/login", credentials);

    if (response.data.token) {
      const token = response.data.token;

      // 🔹 Save token
      localStorage.setItem("token", token);

      
    
      

      // 🔹 Decode token and extract role
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // 🔹 Save role separately
      localStorage.setItem("role", role);

    }

    return response.data;
  } catch (error) {
    // 👇 backend ka error message show karne ke liye
    const message = error.response?.data?.message || error.response?.data || "Login failed";
    throw new Error(message);
  }
};
// ✅ Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
 // role bhi clear karna hoga
};

// ✅ Get saved token
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Get saved role
export const getRole = () => {
  return localStorage.getItem("role");
};

export const getName = () => {
  return localStorage.getItem("name");
}

// ✅ Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};