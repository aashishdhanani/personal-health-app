// app/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextProps {
  user: { email: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = async (email: string, password: string) => {
    // Logic for login
    setUser({ email });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    // Example logic for registration using axios
    await axios.post('http://localhost:5001/register', { email, password });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};