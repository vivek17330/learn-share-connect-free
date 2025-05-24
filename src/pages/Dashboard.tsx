
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Upload, Download, Users, BarChart3, Settings, LogOut, FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Resource {
  id: string;
  title: string;
  category: string;
  upload_date: string;
  downloads: number;
  views: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userUploads, setUserUploads] = useState<Resource[]>([]);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalDownloads: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin");
    if (!userData && !adminData) {
      navigate("/login");
    } else {
      const currentUser = userData ? JSON.parse(userData) : JSON.parse(adminData);
      setUser(currentUser);
      fetchUserData(currentUser.email);
    }
  }, [navigate]);

  const fetchUserData = async (userEmail: string) => {
    try {
      // Fetch user's uploads
      const { data: uploads, error: uploadsError } = await supabase
        .from('resources')
        .select('*')
        .eq('uploaded_by', userEmail)
        .order('upload_date', { ascending: false });

      if (uploadsError) {
        console.error('Error fetching uploads:', uploadsError);
      } else {
        setUserUploads(uploads || []);
        
        // Calculate stats
        const totalUploads = uploads?.length || 0;
        const totalDownloads = uploads?.reduce((sum, item) => sum + item.downloads, 0) || 0;
        const totalViews = uploads?.reduce((sum, item) => sum + item.views, 0) || 0;
        
        setStats({
          totalUploads,
          totalDownloads,
          totalViews
        });
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
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Edu Market.",
    });
    navigate("/");
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) {
        console.error('Error deleting resource:', error);
        toast({
          title: "Delete failed",
          description: "Failed to delete the resource.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Resource deleted",
          description: "The resource has been successfully deleted.",
        });
        // Refresh user data
        if (user) {
          fetchUserData(user.email);
        }
      }
    } catch (error) {
      console.error('Error:', error);
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

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { title: "Resources Uploaded", value: stats.totalUploads.toString(), icon: Upload, color: "text-blue-600" },
    { title: "Total Downloads", value: stats.totalDownloads.toLocaleString(), icon: Download, color: "text-green-600" },
    { title: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-purple-600" },
    { title: "Community Impact", value: "Active", icon: Users, color: "text-orange-600" }
  ];

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
              <Link to="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.email}!
          </h1>
          <p className="text-gray-600">Manage your uploads and track your impact in the community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Uploads */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Uploads ({userUploads.length})
                </CardTitle>
                <CardDescription>
                  Manage your uploaded educational resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userUploads.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
                    <p className="text-gray-600 mb-4">Start sharing your educational resources with the community!</p>
                    <Link to="/upload">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your First Resource
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userUploads.map((upload) => (
                      <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{upload.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(upload.category)}>
                              {upload.category.charAt(0).toUpperCase() + upload.category.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {upload.downloads} downloads
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {upload.views} views
                            </span>
                            <span>Uploaded {new Date(upload.upload_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteResource(upload.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6">
                      <Link to="/upload">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Resource
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/upload">
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button className="w-full justify-start" variant="outline">
                    <Book className="h-4 w-4 mr-2" />
                    Browse Market
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-medium">Today</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Community Impact</p>
                    <p className="font-medium">Helped {stats.totalDownloads} downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
