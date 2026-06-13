import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { setAuthToken } from '../api/axios';
import { getErrorMessage } from '../utils/format';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user && getToken());

  const handleAuthSuccess = useCallback((data) => {
    const { user: userData, token } = data;
    setToken(token);
    setAuthToken(token);
    setStoredUser(userData);
    setUser(userData);
    return userData;
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    return handleAuthSuccess(data.data);
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    return handleAuthSuccess(data.data);
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await authApi.getProfile();
    const profile = data.data.user;
    setStoredUser(profile);
    setUser(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await authApi.updateProfile(payload);
    const profile = data.data.user;
    setStoredUser(profile);
    setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token);

      try {
        await refreshProfile();
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshProfile]);

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    }),
    [
      user,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { getErrorMessage };
