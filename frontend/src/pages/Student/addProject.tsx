import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { addProject } from "@/app/api/api";
import Cookies from "js-cookie";
import { useUser } from '@/context/UserContext';

type FormValues = {
    name: string;
    description: string;
    requestedAmount: string;
};

const AddProject = () => {
    const { toast } = useToast();
    const { userDetails } = useUser();

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
            requestedAmount: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        const token = Cookies.get("token");
        const payload = { ...values, stud_id: userDetails?.userDetails?.stud_id }
        const res = await addProject(payload, token)
        if (res.status !== 201) {
            toast({
                title: "Project submitted!",
                description: "Your project has been submitted successfully.",
            });
            form.reset();
        }
        else {
            toast({
                title: "Error",
                description: "There was an error submitting your project. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <div className=" pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Add New Project
                        </h1>
                        <p className="text-muted-foreground">Share your innovative idea and request funding</p>
                    </div>

                    <Card className="border-2 border-opacity-50 border-blue-200 dark:border-blue-900 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 pb-8">

                            <h2 className="text-xl font-semibold text-center">Project Details</h2>
                        </CardHeader>

                        <CardContent className="pt-6 px-8">
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
                                            minLength: { value: 50, message: "Must be at least 50 characters" },
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
                                        name="requestedAmount"
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

                                    <CardFooter className="px-0 pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6"
                                        >
                                            <Plus className="mr-2 h-5 w-5" />
                                            Submit Project
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Your project will be reviewed within 48 hours after submission</p>
                    </div>
                </div>
            </div >
        </>
    );
};

export default AddProject;