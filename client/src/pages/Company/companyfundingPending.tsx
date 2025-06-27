import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, DollarSign, User, Building, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FundingRequest {
  id: string
  project_id: string
  project_name: string
  student_name: string
  student_id: string
  company_name: string
  company_id: string
  offered_amount: number
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  project_description: string
}

const FundingPending = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Mock data - replace with actual API call
  const fundingRequests: FundingRequest[] = [
    {
      id: '1',
      project_id: 'proj_1',
      project_name: 'AI-Powered Learning Platform',
      student_name: 'John Doe',
      student_id: 'stud_123',
      company_name: 'TechCorp Inc.',
      company_id: 'comp_456',
      offered_amount: 50000,
      message: 'We are interested in funding your innovative AI project. This looks very promising!',
      status: 'pending',
      created_at: '2024-01-15',
      project_description: 'Developing an AI-powered platform to enhance student learning experiences with personalized content and adaptive learning paths.'
    },
    {
      id: '2',
      project_id: 'proj_2',
      project_name: 'Sustainable Energy Solution',
      student_name: 'Jane Smith',
      student_id: 'stud_124',
      company_name: 'GreenTech Solutions',
      company_id: 'comp_457',
      offered_amount: 75000,
      message: 'Your sustainable energy project aligns perfectly with our mission. We would love to support this initiative.',
      status: 'pending',
      created_at: '2024-01-12',
      project_description: 'Creating innovative solar panel technology for rural communities with improved efficiency and lower costs.'
    }
  ]

  const filteredRequests = fundingRequests.filter(request =>
    request.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleApprove = async (requestId: string, companyName: string) => {
    try {
      // API call would go here
      console.log('Approving funding request:', requestId)
      
      toast({
        title: "Funding Request Approved",
        description: `You have approved the funding request from ${companyName}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve funding request",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: string, companyName: string) => {
    try {
      // API call would go here
      console.log('Rejecting funding request:', requestId)
      
      toast({
        title: "Funding Request Rejected",
        description: `You have rejected the funding request from ${companyName}`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject funding request",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pending Funding Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and respond to funding offers from companies
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
                  {fundingRequests.filter(r => r.status === 'pending').length}
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
                  {formatCurrency(fundingRequests.reduce((sum, r) => sum + r.offered_amount, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Companies</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {new Set(fundingRequests.map(r => r.company_id)).size}
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

      {/* Funding Requests List */}
      <div className="space-y-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {request.project_name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {request.company_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(request.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(request.offered_amount)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  PENDING APPROVAL
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Description:</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {request.project_description}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Company Message:</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{request.message}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Funding offer: <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                    {formatCurrency(request.offered_amount)}
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
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