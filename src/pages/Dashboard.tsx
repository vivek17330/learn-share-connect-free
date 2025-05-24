
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Upload, Download, Users, BarChart3, Settings, LogOut, FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Edu Market.",
    });
    navigate("/");
  };

  const stats = [
    { title: "Resources Uploaded", value: "12", icon: Upload, color: "text-blue-600" },
    { title: "Total Downloads", value: "1,247", icon: Download, color: "text-green-600" },
    { title: "Community Points", value: "856", icon: BarChart3, color: "text-purple-600" },
    { title: "Profile Views", value: "324", icon: Users, color: "text-orange-600" }
  ];

  const myUploads = [
    {
      id: 1,
      title: "Advanced Calculus Textbook",
      category: "textbooks",
      uploadDate: "2024-01-15",
      downloads: 523,
      views: 1200,
      status: "active"
    },
    {
      id: 2,
      title: "Physics Lab Notes - Quantum Mechanics",
      category: "notes",
      uploadDate: "2024-01-12",
      downloads: 342,
      views: 890,
      status: "active"
    },
    {
      id: 3,
      title: "Web Development Project Files",
      category: "projects",
      uploadDate: "2024-01-08",
      downloads: 198,
      views: 456,
      status: "pending"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "textbooks": return "bg-blue-100 text-blue-800";
      case "notes": return "bg-green-100 text-green-800";
      case "presentations": return "bg-purple-100 text-purple-800";
      case "projects": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          {stats.map((stat, index) => {
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
                  My Uploads
                </CardTitle>
                <CardDescription>
                  Manage your uploaded educational resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{upload.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(upload.category)}>
                            {upload.category.charAt(0).toUpperCase() + upload.category.slice(1)}
                          </Badge>
                          <Badge variant={upload.status === "active" ? "default" : "secondary"}>
                            {upload.status}
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
                          <span>Uploaded {new Date(upload.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/upload">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Resource
                    </Button>
                  </Link>
                </div>
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
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
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
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-medium">January 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reputation Level</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Advanced Contributor</p>
                      <Badge className="bg-gold-100 text-gold-800">⭐</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Community Impact</p>
                    <p className="font-medium">Helped 1,247 students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Download className="h-3 w-3 text-green-600" />
                    <span>Your "Calculus Notes" was downloaded 5 times today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-3 w-3 text-blue-600" />
                    <span>New resource upload approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-purple-600" />
                    <span>Gained 15 new profile views</span>
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
