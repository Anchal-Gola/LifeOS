import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  googleLoginUser,
  logoutUser,
} from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.data);
  };

  const googleLogin = async (credential) => {
    const data = await googleLoginUser(credential);
    setUser(data.data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;