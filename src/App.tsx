import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LogIn from "./pages/login";
import ListingPage from "./pages/listing";
import CreateEmployeePage from "./pages/create";
import UpdateEmployeePage from "./pages/edit";
import { ProtectedRoute, PublicRoute } from "./components/route-protection";
import AppLayout from "./components/app-layout";


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LogIn />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ListingPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateEmployeePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UpdateEmployeePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
