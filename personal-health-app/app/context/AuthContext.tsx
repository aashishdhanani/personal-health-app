// app/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextProps {
  user: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // Replace with your API endpoint
      const payload = {
        email,
        password
      };
      console.log(payload);
      const response = await axios.post('http://localhost:5001/login', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Login response:', response.data); // Log the response data
  
      // Assuming the API response contains user data
      if (response.data && response.data.user.email) {
        setUser(response.data.user.email);
      } else {
        console.error('Login failed: Invalid response data');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data); // Log error response from the server
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    try {
      // Replace with your API endpoint
      const payload = {
        email,
        password
      };
      console.log(payload);
      const response = await axios.post('http://localhost:5001/register', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data); 
      // Assuming the API response contains user data
      setUser(response.data.username);
    } catch (error) {
      console.error('Registration failed:', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
