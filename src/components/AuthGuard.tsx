import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Role } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, currentUser } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log(
      "AuthGuard: isAuthenticated =",
      isAuthenticated,
      "currentUser =",
      currentUser,
    );
    console.log("AuthGuard: allowedRoles =", allowedRoles);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log("AuthGuard: Not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    // If roles are specified, check if user has permission
    if (allowedRoles && allowedRoles.length > 0 && currentUser) {
      console.log(
        "AuthGuard: Checking roles. User role =",
        currentUser.role,
        "Allowed roles =",
        allowedRoles,
      );
      const hasAccess = allowedRoles.includes(currentUser.role);

      if (!hasAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        console.log("AuthGuard: Access denied, redirecting to home");
        navigate("/");
      }
    }
  }, [isAuthenticated, currentUser, allowedRoles, navigate, toast]);

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    console.log("AuthGuard: Not rendering children because not authenticated");
    return null;
  }

  // If roles are specified and user doesn't have permission, don't render children
  if (allowedRoles && allowedRoles.length > 0 && currentUser) {
    const hasAccess = allowedRoles.includes(currentUser.role);
    if (!hasAccess) {
      console.log("AuthGuard: Not rendering children because role not allowed");
      return null;
    }
  }

  console.log("AuthGuard: Rendering children");
  return <>{children}</>;
};

export default AuthGuard;
