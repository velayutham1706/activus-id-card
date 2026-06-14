import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  Users,
  IdCard,
  LogOut,
  User,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Navbar = ({ isCollapsed, setIsCollapsed }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout, isAuthenticated } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!currentUser) return [];

    const items = [
      {
        name: "Dashboard",
        path: "/",
        icon: <LayoutDashboard className="w-5 h-5" />,
        roles: ["admin", "creator", "reviewer", "approver", "user"],
      },
    ];

    // Projects visible to all roles
    items.push({
      name: "Projects",
      path: "/projects",
      icon: <Briefcase className="w-5 h-5" />,
      roles: ["admin", "creator", "reviewer", "approver", "user"],
    });

    // Users management - visible to admin, creator, reviewer, approver
    if (currentUser.role !== "user") {
      items.push({
        name: "Users",
        path: "/users",
        icon: <Users className="w-5 h-5" />,
        roles: ["admin", "creator", "reviewer", "approver"],
      });
    }

    // ID Generation - visible to admin, creator, reviewer, approver
    if (currentUser.role !== "user") {
      items.push({
        name: "ID Generation",
        path: "/id-generation",
        icon: <IdCard className="w-5 h-5" />,
        roles: ["admin", "creator", "reviewer", "approver"],
      });
    }

    // Profile - visible to all roles
    items.push({
      name: "My Profile",
      path: "/profile",
      icon: <User className="w-5 h-5" />,
      roles: ["admin", "creator", "reviewer", "approver", "user"],
    });

    return items.filter((item) => item.roles.includes(currentUser.role));
  };

  // Filter nav items based on user role
  const filteredNavItems = getNavItems();

  if (!isAuthenticated) {
    return null; // Don't render navbar if not authenticated
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed z-40 sm:hidden top-4 left-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 bg-white transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out sm:hidden`}
      >
        <div className="flex flex-col h-full p-6 pt-16">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/logo/activus.png"
                alt="Activus Industrial Design & Build LLP"
                className="h-auto w-full max-w-[150px]"
              />
            </div>
          </div>
          <nav className="space-y-6 flex-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          {currentUser && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="p-2">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-screen bg-white shadow-md transition-all duration-300 ease-in-out hidden sm:block ${isCollapsed ? "w-[60px]" : "w-64"
          }`}
      >
        <div className="flex flex-col h-full">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center p-4" : "px-6 py-4"}`}
          >
            {isCollapsed ? (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                A
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <img
                  src="/logo/activus.png"
                  alt="Activus Industrial Design & Build LLP"
                  className="h-auto w-full max-w-[120px]"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-12 bg-white border border-gray-200 rounded-full p-1 shadow-md"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <nav className="flex-1 mt-8 px-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"
                  } p-2 mb-2 rounded-md ${isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {currentUser && !isCollapsed && (
            <div className="mt-auto p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="p-1">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
