import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStorage } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      tokenStorage.clear();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    tokenStorage.set(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    tokenStorage.set(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      setUser,
      refreshUser,
      isAuthenticated: Boolean(user)
    }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
