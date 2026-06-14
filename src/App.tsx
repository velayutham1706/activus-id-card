import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import AuthGuard from "@/components/AuthGuard";
import { AppProvider } from "@/contexts/AppContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import IDGeneration from "./pages/IDGeneration";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import UserDetails from "./pages/UserDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Route Wrapper for role-based access
const ProtectedRoute = ({
  element,
  allowedRoles,
  isCollapsed,
  setIsCollapsed,
}: {
  element: React.ReactNode;
  allowedRoles?: Array<"admin" | "creator" | "reviewer" | "approver" | "user">;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) => {
  return <AuthGuard allowedRoles={allowedRoles}>{element}</AuthGuard>;
};

const AppRoutes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, currentUser } = useAppContext();

  console.log(
    "AppRoutes: isAuthenticated =",
    isAuthenticated,
    "currentUser =",
    currentUser,
  );

  // Determine the dashboard component based on the user role
  const DashboardComponent =
    currentUser?.role === "user" ? UserDashboard : Dashboard;

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <DashboardComponent
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Projects routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute
            element={
              <Projects
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver", "user"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute
            element={
              <CreateProject
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute
            element={
              <ProjectDetails
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver", "user"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />

      {/* Users routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute
            element={
              <Users
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute
            element={
              <UserDetails
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />

      {/* ID Generation route - Make accessible to all roles except 'user' */}
      <Route
        path="/id-generation"
        element={
          <ProtectedRoute
            element={
              <IDGeneration
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />

      {/* Profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            element={
              <Profile
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
            allowedRoles={["admin", "creator", "reviewer", "approver", "user"]}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
