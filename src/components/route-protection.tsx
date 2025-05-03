import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
      <div>
          Loading...
      </div>
    );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div>
        Loading...
    </div>
  );

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export { PublicRoute, ProtectedRoute };
