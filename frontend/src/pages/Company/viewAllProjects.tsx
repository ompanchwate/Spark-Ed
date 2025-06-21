import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Briefcase, User, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { NavLink } from "react-router-dom";
import {allProjects} from "@/api/companyApi"

const ViewAllProjects = () => {
    const { toast } = useToast();
    const { userDetails } = useUser();
    const [projects, setProjects] = useState([]);

    // Helper function to truncate text
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
    };

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userDetails?.userDetails?.company_id) return; // Wait until stud_id is available

            try {
                const token = Cookies.get("token");
                const response = await allProjects(token);

                if (!response || response.error) {
                    throw new Error("Failed to fetch projects");
                }

                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast({
                    title: "Failed to load projects",
                    description: "Please try again later.",
                    variant: "destructive"
                });
            }
        };

        fetchProjects();
    }, [userDetails]);

    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-6">
                My Projects
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card
                        key={project.project_id}
                        className={`hover:shadow-lg transition-all duration-200 border-l-4 ${project.status === "active"
                            ? "border-l-green-500"
                            : "border-l-gray-400"
                            }`}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-bold">
                                    {project.name || "Untitled Project"}
                                </CardTitle>
                                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                    {project.status ? project.status : "Pending"}
                                </Badge>
                            </div>
                            <CardDescription>
                                {project.description
                                    ? truncateText(project.description, 30)
                                    : "No description available"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center text-lg font-semibold text-green-600 dark:text-green-400">
                                <IndianRupee className="h-5 w-5 mr-2" />
                                {project.requested_amount?.toLocaleString() || "N/A"}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <User className="h-4 w-4" />
                                    <span><strong>Student ID:</strong> {project.stud_id}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Briefcase className="h-4 w-4" />
                                    <span><strong>Company ID:</strong> {project.company_id || "Not Assigned"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <DollarSign className="h-4 w-4" />
                                    <span><strong>Approved Amount:</strong> {project.approved_amount !== null ? `₹${project.approved_amount.toLocaleString()}` : "Not Approved Yet"}</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <NavLink
                                className="w-full py-2 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                to={`/dashboard/student/my-projects/${project.project_id}`}
                            >
                                View Details
                            </NavLink>

                        </CardFooter>
                    </Card>
                ))}

            </div>
        </div>
    );
};

export default ViewAllProjects;
