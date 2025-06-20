import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  FileText, 
  GraduationCap,
  Users,
  TrendingUp,
  Eye
} from "lucide-react";
import { useUser } from '@/context/UserContext';

const CompanyDashboard = () => {
  const { userDetails } = useUser();
  console.log("userDetails", userDetails);

  // Mock data for demonstration
  const stats = {
    totalScholarships: 8,
    totalProjects: 25,
    pendingReviews: 5,
  };

  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome back, {userDetails?.company_name || 'Company'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage scholarships and review student projects from your dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 dark:bg-gray-800/80 dark:border-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Scholarships
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalScholarships}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Active scholarships
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 dark:bg-gray-800/80 dark:border-green-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Student Projects
                </CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalProjects}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Total submissions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 dark:bg-gray-800/80 dark:border-yellow-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Reviews
                </CardTitle>
                <Eye className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Needs attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Scholarship */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 dark:bg-gray-800/80 dark:border-blue-900  hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Add Scholarship
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create new scholarship opportunities for students
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Create Scholarship
                </Button>
              </CardContent>
            </Card>

            {/* View All Scholarships */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 dark:bg-gray-800/80 dark:border-blue-900  hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  View All Scholarships
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Manage and edit existing scholarship programs
                </p>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  View Scholarships
                </Button>
              </CardContent>
            </Card>

            {/* View Student Projects */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 dark:bg-gray-800/80 dark:border-blue-900  hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-orange-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Student Projects
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Review and evaluate student project submissions
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  View Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDashboard;