import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Search,
    Calendar,
    IndianRupee,
    User,
    Handshake,
    Video,
    Send,
    ExternalLink,
    CheckCheck,
    CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getNegotiationRequest, markMeetingAsCompleted, scheduleMeetForNegotiation, submitUpdatedOffer } from '@/api/companyApi'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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

interface MeetingDialog {
    isOpen: boolean;
    requestId: number | null;
    studentName: string;
    companyName: string;
}

interface UpdateOfferDialog {
    isOpen: boolean;
    requestId: number | null;
    currentAmount: number;
    studentName: string;
    companyName: string;
    newAmount: string;
    comments: string;
}

interface CompletionDialog {
    isOpen: boolean;
    requestId: number | null;
    studentName: string;
    companyName: string;
}

const Negotiation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([]);
    const [meetingDialog, setMeetingDialog] = useState<MeetingDialog>({
        isOpen: false,
        requestId: null,
        studentName: '',
        companyName: ''
    });
    const [updateOfferDialog, setUpdateOfferDialog] = useState<UpdateOfferDialog>({
        isOpen: false,
        requestId: null,
        currentAmount: 0,
        studentName: '',
        companyName: '',
        newAmount: '',
        comments: ''
    });
    const [completionDialog, setCompletionDialog] = useState<CompletionDialog>({
        isOpen: false,
        requestId: null,
        studentName: '',
        companyName: ''
    });
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const token = Cookies.get('token');
            const response = await getNegotiationRequest(token);
            console.log(response)
            // Filter only negotiation requests
            const negotiationRequests = response.filter((req: FundingRequest) => req.negotiate === 1);
            setFundingRequests(negotiationRequests);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch negotiation requests',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [toast]);

    // Group projects by project_id
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
        project.student_name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const scheduleMeeting = async () => {
        if (!meetingDate || !meetingTime || !meetingDialog.requestId) {
            toast({
                title: "Error",
                description: "Please select date, time, and request ID.",
                variant: "destructive"
            });
            return;
        }

        const token = Cookies.get("token");
        try {
            const funding_request_id = meetingDialog.requestId
            const date = meetingDate;
            const time = meetingTime
            await scheduleMeetForNegotiation({ funding_request_id, date, time }, token)

            toast({
                title: "Success",
                description: "Meeting scheduled successfully."
            });

            fetchData();

            setMeetingDialog({ isOpen: false, requestId: null, studentName: "", companyName: "" });
            setMeetingDate("");
            setMeetingTime("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to schedule meeting.",
                variant: "destructive"
            });
        }
    };

    const markMeetingCompleted = async () => {
        if (!completionDialog.requestId) return;

        try {
            const token = Cookies.get('token');
            console.log(completionDialog.requestId)
            await markMeetingAsCompleted({ meetingId: completionDialog.requestId }, token);

            toast({
                title: 'Meeting Completed',
                description: `Meeting marked as completed. You can now update your offer.`,
            });

            setCompletionDialog({
                isOpen: false,
                requestId: null,
                studentName: '',
                companyName: ''
            });

            fetchData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to mark meeting as completed',
                variant: 'destructive',
            });
        }
    };

    // Update offer after meeting
    const updateOffer = async () => {
        if (!updateOfferDialog.newAmount || !updateOfferDialog.requestId) {
            toast({
                title: 'Error',
                description: 'Please enter a valid amount',
                variant: 'destructive',
            });
            return;
        }

        try {
            // Submit updated offer via API
            const token = Cookies.get('token');
            await submitUpdatedOffer({
                requestId: updateOfferDialog.requestId,
                newAmount: parseFloat(updateOfferDialog.newAmount),
                comments: updateOfferDialog.comments
            }, token)

            // await submitUpdatedOffer({
            //     requestId: updateOfferDialog.requestId,
            //     newAmount: parseFloat(updateOfferDialog.newAmount),
            //     comments: updateOfferDialog.comments
            // }, authToken);

            toast({
                title: 'Offer Updated',
                description: `Updated offer sent to ${updateOfferDialog.studentName}`,
            });

            setUpdateOfferDialog({
                isOpen: false,
                requestId: null,
                currentAmount: 0,
                studentName: '',
                companyName: '',
                newAmount: '',
                comments: ''
            });

            // Refresh data
            fetchData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update offer',
                variant: 'destructive',
            });
        }
    };


    const totalNegotiationRequests = fundingRequests.length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl mt-16 mb-2">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Negotiation Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage funding negotiations with students and schedule meetings
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search projects or students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Active Negotiations</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                    {totalNegotiationRequests}
                                </p>
                            </div>
                            <Handshake className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Projects with Negotiation Requests */}
            <div className="space-y-8">
                {filteredProjects.map((project) => (
                    <Card key={project.project_id} className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
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
                                            <User className="h-4 w-4" />
                                            Student: {project.student_name}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="h-4 w-4" />
                                            Requested: {formatCurrency(project.requested_amount)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="h-4 w-4" />
                                            Current offer: {formatCurrency(project.total_offered)}
                                        </div>
                                    </div>
                                </div>
                                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-lg px-4 py-2">
                                    NEGOTIATION
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="space-y-0">
                                {project.requests.map((request, index) => (
                                    <div
                                        key={request.id}
                                        className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200 ${index !== project.requests.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {request.company_name}
                                                    </h4>
                                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                                        NEGOTIATING
                                                    </Badge>
                                                    {request.meet_link && request.meeting_status !== 'completed' && (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                            MEETING SCHEDULED
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

                                        <div className="mb-6">
                                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Student's Negotiation Request:</h5>
                                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-l-amber-500">
                                                <p className="text-gray-700 dark:text-gray-300 italic">
                                                    Student has requested to negotiate the current offer of {formatCurrency(request.amount)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meeting Information */}
                                        {request.meet_link && request.meeting_status !== 'completed' && (
                                            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                                                <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                                                    <Video className="h-5 w-5 text-blue-600" />
                                                    Scheduled Meeting
                                                </h5>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <span className="text-blue-700 dark:text-blue-300 text-sm">
                                                        {request.date_time && new Date(request.date_time).toLocaleString("en-IN", {
                                                            timeZone: "Asia/Kolkata",
                                                            weekday: "short",
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true
                                                        })}
                                                    </span>

                                                    <div className='flex space-x-4'>
                                                        <a
                                                            href={request.meet_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                            Join Meeting
                                                        </a>

                                                        <Button
                                                            onClick={() => setCompletionDialog({
                                                                isOpen: true,
                                                                requestId: request.meeting_id,
                                                                studentName: project.student_name,
                                                                companyName: request.company_name
                                                            })}
                                                            className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 border-2 border-blue-500"
                                                        >
                                                            <CheckCheck className="h-4 w-4" />
                                                            Mark as Completed
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Meeting Completed Status */}
                                        {request.meeting_status === 'completed' && (
                                            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                            <CheckCircle className="h-6 w-6 text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">
                                                            Meeting Completed Successfully
                                                        </h5>
                                                        <p className="text-green-700 dark:text-green-400 text-sm">
                                                            The negotiation meeting has been marked as completed. You can now update your funding offer.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Current offer: <span className="font-semibold text-orange-600 dark:text-orange-400 text-xl">
                                                    {formatCurrency(request.amount)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {!request.meet_link ? (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                onClick={() => setMeetingDialog({
                                                                    isOpen: true,
                                                                    requestId: request.id,
                                                                    studentName: project.student_name,
                                                                    companyName: request.company_name
                                                                })}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                                                            >
                                                                <Video className="h-4 w-4 mr-2" />
                                                                Schedule Meeting
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Schedule Negotiation Meeting</DialogTitle>
                                                                <DialogDescription>
                                                                    Schedule a meeting with {project.student_name} to discuss the funding offer.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="meeting-date">Meeting Date</Label>
                                                                    <Input
                                                                        id="meeting-date"
                                                                        type="date"
                                                                        value={meetingDate}
                                                                        onChange={(e) => setMeetingDate(e.target.value)}
                                                                        min={new Date().toISOString().split('T')[0]}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="meeting-time">Meeting Time</Label>
                                                                    <Input
                                                                        id="meeting-time"
                                                                        type="time"
                                                                        value={meetingTime}
                                                                        onChange={(e) => setMeetingTime(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    onClick={() => {
                                                                        setMeetingDialog({ isOpen: false, requestId: null, studentName: '', companyName: '' });
                                                                        setMeetingDate('');
                                                                        setMeetingTime('');
                                                                    }}
                                                                    variant="outline"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={scheduleMeeting}>
                                                                    <Calendar className="h-4 w-4 mr-2" />
                                                                    Schedule Meeting
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-gray-500 dark:text-gray-400">Negotiated Amount:</span>
                                                            <span className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                                                                {formatCurrency(request.negotiated_amount || 0)}
                                                            </span>
                                                        </div>

                                                        <Button
                                                            disabled={!request.meeting_status}
                                                            onClick={() =>
                                                                setUpdateOfferDialog({
                                                                    isOpen: true,
                                                                    requestId: request.id,
                                                                    currentAmount: request.amount,
                                                                    studentName: project.student_name,
                                                                    companyName: request.company_name,
                                                                    newAmount: '',
                                                                    comments: '',
                                                                })
                                                            }
                                                            className={`px-4 py-2 flex items-center gap-2 ${request.meeting_status
                                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <Send className="h-4 w-4" />
                                                            {request.meeting_status ? 'Update Offer' : 'Complete Meeting First'}
                                                        </Button>
                                                    </>

                                                )}
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
                        <Handshake className="h-12 w-12 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Active Negotiations
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No students have requested negotiations at the moment'}
                    </p>
                </div>
            )}

            {/* Update Offer Dialog */}
            <Dialog
                open={updateOfferDialog.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setUpdateOfferDialog({
                        isOpen: false,
                        requestId: null,
                        currentAmount: 0,
                        studentName: "",
                        companyName: "",
                        newAmount: "",
                        comments: "",
                    })
                }
            >
                <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Update Funding Offer
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
                            Update your funding offer for{" "}
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                                {updateOfferDialog.studentName}
                            </span>{" "}
                            after the negotiation meeting.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 pt-4">
                        {/* Current Offer */}
                        <div>
                            <Label className="text-gray-700 dark:text-gray-300 text-sm">
                                Current Offer
                            </Label>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                                {formatCurrency(updateOfferDialog.currentAmount)}
                            </div>
                        </div>

                        {/* New Offer */}
                        <div>
                            <Label
                                htmlFor="new-amount"
                                className="text-gray-700 dark:text-gray-300 text-sm"
                            >
                                New Offer Amount (₹)
                            </Label>
                            <Input
                                id="new-amount"
                                type="number"
                                placeholder="Enter new amount"
                                className="mt-1 border-gray-300 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                value={updateOfferDialog.newAmount}
                                onChange={(e) =>
                                    setUpdateOfferDialog((prev) => ({
                                        ...prev,
                                        newAmount: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Comments */}
                        <div>
                            <Label
                                htmlFor="comments"
                                className="text-gray-700 dark:text-gray-300 text-sm"
                            >
                                Comments (Optional)
                            </Label>
                            <Textarea
                                id="comments"
                                placeholder="Add any comments about the updated offer..."
                                className="mt-1 border-gray-300 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                value={updateOfferDialog.comments}
                                onChange={(e) =>
                                    setUpdateOfferDialog((prev) => ({
                                        ...prev,
                                        comments: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            onClick={() =>
                                setUpdateOfferDialog({
                                    isOpen: false,
                                    requestId: null,
                                    currentAmount: 0,
                                    studentName: "",
                                    companyName: "",
                                    newAmount: "",
                                    comments: "",
                                })
                            }
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={updateOffer}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send Updated Offer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Meeting Completion Confirmation Dialog */}
            <AlertDialog open={completionDialog.isOpen} onOpenChange={(open) =>
                !open && setCompletionDialog({
                    isOpen: false,
                    requestId: null,
                    studentName: '',
                    companyName: ''
                })
            }>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Mark Meeting as Completed
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            <p className="mb-3">
                                Are you sure you want to mark the meeting with{' '}
                                <strong>{completionDialog.studentName}</strong> as completed?
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    ℹ️ <strong>Note:</strong> Once marked as completed, you'll be able to submit an updated funding offer to the student.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCompletionDialog({
                            isOpen: false,
                            requestId: null,
                            studentName: '',
                            companyName: ''
                        })}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={markMeetingCompleted}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark as Completed
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Negotiation