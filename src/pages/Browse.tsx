import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Download, Book, FileText, Presentation, FolderOpen, Calendar, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    }
  }, []);

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

  const handleDownload = (resourceTitle: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to download resources.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading ${resourceTitle}...`,
    });
  };

  const categories = [
    { id: "all", name: "All Resources", icon: Book },
    { id: "textbooks", name: "Textbooks", icon: Book },
    { id: "notes", name: "Notes", icon: FileText },
    { id: "presentations", name: "Presentations", icon: Presentation },
    { id: "projects", name: "Projects", icon: FolderOpen }
  ];

  const resources = [
    {
      id: 1,
      title: "Advanced Mathematics Textbook",
      description: "Comprehensive calculus and linear algebra textbook with solved examples",
      category: "textbooks",
      type: "PDF",
      size: "12.5 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2024-01-15",
      downloads: 1250,
      subject: "Mathematics"
    },
    {
      id: 2,
      title: "Physics Lab Notes - Quantum Mechanics",
      description: "Detailed lab notes covering quantum mechanics experiments and theory",
      category: "notes",
      type: "PDF",
      size: "4.2 MB",
      uploadedBy: "Mike Chen",
      uploadDate: "2024-01-12",
      downloads: 890,
      subject: "Physics"
    },
    {
      id: 3,
      title: "Computer Science Presentation - Algorithms",
      description: "PowerPoint presentation on sorting algorithms and complexity analysis",
      category: "presentations",
      type: "PPTX",
      size: "8.7 MB",
      uploadedBy: "Alex Rivera",
      uploadDate: "2024-01-10",
      downloads: 567,
      subject: "Computer Science"
    },
    {
      id: 4,
      title: "Web Development Project - E-commerce Site",
      description: "Complete React.js e-commerce project with backend API and database",
      category: "projects",
      type: "ZIP",
      size: "25.3 MB",
      uploadedBy: "Emma Davis",
      uploadDate: "2024-01-08",
      downloads: 342,
      subject: "Web Development"
    },
    {
      id: 5,
      title: "Biology Study Guide - Cell Structure",
      description: "Comprehensive study notes on cell biology and molecular structures",
      category: "notes",
      type: "PDF",
      size: "6.1 MB",
      uploadedBy: "David Wilson",
      uploadDate: "2024-01-05",
      downloads: 723,
      subject: "Biology"
    },
    {
      id: 6,
      title: "Marketing Strategy Presentation",
      description: "Business presentation on digital marketing strategies and case studies",
      category: "presentations",
      type: "PPTX",
      size: "11.4 MB",
      uploadedBy: "Lisa Park",
      uploadDate: "2024-01-03",
      downloads: 456,
      subject: "Business"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "textbooks": return Book;
      case "notes": return FileText;
      case "presentations": return Presentation;
      case "projects": return FolderOpen;
      default: return Book;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "textbooks": return "bg-blue-100 text-blue-800";
      case "notes": return "bg-green-100 text-green-800";
      case "presentations": return "bg-purple-100 text-purple-800";
      case "projects": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
              {user ? (
                <>
                  <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload</Link>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload</Link>
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Educational Resources</h1>
          <p className="text-gray-600">Discover thousands of free academic resources shared by students worldwide</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resources, subjects, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getIcon(resource.category);
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <Badge className={getCategoryColor(resource.category)}>
                        {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                      </Badge>
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {resource.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(resource.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Size: {resource.size}</span>
                      <span>{resource.downloads} downloads</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{resource.subject}</Badge>
                    </div>

                    <Button 
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleDownload(resource.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button onClick={() => {setSearchTerm(""); setSelectedCategory("all");}} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
