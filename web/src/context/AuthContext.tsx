import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  userId: string | null;
  isAdmin: boolean;
  name: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface DecodedToken {
  id: string;
  isAdmin: boolean;
  name: string;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const updateAuthState = () => {
    const token = localStorage.getItem('auth');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
        setIsAdmin(decoded.isAdmin);
        setName(decoded.name);
      } catch (error) {
        setUserId(null);
        setIsAdmin(false);
        setName('');
      }
    } else {
      setUserId(null);
      setIsAdmin(false);
      setName('');
    }
  };

  useEffect(() => {
    updateAuthState();

    const handleAuthChange = () => updateAuthState();
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, isAdmin, name }}>
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

const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth', token);
  } else {
    localStorage.removeItem('auth');
  }
  window.dispatchEvent(new Event('auth-changed'));
};

export { AuthProvider, useAuth, setToken };
