
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanyDashBoard from "./pages/Company/dashboard";
import StudentDashboard from "./pages/Student/dashboard";
import { UserProvider } from "./context/UserContext";
import { AuthWrapper } from "./app/AuthWrapper";
import ProtectedRoute from "./components/ProtectedRoutes";
import { ThemeProvider } from "./components/ThemeProvider";
import Scholarships from "./pages/Student/scholarships";
import StudentLayout from "./layouts/StudentLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <UserProvider>
        <BrowserRouter>
          <AuthWrapper>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />

                <Route
                  path="/dashboard/company"
                  element={
                    <ProtectedRoute allowedUserType="company">
                      <CompanyDashBoard />
                    </ProtectedRoute>
                  }
                />



                <Route
                  path="/dashboard/student"
                  element={
                    <ProtectedRoute allowedUserType="student">
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StudentDashboard />} />
                  <Route path="scholarships" element={<Scholarships />} />
                </Route>


                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />


              </Routes>
            </ThemeProvider>
          </AuthWrapper>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
