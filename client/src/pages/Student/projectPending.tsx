import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, IndianRupee, User, Building, MessageSquare, CheckCircle, XCircle, Handshake, Video, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { approveFundingRequest, getFundingRequests, negotiateFundingRequest, rejectFundingRequest } from '@/api/studentsApi'
import Cookies from 'js-cookie'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FundingRequest {
    id: number;
    company_id: number;
    project_id: number;
    message: string;
    meeting_id: number;
    meet_link?: string;
    date_time?: string;
    meeting_status?: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    negotiate: number;
    negotiated_amount: number;
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

interface ConfirmationDialog {
    isOpen: boolean;
    type: 'approve' | 'reject' | 'negotiate' | null;
    requestId: number | null;
    companyName: string;
    projectId: number | null;
    amount: number;
}

const FundingPending = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([]);
    const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
        isOpen: false,
        type: null,
        requestId: null,
        companyName: '',
        projectId: null,
        amount: 0
    });
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await getFundingRequests(token);
                setFundingRequests(response);
                console.log(response)

            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch funding requests',
                    variant: 'destructive',
                });
            }
        };
        fetchData();
    }, [toast]);

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

    const openApproveDialog = (requestId: number, companyName: string, projectId: number, amount: number) => {
        setConfirmationDialog({
            isOpen: true,
            type: 'approve',
            requestId,
            companyName,
            projectId,
            amount
        });
    };

    const openRejectDialog = (requestId: number, companyName: string, amount: number) => {
        setConfirmationDialog({
            isOpen: true,
            type: 'reject',
            requestId,
            companyName,
            projectId: null,
            amount
        });
    };

    const openNegotiateDialog = (requestId: number, companyName: string, amount: number) => {
        setConfirmationDialog({
            isOpen: true,
            type: 'negotiate',
            requestId,
            companyName,
            projectId: null,
            amount
        });
    };

    const closeDialog = () => {
        setConfirmationDialog({
            isOpen: false,
            type: null,
            requestId: null,
            companyName: '',
            projectId: null,
            amount: 0
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmationDialog.requestId || !confirmationDialog.type) return;

        try {
            const token = Cookies.get('token');

            if (confirmationDialog.type === 'approve') {
                await approveFundingRequest({ requestId: confirmationDialog.requestId }, token);
                toast({
                    title: 'Approved',
                    description: `Approved funding request from ${confirmationDialog.companyName} and rejected others.`,
                });
            } else if (confirmationDialog.type === 'reject') {
                await rejectFundingRequest({ requestId: confirmationDialog.requestId }, token);
                toast({
                    title: 'Rejected',
                    description: `Rejected funding request from ${confirmationDialog.companyName}.`,
                    variant: 'destructive',
                });
            } else {
                await negotiateFundingRequest({ requestId: confirmationDialog.requestId }, token);
                toast({
                    title: 'Negotiate Offer',
                    description: `Negotiate request sent to ${confirmationDialog.companyName}.`,
                });
            }

            // Re-fetch updated data
            const refreshed = await getFundingRequests(token);
            setFundingRequests(refreshed);
            closeDialog();
        } catch (error) {
            toast({
                title: 'Error',
                description: `Something went wrong while ${confirmationDialog.type === 'approve' ? 'approving' : 'rejecting'} the request.`,
                variant: 'destructive',
            });
            closeDialog();
        }
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
                    <Card key={project.project_id} className="border-l-4 border-l-indigo-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                                            Requested: {formatCurrency(project.requested_amount)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="h-4 w-4" />
                                            Total offered: {formatCurrency(project.total_offered)}
                                        </div>
                                    </div>
                                </div>
                                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400 text-lg px-4 py-2">
                                    {project.requests.length} OFFER{project.requests.length > 1 ? 'S' : ''}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="space-y-0">
                                {project.requests.map((request, index) => (
                                    <div
                                        key={request.id}
                                        className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200 ${index !== project.requests.length - 1
                                            ? 'border-b border-gray-200 dark:border-gray-700'
                                            : ''
                                            }`}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {index + 1}. {request.company_name}
                                                    </h4>
                                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                        PENDING
                                                    </Badge>
                                                    {request.negotiate === 1 && (
                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-orange-400">
                                                            NEGOTIATING
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(request.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Company Message */}
                                        <div className="mb-6">
                                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                                Company Message:
                                            </h5>
                                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-l-blue-500">
                                                <p className="text-gray-700 dark:text-gray-300 italic">
                                                    "{request.message}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meeting Info */}
                                        {request.meet_link && request.meeting_status !== 'completed' && (
                                            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                                                <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                                                    <Video className="h-5 w-5 text-blue-600" />
                                                    Scheduled Meeting
                                                </h5>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <span className="text-blue-700 dark:text-blue-300 text-sm">
                                                        {request.date_time &&
                                                            new Date(request.date_time).toLocaleString('en-IN', {
                                                                timeZone: 'Asia/Kolkata',
                                                                weekday: 'short',
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })}
                                                    </span>

                                                    <a
                                                        href={request.meet_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        Join Meeting
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* ✅ Meeting Completed & Negotiated Offer */}
                                        {request.meeting_status === 'completed' && request.negotiated_amount && (
                                            <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300 dark:border-green-700 shadow-sm">
                                                <h5 className="font-medium text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    Meeting Completed
                                                </h5>
                                                <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                                                    The company has updated their offer after negotiation.
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                                                        New Offer: {formatCurrency(request.negotiated_amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Default Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Funding offer:{' '}
                                                <span className="font-semibold text-green-600 dark:text-green-400 text-xl">
                                                    {formatCurrency(request.amount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        openApproveDialog(
                                                            request.id,
                                                            request.company_name,
                                                            request.project_id,
                                                            request.amount
                                                        )
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Accept offer
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        openNegotiateDialog(
                                                            request.id,
                                                            request.company_name,
                                                            request.amount
                                                        )
                                                    }
                                                    disabled={request?.negotiate === 1}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    <Handshake className="h-4 w-4 mr-2" />
                                                    {request?.negotiate ? 'Negotiating' : 'Negotiate Offer'}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        openRejectDialog(
                                                            request.id,
                                                            request.company_name,
                                                            request.amount
                                                        )
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject Offer
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

            {
                filteredProjects.length === 0 && (
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
                )
            }

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmationDialog.isOpen} onOpenChange={closeDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            {confirmationDialog.type === 'approve' ?
                                'Accept Funding Offer' : confirmationDialog.type === 'reject' ?
                                    'Reject Funding Offer' : 'Negotiate Funding Offer'

                            }

                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            {confirmationDialog.type === 'approve' ? (
                                <>
                                    <p className="mb-3">
                                        Are you sure you want to accept the funding offer of{' '}
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(confirmationDialog.amount)}
                                        </span>{' '}
                                        from <strong>{confirmationDialog.companyName}</strong>?
                                    </p>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            ⚠️ <strong>Important:</strong> Accepting this offer will automatically reject all other funding offers for this project.
                                        </p>
                                    </div>
                                </>
                            ) : confirmationDialog.type === 'reject' ? (
                                <p>
                                    Are you sure you want to reject the funding offer of{' '}
                                    <span className="font-semibold text-red-600">
                                        {formatCurrency(confirmationDialog.amount)}
                                    </span>{' '}
                                    from <strong>{confirmationDialog.companyName}</strong>?
                                </p>
                            ) : <p>
                                Are you sure you want to Negotiate the funding offer of{' '}
                                <span className="font-semibold text-blue-600">
                                    {formatCurrency(confirmationDialog.amount)}
                                </span>{' '}
                                from <strong>{confirmationDialog.companyName}</strong>?
                            </p>}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            className={`
                                ${confirmationDialog.type === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : `${confirmationDialog.type === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}`}
                        >
                            {confirmationDialog.type === 'approve' ? (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept Offer
                                </>
                            ) : confirmationDialog.type === 'reject' ? (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Offer
                                </>
                            ) : <>
                                <Handshake className="h-4 w-4 mr-2" />
                                Negotiate Offer
                            </>}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

export default FundingPending