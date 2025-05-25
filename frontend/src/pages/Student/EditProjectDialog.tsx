import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type FormValues = {
  name: string;
  description: string;
  requested_amount: string;
};

interface EditProjectDialogProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdate: (updatedProject: any) => void;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  open,
  onOpenChange,
  onProjectUpdate
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      requested_amount: project?.requested_amount?.toString() || "",
    },
  });

  React.useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        requested_amount: project.requested_amount?.toString() || "",
      });
    }
  }, [project, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Here you would typically make an API call to update the project
      // For now, we'll just simulate the update
      const updatedProject = {
        ...project,
        name: values.name,
        description: values.description,
        requested_amount: Number(values.requested_amount),
      };
      
      onProjectUpdate(updatedProject);
      
      toast({
        title: "Project updated!",
        description: "Your project has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Project Details
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Project name is required",
                minLength: { value: 3, message: "Must be at least 3 characters" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project name" 
                      {...field} 
                      className="border-blue-200 dark:border-blue-900 focus:border-purple-400 transition-all" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              rules={{
                required: "Description is required",
                minLength: { value: 20, message: "Must be at least 20 characters" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project in detail" 
                      className="min-h-40 border-blue-200 dark:border-blue-900 focus:border-purple-400 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requested_amount"
              rules={{
                required: "Amount is required",
                validate: (value) =>
                  (!isNaN(Number(value)) && Number(value) > 0) || "Amount must be a positive number",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Requested Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="0.00" 
                      {...field}
                      className="border-blue-200 dark:border-blue-900 focus:border-purple-400 transition-all" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Update Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};