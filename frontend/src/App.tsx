import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/Student/dashboard";
import { UserProvider } from "./context/UserContext";
import { AuthWrapper } from "./app/AuthWrapper";
import ProtectedRoute from "./components/ProtectedRoutes";
import { ThemeProvider } from "./components/ThemeProvider";
import Scholarships from "./pages/Student/scholarships";
import StudentLayout from "./layouts/StudentLayout";
import AddProject from "./pages/Student/addProject";
import MyProjects from "./pages/Student/myProjects";
import ProjectDetails from "./pages/Student/projectDetails";
import SignIn from "./components/Register/SignIn";
import SignUp from "./components/Register/SignUp";
import CompanyDashboard from "./pages/Company/CompanyDashboard";
import CompanyLayout from "./layouts/CompanyLayout";
import CompanyScholarships from "./pages/Company/CompanyScholarships";
import ViewAllProjects from "./pages/Company/viewAllProjects";
import StudentProfile from "./components/student/studentprofile";
import CompanyProfile from "./components/company/companyprofile";
import CreateScholarship from "./pages/Company/createScholarship";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <ThemeProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Company Route */}
              <Route
                path="/dashboard/company"
                element={
                  <AuthWrapper>
                    <ProtectedRoute allowedUserType="company">
                      <CompanyLayout />
                    </ProtectedRoute>
                  </AuthWrapper>
                }
              >
                <Route index element={<CompanyDashboard />} />
                <Route path="scholarships" element={<CompanyScholarships />} />
                <Route path="addscholarship" element={<CreateScholarship />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="allprojects" element={<ViewAllProjects />} />
              </Route>

              {/* Protected Student Routes */}
              <Route
                path="/dashboard/student"
                element={
                  <AuthWrapper>
                    <ProtectedRoute allowedUserType="student">
                      <StudentLayout />
                    </ProtectedRoute>
                  </AuthWrapper>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="scholarships" element={<Scholarships />} />
                <Route path="addproject" element={<AddProject />} />
                <Route path="myprojects" element={<MyProjects />} />
                <Route path="my-projects/:id" element={<ProjectDetails />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
