
import React, { useState } from "react";
import SignIn from "@/components/Register/SignIn";
import SignUp from "@/components/Register/SignUp";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeView, setActiveView] = useState<"signin" | "signup">("signin");

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white p-4 md:p-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mb-8">
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome To Spark-Ed</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 flex mb-6 shadow-sm">
            <Button
              variant={activeView === "signin" ? "default" : "ghost"}
              className={`flex-1 ${activeView === "signin" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => setActiveView("signin")}
            >
              Sign In
            </Button>
            <Button
              variant={activeView === "signup" ? "default" : "ghost"}
              className={`flex-1 ${activeView === "signup" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => setActiveView("signup")}
            >
              Sign Up
            </Button>
          </div>

          {activeView === "signin" ? <SignIn /> : <SignUp />}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 Spark-Ed. All rights reserved.
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
