import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Array of music IDs

  const fetchFavorites = async () => {
    try {
      const data = await authService.getFavorites();
      if (data.favourites) {
        // Map the populated music objects back to their IDs for easy checking
        setFavorites(data.favourites.map(song => song._id || song));
      }
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  // Check for active session on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData.user || userData);
        setIsAuthenticated(true);
        await fetchFavorites();
      } catch (error) {
        // No valid session cookie found or expired
        console.error("No active session found");
        setUser(null);
        setIsAuthenticated(false);
        setIsGuest(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    setIsGuest(false);
    await fetchFavorites();
    return data;
  };

  const toggleFavorite = async (songId) => {
    try {
      if (favorites.includes(songId)) {
        await authService.unlikeMusic(songId);
        setFavorites(prev => prev.filter(id => id !== songId));
      } else {
        await authService.likeMusic(songId);
        setFavorites(prev => [...prev, songId]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    // Auto login could happen here, but currently it just returns
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Failed to logout from backend", err);
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setFavorites([]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isGuest,
      loading,
      favorites,
      login,
      register,
      logout,
      toggleFavorite,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};