import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signInUser } from "@/app/api/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";



const SignIn = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"student" | "company">("student");

  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...formData,
      type: userType,
    };

    try {
      const res = await signInUser(payload);
      Cookies.set("token", res.token);

      const userData = {
        userType: "student", // Set this dynamically based on context
        userDetails: res.userDetails,
      };

      localStorage.setItem("details", JSON.stringify(userData));

      if (res.status === 200) {
        toast({
          title: "Sign in successful",
          description: `Welcome back, ${userType}!`,
        });
        if (userType === "student") {
          navigate("/dashboard/student");
        } else {
          navigate("/dashboard/company");
        }
      } else {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Sign in failed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sign in successful",
      description: `Welcome back, ${userType}!`,
    });
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md mx-auto">
      <Card className="w-full shadow-lg border-none dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center dark:text-white">
            Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>

        <div className="mb-4 flex gap-8 justify-center">
          <Button
            variant={userType === "student" ? "default" : "outline"}
            onClick={() => setUserType("student")}
          >
            Student
          </Button>
          <Button
            variant={userType === "company" ? "default" : "outline"}
            onClick={() => setUserType("company")}
          >
            Company
          </Button>
        </div>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="dark:text-gray-300">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {showPassword ? (
                  <EyeOff
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="h-11 dark:border-gray-700 dark:hover:bg-gray-700">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign In with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-2 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline dark:text-blue-400"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
