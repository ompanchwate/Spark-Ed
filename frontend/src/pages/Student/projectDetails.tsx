import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "@/app/api/studentsApi";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building2, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  FileText,
  ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EditProjectDialog } from "./EditProjectDialog";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = Cookies.get("token");
                const response = await getProjectById(id, token);
                console.log("Project details response:", response);
                setProject(response);
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const handleProjectUpdate = (updatedProject) => {
        setProject(updatedProject);
        setIsEditDialogOpen(false);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading project details...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
                        <Link to="/projects">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <Link to="/projects">
                                <Button variant="ghost" className="mb-4 text-blue-600 hover:text-blue-700">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Projects
                                </Button>
                            </Link>
                            <Button 
                                onClick={() => setIsEditDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Edit Project
                            </Button>
                        </div>

                        {/* Main Content */}
                        <Card className="border-2 border-opacity-50 border-blue-200 dark:border-blue-900 shadow-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {project.name}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(project.status || "pending")}>
                                                {project.status === 'approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                                                {project.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                                {project.status || "Pending"}
                                            </Badge>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ID: {project.project_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8">
                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                        Project Description
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                        {project.description}
                                    </p>
                                </div>

                                <Separator className="my-6" />

                                {/* Project Details Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Student Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                                            <User className="mr-2 h-4 w-4 text-blue-600" />
                                            Student Information
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Student ID</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{project.stud_id}</div>
                                        </div>
                                    </div>

                                    {/* Company Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                                            <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                                            Company Assignment
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Company ID</div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {project.company_id || "Not Assigned"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                                            <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                                            Requested Amount
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-2xl font-bold text-blue-600">
                                                ₹{project.requested_amount?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Approved Amount */}
                                    <div className="space-y-4">
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                            Approved Amount
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className={`text-2xl font-bold ${
                                                project.approved_amount !== null 
                                                    ? 'text-green-600' 
                                                    : 'text-gray-400'
                                            }`}>
                                                {project.approved_amount !== null 
                                                    ? `₹${project.approved_amount.toLocaleString()}`
                                                    : "Not Approved Yet"
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <EditProjectDialog 
                project={project}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onProjectUpdate={handleProjectUpdate}
            />
        </>
    );
};

export default ProjectDetails;