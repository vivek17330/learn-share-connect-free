
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Download, Book, FileText, Presentation, FolderOpen, Calendar, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  file_name: string;
  file_size: string;
  file_type: string;
  uploaded_by: string;
  upload_date: string;
  downloads: number;
  views: number;
}

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
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
    
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
        toast({
          title: "Error loading resources",
          description: "Failed to load educational resources.",
          variant: "destructive",
        });
      } else {
        setResources(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDownload = async (resource: Resource) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to download resources.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      // Update download count
      const { error } = await supabase
        .from('resources')
        .update({ downloads: resource.downloads + 1 })
        .eq('id', resource.id);

      if (error) {
        console.error('Error updating download count:', error);
      }

      // Simulate download
      toast({
        title: "Download Started",
        description: `Downloading ${resource.title}...`,
      });

      // Refresh resources to show updated download count
      fetchResources();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the resource.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "all", name: "All Resources", icon: Book },
    { id: "textbooks", name: "Textbooks", icon: Book },
    { id: "notes", name: "Notes", icon: FileText },
    { id: "presentations", name: "Presentations", icon: Presentation },
    { id: "projects", name: "Projects", icon: FolderOpen }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
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
          <p className="text-gray-600">Discover educational resources shared by students worldwide</p>
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
                    <Badge variant="outline">{resource.file_type}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {resource.uploaded_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(resource.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Size: {resource.file_size}</span>
                      <span>{resource.downloads} downloads</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{resource.subject}</Badge>
                    </div>

                    <Button 
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleDownload(resource)}
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

        {filteredResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                {resources.length === 0 
                  ? "No resources have been uploaded yet. Be the first to share!"
                  : "Try adjusting your search terms or browse different categories."
                }
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
