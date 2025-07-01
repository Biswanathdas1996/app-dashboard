import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/rich-text-editor";
import { FileUpload } from "@/components/file-upload";
import { LogoUpload } from "@/components/logo-upload";
import { useCreateRequisition } from "@/hooks/use-requisitions";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import { insertProjectRequisitionSchema } from "@shared/schema";
import type { InsertProjectRequisition } from "@shared/schema";

const formSchema = insertProjectRequisitionSchema.extend({
  expectedDelivery: z.string().optional(),
});

export function ProjectRequisitionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createRequisition = useCreateRequisition();
  const { data: categories } = useCategories();

  const form = useForm<InsertProjectRequisition>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requesterName: "",
      requesterEmail: "",
      priority: "medium",
      category: "",
      expectedDelivery: "",
      attachments: [],
      logo: "",
      isPrivate: false,
    },
  });

  const onSubmit = async (data: InsertProjectRequisition) => {
    setIsSubmitting(true);
    try {
      await createRequisition.mutateAsync(data);
      toast({
        title: "Success",
        description: "Your project requisition has been submitted successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project requisition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4">
            <CardTitle className="text-xl font-bold">
              Project Requisition
            </CardTitle>
            <CardDescription className="text-white/90 text-sm">
              Submit your project requirements for review
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Project Title *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter project title"
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Category *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Priority *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Requester Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="requesterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Your Name *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name"
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requesterEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="Enter your email address"
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Logo Upload */}
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Project Logo (Optional)
                          </FormLabel>
                          <FormControl>
                            <LogoUpload
                              logo={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedDelivery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Expected Delivery
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Project Description *
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Describe your project requirements, objectives, and expected outcomes..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Attachments */}
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Supporting Documents
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            files={field.value}
                            onChange={field.onChange}
                            maxFiles={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mark as Private Switch */}
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Mark as Private
                          </FormLabel>
                          <div className="text-xs text-gray-500">
                            Private requests are only visible to administrators and the requester
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}