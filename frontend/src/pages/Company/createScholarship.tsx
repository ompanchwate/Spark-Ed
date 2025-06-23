import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// import { createScholarship } from "@/api/api";

const CreateScholarship = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    eligibility_criteria: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const scholarshipData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
    //   await createScholarship(scholarshipData);
      
      toast({
        title: "Success!",
        description: "Scholarship created successfully",
        variant: "default"
      });
      
      // Redirect to scholarships page
      navigate("/scholarships");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scholarship. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 pb-40">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create New Scholarship
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Help students achieve their dreams by offering educational opportunities
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Award className="h-8 w-8" />
              Scholarship Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scholarship Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-medium dark:text-gray-200">
                  Scholarship Name
                </Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., STEM Excellence Scholarship"
                    className="pl-10 h-12 text-lg border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-medium dark:text-gray-200">
                  Description
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the scholarship purpose, goals, and what makes it special..."
                    className="w-full pl-10 p-3 min-h-[120px] text-lg border-2 rounded-md focus:border-blue-500 focus:outline-none resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-lg font-medium dark:text-gray-200">
                  Scholarship Amount (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="10000"
                    className="pl-10 h-12 text-lg border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    min="0"
                    step="100"
                    required
                  />
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2">
                <Label htmlFor="eligibility_criteria" className="text-lg font-medium dark:text-gray-200">
                  Eligibility Criteria
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="eligibility_criteria"
                    name="eligibility_criteria"
                    value={formData.eligibility_criteria}
                    onChange={handleChange}
                    placeholder="e.g., 3.5 GPA minimum, STEM major, undergraduate student, financial need..."
                    className="w-full pl-10 p-3 min-h-[100px] text-lg border-2 rounded-md focus:border-blue-500 focus:outline-none resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? "Creating Scholarship..." : "Create Scholarship"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateScholarship;