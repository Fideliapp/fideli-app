import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  userId: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface DecodedToken {
  id: string;
  isAdmin: boolean;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const updateAuthState = () => {
    const token = localStorage.getItem('auth');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
        setIsAdmin(decoded.isAdmin);
      } catch (error) {
        console.error('Invalid token', error);
        setUserId(null);
        setIsAdmin(false);
      }
    } else {
      setUserId(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Initial load
    updateAuthState();

    // Listen for the custom auth-changed event
    const handleAuthChange = () => updateAuthState();
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Utility to update token and notify
const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth', token);
  } else {
    localStorage.removeItem('auth');
  }
  window.dispatchEvent(new Event('auth-changed'));
};

export { AuthProvider, useAuth, setToken };
