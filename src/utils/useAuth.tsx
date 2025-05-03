import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: { id: string, username: string} | null;
  setUser: React.Dispatch<React.SetStateAction<{id: string, username: string} | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{id: string, username: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data} = await axios.get("http://localhost:8080/api/v1/auth", {
          withCredentials: true,
        });
        setUser(data.data); 
        console.log(data.data);
      } catch (err) {
        setUser(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
