
import { useState, useEffect } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, Search, Settings, LogOut, User, Moon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../ThemeToggle";

export default function StudentNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("details");
    Cookies.remove("token");
    setUserDetails(null);
    toast({
      title: "Signed out successfully",
      description: "See you soon.",
    });
    navigate("/signin");
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg py-2"
        : "bg-gradient-to-r from-blue-500 to-purple-500 py-4"
      }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard/student" className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-2">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-wide">Spark-Ed</span>
                <span className="text-white/80 text-xs block leading-none">Student Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/dashboard/student">Home</NavLink>
            <NavLink to="/dashboard/student/scholarships">Scholarships</NavLink>
            <NavLink to="/dashboard/student/addproject">Add Project</NavLink>
            <NavLink to="/dashboard/student/myprojects">My Projects</NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white cursor-pointer hover:bg-white/20 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-32">{userDetails?.userDetails?.name || 'Student'}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 text-black dark:text-white">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("profile")}>
                  <User className="h-4 w-4 mr-2" /> View Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-b from-blue-600 to-purple-600 text-white border-none"
              >
                <div className="flex flex-col space-y-6 mt-10">
                  {userDetails?.userDetails?.name && (
                    <div className="flex items-center space-x-2 text-white pb-4 border-b border-white/20">
                      <User className="h-5 w-5" />
                      <span className="font-medium">{userDetails.userDetails.name}</span>
                    </div>
                  )}

                  <MobileNavLink to="/dashboard/student">
                    <Home className="h-5 w-5 mr-3" />
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/dashboard/student/scholarships">
                    <Search className="h-5 w-5 mr-3" />
                    Scholarships
                  </MobileNavLink>
                  <MobileNavLink to="/dashboard/student/addproject">
                    <Settings className="h-5 w-5 mr-3" />
                    Add Project
                  </MobileNavLink>
                  <MobileNavLink to="/dashboard/student/myprojects">
                    <User className="h-5 w-5 mr-3" />
                    My Projects
                  </MobileNavLink>

                  <hr className="border-white/30" />

                  <button
                    onClick={() => navigate("profile")}
                    className="flex items-center text-white text-xl font-medium py-2 hover:bg-white/10 px-2 rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5 mr-3" />
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center text-white text-xl font-medium py-2 hover:bg-white/10 px-2 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-white text-sm font-medium relative hover:text-white/80 transition-colors
                 after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px]
                 after:bg-white after:scale-x-0 after:origin-center after:transition-transform
                 hover:after:scale-x-100"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center text-white text-xl font-medium py-2 hover:bg-white/10 px-2 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
