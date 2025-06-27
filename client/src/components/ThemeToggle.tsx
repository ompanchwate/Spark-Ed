import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="w-full justify-start px-2 py-2"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div className="flex items-center ">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {/* <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span> */}
      </div>
    </Button>
  );
};
