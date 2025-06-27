
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, IndianRupee, User, Building, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getFundingRequests } from '@/api/studentsApi'
import Cookies from 'js-cookie'

interface FundingRequest {
    id: number;
    company_id: number;
    project_id: number;
    message: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: string;
    company_name: string;
    project_name: string;
    project_description: string;
    requested_amount: number;
    student_name: string;
    student_id: number;
}

interface GroupedProject {
    project_id: number;
    project_name: string;
    project_description: string;
    student_name: string;
    student_id: number;
    requests: FundingRequest[];
    total_offered: number;
    requested_amount: number;
    latest_request_date: string;
}

const FundingPending = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fundingRequests, setFundingRequests] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await getFundingRequests(token);
                setFundingRequests(response);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch funding requests',
                    variant: 'destructive',
                });
            }
        };
        fetchData();
    }, []);

    const groupedProjects: GroupedProject[] = fundingRequests.reduce((acc: GroupedProject[], request) => {
        const existing = acc.find((p) => p.project_id === request.project_id);
        if (existing) {
            existing.requests.push(request);
            existing.total_offered += request.amount;
            if (new Date(request.timestamp) > new Date(existing.latest_request_date)) {
                existing.latest_request_date = request.timestamp;
            }
        } else {
            acc.push({
                project_id: request.project_id,
                project_name: request.project_name,
                project_description: request.project_description,
                student_name: request.student_name,
                student_id: request.student_id,
                requests: [request],
                total_offered: request.amount,
                requested_amount: request.requested_amount,
                latest_request_date: request.timestamp,
            });
        }
        return acc;
    }, []);

    const filteredProjects = groupedProjects.filter((project) =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.requests.some((r) => r.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const handleApprove = async (requestId: number, companyName: string) => {
        toast({
            title: 'Approved',
            description: `Approved funding request from ${companyName}`,
        });
    };

    const handleReject = async (requestId: number, companyName: string) => {
        toast({
            title: 'Rejected',
            description: `Rejected funding request from ${companyName}`,
            variant: 'destructive',
        });
    };

    const totalPendingRequests = fundingRequests.filter((r) => r.status === 'pending').length;
    const totalOfferedAmount = fundingRequests.reduce((sum, r) => sum + r.amount, 0);
    const uniqueCompanies = new Set(fundingRequests.map((r) => r.company_id)).size;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl mt-16 mb-2">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Pending Funding Requests
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Review and respond to funding offers from companies for your projects
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Pending Requests</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {totalPendingRequests}
                                </p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Offered</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {formatCurrency(totalOfferedAmount)}
                                </p>
                            </div>
                            <IndianRupee className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Companies</p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                    {uniqueCompanies}
                                </p>
                            </div>
                            <Building className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by project name or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Projects with Funding Requests */}
            <div className="space-y-8">
                {filteredProjects.map((project) => (
                    <Card key={project.project_id} className="border-l-4 border-l-indigo-500">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {project.project_name}
                                    </CardTitle>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                        {project.project_description}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">

                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            {project.requests.length} funding request{project.requests.length > 1 ? 's' : ''}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="h-4 w-4" />
                                            Requested Amount : {formatCurrency(project.requested_amount)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="h-4 w-4" />
                                            Total offered: {formatCurrency(project.total_offered)}
                                        </div>
                                    </div>
                                </div>
                                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                                    {project.requests.length} OFFER{project.requests.length > 1 ? 'S' : ''}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="space-y-0">
                                {project.requests.map((request, index) => (
                                    <div
                                        key={request.id}
                                        className={`p-6 ${index !== project.requests.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {index + 1}. {request.company_name}
                                                    </h4>
                                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                        PENDING
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(request.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Company Message:</h5>
                                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-l-blue-500">
                                                <p className="text-gray-700 dark:text-gray-300 italic">
                                                    "{request.message}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Funding offer: <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                                                    {formatCurrency(request.amount)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleReject(request.id, request.company_name)}
                                                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject Offer
                                                </Button>
                                                <Button
                                                    onClick={() => handleApprove(request.id, request.company_name)}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Accept Funding
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-600 mb-4">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No funding requests found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search criteria' : 'You have no pending funding requests at the moment'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default FundingPending