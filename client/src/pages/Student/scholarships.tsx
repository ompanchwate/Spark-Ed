import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock scholarship data
const scholarshipData = [
  {
    id: 1,
    name: "STEM Excellence Scholarship",
    description: "For students pursuing degrees in Science, Technology, Engineering, or Mathematics with outstanding academic achievements and demonstrated passion for innovation.",
    amount: 10000,
    eligibility: "3.5 GPA, STEM major, undergraduate",
    company: "TechFuture Foundation",
    status: "active",
    deadline: "2025-06-15"
  },
  {
    id: 2,
    name: "Global Leadership Award",
    description: "Supporting future leaders with international experience and commitment to global challenges. Candidates must demonstrate leadership potential and community involvement.",
    amount: 15000,
    eligibility: "Leadership experience, international focus",
    company: "World Education Alliance",
    status: "active",
    deadline: "2025-07-01"
  },
  {
    id: 3,
    name: "Creative Arts Fellowship",
    description: "For talented students in visual arts, music, theater, film, or creative writing who show exceptional promise and dedication to their craft.",
    amount: 8000,
    eligibility: "Portfolio submission, arts major",
    company: "Arts Forward Initiative",
    status: "inactive",
    deadline: "2025-05-30"
  },
  {
    id: 4,
    name: "First-Generation Scholar Grant",
    description: "Supporting first-generation college students who demonstrate financial need and academic potential to succeed in higher education.",
    amount: 12500,
    eligibility: "First-generation, financial need",
    company: "Opportunity Foundation",
    status: "active",
    deadline: "2025-06-30"
  },
  {
    id: 5,
    name: "Environmental Sustainability Scholarship",
    description: "For students committed to environmental studies and sustainable development who have demonstrated involvement in environmental initiatives.",
    amount: 9000,
    eligibility: "Environmental focus, community project",
    company: "Green Future Fund",
    status: "active",
    deadline: "2025-07-15"
  },
  {
    id: 6,
    name: "Healthcare Heroes Fund",
    description: "Supporting students pursuing careers in healthcare professions who demonstrate academic excellence and commitment to serving underserved communities.",
    amount: 11000,
    eligibility: "Healthcare major, community service",
    company: "MedPath Association",
    status: "inactive",
    deadline: "2025-06-01"
  }
];

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const Scholarships = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Available Scholarships</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">Explore scholarships that can help fund your education journey</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarshipData.map((scholarship) => (
            <Card 
              key={scholarship.id} 
              className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                scholarship.status === "active" 
                  ? "border-l-green-500" 
                  : "border-l-gray-400"
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{scholarship.name}</CardTitle>
                  <Badge variant={scholarship.status === "active" ? "default" : "secondary"}>
                    {scholarship.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{truncateText(scholarship.description, 100)}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-lg font-semibold text-green-600 dark:text-green-400">
                  <DollarSign className="h-5 w-5 mr-2" />
                  ${scholarship.amount.toLocaleString()}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span><strong>Eligibility:</strong> {scholarship.eligibility}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span><strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Briefcase className="h-4 w-4" />
                    <span><strong>Posted by:</strong> {scholarship.company}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={scholarship.status !== "active"}
                >
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Scholarships;