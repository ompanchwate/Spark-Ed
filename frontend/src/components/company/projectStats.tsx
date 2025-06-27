import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CircleCheckBig, GraduationCap, ListTodo, PlusCircle, Users, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

const ProjectStats = () => {
    const navigate = useNavigate()

    // Mock data - replace with actual data from your API
    const stats = {
        pendingProjects: 12,
        fundedProjects: 28,
        totalInvested: 450000
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Project Funding Pending */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/30 rounded-full -translate-y-10 translate-x-10"></div>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <ListTodo className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.pendingProjects}
                                </p>
                                <p className="text-xs text-blue-500 dark:text-blue-300 font-medium">
                                    +3 this week
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="mb-4">
                            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                Funding Pending
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Projects awaiting review
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/dashboard/company/pending-projects')}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            View Pending
                        </Button>
                    </CardContent>
                </Card>

                {/* Projects Funded */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 dark:bg-green-800/30 rounded-full -translate-y-10 translate-x-10"></div>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <CircleCheckBig className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {stats.fundedProjects}
                                </p>
                                <p className="text-xs text-green-500 dark:text-green-300 font-medium">
                                    +5 this month
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="mb-4">
                            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                Projects Funded
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Successfully approved projects
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/funded-projects')}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            View Funded
                        </Button>
                    </CardContent>
                </Card>

                {/* Total Amount Invested */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 dark:bg-purple-800/30 rounded-full -translate-y-10 translate-x-10"></div>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {formatCurrency(stats.totalInvested)}
                                </p>
                                <div className="flex items-center justify-end gap-1">
                                    <TrendingUp className="h-3 w-3 text-purple-500" />
                                    <p className="text-xs text-purple-500 dark:text-purple-300 font-medium">
                                        +12% growth
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="mb-4">
                            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                Total Invested
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Cumulative funding provided
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/investment-analytics')}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            View Analytics
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProjectStats;