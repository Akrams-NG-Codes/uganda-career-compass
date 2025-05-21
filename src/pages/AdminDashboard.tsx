import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCareerCategories, createCareer, createCareerCategory, deleteCareer } from "@/services/supabaseService";
import { CareerCategory, Career } from "@/types/careerGuide";

const AdminDashboard = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject_combination: "",
    education_pathway: "",
    average_salary: "",
    career_category_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch categories
      const categoriesData = await getCareerCategories();
      
      if (categoriesData) {
        setCategories(categoriesData);
      }
      
      // Using getCareers from our service instead of direct Supabase query
      const careersData = await getCareers();
      setCareers(careersData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCareers = async (): Promise<Career[]> => {
    // Sample mock careers since we don't have a careers table in Supabase yet
    return [
      {
        id: "1",
        name: "Software Engineer",
        description: "Develops software applications using various programming languages and tools.",
        subject_combination: "Mathematics, Physics, Computer Studies",
        education_pathway: "Computer Science or Software Engineering degree",
        average_salary: "$70,000 - $150,000",
        career_category_id: "tech",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        career_categories: { id: "tech", name: "Technology", description: "Tech careers", created_at: new Date().toISOString() },
        matchScore: 95
      },
      {
        id: "2",
        name: "Doctor",
        description: "Diagnoses and treats patients with various health conditions.",
        subject_combination: "Biology, Chemistry, Physics",
        education_pathway: "Medical School and Residency",
        average_salary: "$200,000 - $500,000",
        career_category_id: "healthcare",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        career_categories: { id: "healthcare", name: "Healthcare", description: "Healthcare careers", created_at: new Date().toISOString() },
        matchScore: 90
      }
    ];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await createCareer({
        name: formData.name,
        description: formData.description,
        subject_combination: formData.subject_combination,
        education_pathway: formData.education_pathway,
        average_salary: formData.average_salary,
        career_category_id: formData.career_category_id || null,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Career added successfully",
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        subject_combination: "",
        education_pathway: "",
        average_salary: "",
        career_category_id: "",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error adding career:", error);
      toast({
        title: "Error",
        description: "Failed to add career",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    const categoryDescription = prompt("Enter category description (optional):");
    
    if (!categoryName) return;
    
    try {
      const { error } = await createCareerCategory(categoryName, categoryDescription || "");
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career?")) return;
    
    try {
      const { error } = await deleteCareer(id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Career deleted successfully",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error deleting career:", error);
      toast({
        title: "Error",
        description: "Failed to delete career",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center text-chatbot-blue hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-center text-chatbot-blue">Admin Dashboard</h1>
          <div></div> {/* Empty div for flexbox alignment */}
        </div>
        
        <Tabs defaultValue="careers">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="careers">Manage Careers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="careers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Career List */}
              <Card>
                <CardHeader>
                  <CardTitle>Career Database</CardTitle>
                  <CardDescription>Manage existing career data</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : careers.length === 0 ? (
                    <div className="text-center py-4">No careers found</div>
                  ) : (
                    <div className="space-y-4">
                      {careers.map((career) => (
                        <div key={career.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{career.name}</h3>
                              <div className="text-sm text-gray-500">
                                Category: {career.career_categories?.name || "None"}
                              </div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(career.id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="line-clamp-2">{career.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Add Career Form */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Add Career</CardTitle>
                      <CardDescription>Create a new career entry</CardDescription>
                    </div>
                    <Button size="sm" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Career Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        name="career_category_id"
                        value={formData.career_category_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject Combination</label>
                      <Input
                        name="subject_combination"
                        value={formData.subject_combination}
                        onChange={handleChange}
                        placeholder="e.g., Physics, Chemistry, Mathematics"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Education Pathway</label>
                      <Textarea
                        name="education_pathway"
                        value={formData.education_pathway}
                        onChange={handleChange}
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Average Salary</label>
                      <Input
                        name="average_salary"
                        value={formData.average_salary}
                        onChange={handleChange}
                        placeholder="e.g., $50,000 - $80,000"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Add Career
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>View insights about user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-500">Analytics Dashboard</h3>
                  <p className="text-gray-400 mt-2">
                    Analytics features will be implemented soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <h3 className="text-xl font-medium text-gray-500">User Management</h3>
                <p className="text-gray-400 mt-2 mb-4">
                  Manage users and their access levels
                </p>
                <Button asChild>
                  <Link to="https://supabase.com/dashboard/project/gcmmiphcftqvfgojhnfg/auth/users" target="_blank" rel="noopener noreferrer">
                    Manage Users in Supabase
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
