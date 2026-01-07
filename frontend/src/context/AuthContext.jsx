import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 👇 CHANGE THIS LINE
  // OLD: const [user, setUser] = useState(null); 
  
  // NEW: Hardcode the user so you are always logged in
  const [user, setUser] = useState({
    name: "Dev Admin",
    email: "admin@kiwisport.com",
    role: "superuser", // This passes your AdminRoute check
  });

  // You can comment out the login/logout functions for now
  const login = async (data) => {
     console.log("Login disabled for dev mode");
  };

  const logout = () => {
     console.log("Logout disabled for dev mode");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);