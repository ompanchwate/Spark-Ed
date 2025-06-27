import Navbar from "@/components/student/StudentNavbar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"


const StudentDashboard = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to Spark-Ed</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Start building your amazing educational journey here!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={'/dashboard/student/scholarships'}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-medium">
                Explore Scholarships
              </Button>
            </Link>
            <Button variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-8 py-6 rounded-lg text-lg font-medium">
              Request for Funding
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard