import { NavLink, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  FileText,
  ArrowLeft,
  Phone,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter as ModalFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fundProject, getProjectByIdForCompany } from "@/api/companyApi";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import Cookies from "js-cookie";
import { Textarea } from "@/components/ui/textarea";

const CompanyProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [amountToFund, setAmountToFund] = useState("");
  const [message, setMessage] = useState("");

  const { toast } = useToast();
  const { userDetails } = useUser();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = Cookies.get("token");
        const response = await getProjectByIdForCompany(id, token);
        setProject(response);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleFundRequest = async () => {
    const amountNum = parseFloat(amountToFund);
    if (isNaN(amountNum) || amountNum <= 0 ) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid funding amount.",
        variant: "destructive",
      });
      return;
    }

    if (message.trim().length <= 0) {
      toast({
        title: "Message Missing",
        description: "Please enter the message",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = Cookies.get("token");
      const res = await fundProject(
        {
          projectId: id,
          message: `We want to invest ₹${amountNum} in this project. ${message}`,
          amount: amountNum,
        },
        token
      );

      if (res.status === 200) {
        toast({ title: "Funding request sent!" });
        setOpenModal(false);
        setAmountToFund(""); // clear input
        setMessage("")
      } else {
        toast({ title: "Failed to send request", variant: "destructive" });
      }
    } catch (error) {
      console.error("Funding error:", error);
      toast({
        title: "Error",
        description: "Try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/dashboard/company/allprojects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
            </CardHeader>

            <CardContent className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="mr-2 text-blue-600" />
                  Description
                </h3>
                <p className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold flex items-center mb-1">
                    <User className="mr-2 text-blue-600" />
                    Student Name
                  </h4>
                  <p className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                    {project.stud_name}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center mb-1">
                    <Phone className="mr-2 text-blue-600" />
                    Student Phone
                  </h4>
                  <p className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                    {project.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center mb-1">
                    <IndianRupee className="mr-2 text-blue-600" />
                    Requested Amount
                  </h4>
                  <p className="bg-white dark:bg-gray-800 p-3 rounded-lg border font-bold text-blue-600 text-xl">
                    ₹ {project.requested_amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center mt-4">
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button className="w-80 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Fund this Project
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Funding Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enter the amount you want to fund for this project.
                    </p>
                    <Input
                      type="number"
                      placeholder="Enter amount (₹)"
                      value={amountToFund}
                      onChange={(e) => setAmountToFund(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enter why you are Interested!
                    </p>
                    <Textarea
                      placeholder="Enter message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <ModalFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpenModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFundRequest}>Confirm</Button>
                  </ModalFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProjectDetails;
