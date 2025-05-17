import { useState, useEffect } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Home, Search, Settings } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg py-2" : "bg-gradient-to-r from-blue-500 to-purple-500 py-4"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-2">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-bold text-xl tracking-wide">Spark-Ed</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard/student/scholarships">Scholarships</NavLink>
            <NavLink to="/dashboard/student/addproject">Add Project</NavLink>
            <NavLink to="/about">about</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-blue-600 to-purple-600 text-white border-none">
                <div className="flex flex-col space-y-6 mt-10">
                  <MobileNavLink to="/">Home</MobileNavLink>
                  <MobileNavLink to="/about">About</MobileNavLink>
                  <MobileNavLink to="/courses">Courses</MobileNavLink>
                  <MobileNavLink to="/contact">Contact</MobileNavLink>
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
      className="text-white text-md font-medium relative hover:text-white/80 transition-colors
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
    <Link to={to} className="text-white text-xl font-medium py-2 hover:bg-white/10 px-2 rounded-lg transition-colors">
      {children}
    </Link>
  );
}