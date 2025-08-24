// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeApi, logoutApi } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await getMeApi();

        // ✅ Ensure role is always present
        const userWithRole = {
          ...me,
          role: me.role || "customer",
        };

        setUser(userWithRole);
        localStorage.setItem("user", JSON.stringify(userWithRole));
      } catch (err) {
        console.error("Auth check failed:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loginSuccess = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    if (data.user) {
      // ✅ Ensure role is always present
      const userWithRole = {
        ...data.user,
        role: data.user.role || "customer",
      };

      setUser(userWithRole);
      localStorage.setItem("user", JSON.stringify(userWithRole));
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUser,
        setToken,
        loginSuccess,
        logout: handleLogout,
      }}
    >
      {loading ? (
        <div className="text-center mt-5">Checking authentication...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
