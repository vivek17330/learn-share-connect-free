
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Upload as UploadIcon, File, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    file: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin");
    if (userData) {
      setUser(JSON.parse(userData));
    } else if (adminData) {
      setUser(JSON.parse(adminData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Edu Market.",
    });
    navigate("/");
  };

  const categories = [
    { value: "textbooks", label: "Textbooks" },
    { value: "notes", label: "Study Notes" },
    { value: "presentations", label: "Presentations" },
    { value: "projects", label: "Project Files" }
  ];

  const allowedFileTypes = [
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedFileTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Please upload files with these extensions: ${allowedFileTypes.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedFileTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Please upload files with these extensions: ${allowedFileTypes.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.file) {
      toast({
        title: "Upload failed",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Get file extension for file_type
      const fileExtension = formData.file.name.split('.').pop()?.toUpperCase() || '';
      
      // Prepare resource data
      const resourceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subject: formData.subject,
        file_name: formData.file.name,
        file_size: formatFileSize(formData.file.size),
        file_type: fileExtension,
        uploaded_by: user?.email || 'Anonymous'
      };

      // Insert into database
      const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to save resource to database.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload successful!",
          description: "Your resource has been uploaded and is now available to the community.",
        });
        navigate("/browse");
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your resource.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Book className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Edu Market</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/browse" className="text-gray-700 hover:text-blue-600">Browse</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Educational Resource</h1>
          <p className="text-gray-600">Share your academic materials with the community and help fellow students succeed</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Resource Details</CardTitle>
            <CardDescription>
              Fill in the information about your educational resource
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Resource Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your resource"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this resource covers and how it can help other students"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Physics, Computer Science"
                    required
                  />
                </div>
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload File *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? "border-blue-500 bg-blue-50" 
                      : formData.file 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.file ? (
                    <div className="flex items-center justify-center space-x-4">
                      <File className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(formData.file.size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="ml-4"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP
                      </p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept={allowedFileTypes.join(',')}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline">
                          Select File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Maximum file size: 50MB. Ensure your file doesn't contain copyrighted material.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure your file is virus-free and safe to download</li>
                  <li>• Only upload content you have the right to share</li>
                  <li>• Provide accurate and helpful descriptions</li>
                  <li>• Respect copyright and intellectual property rights</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload Resource"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
