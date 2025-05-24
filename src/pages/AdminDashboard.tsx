
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Users, FileText, BarChart3, Shield, Download, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      navigate("/login");
    } else {
      setAdmin(JSON.parse(adminData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    toast({
      title: "Admin logged out",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/");
  };

  const stats = [
    { title: "Total Users", value: "2,547", icon: Users, color: "text-blue-600", change: "+12%" },
    { title: "Total Resources", value: "8,934", icon: FileText, color: "text-green-600", change: "+8%" },
    { title: "Downloads Today", value: "1,283", icon: Download, color: "text-purple-600", change: "+15%" },
    { title: "Pending Reviews", value: "23", icon: Shield, color: "text-orange-600", change: "-5%" }
  ];

  const users = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", uploads: 12, downloads: 523, joinDate: "2024-01-15", status: "active" },
    { id: 2, name: "Mike Chen", email: "mike@example.com", uploads: 8, downloads: 342, joinDate: "2024-01-12", status: "active" },
    { id: 3, name: "Alex Rivera", email: "alex@example.com", uploads: 15, downloads: 789, joinDate: "2024-01-10", status: "active" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", uploads: 6, downloads: 234, joinDate: "2024-01-08", status: "suspended" },
    { id: 5, name: "David Wilson", email: "david@example.com", uploads: 20, downloads: 1056, joinDate: "2024-01-05", status: "active" }
  ];

  const resources = [
    { id: 1, title: "Advanced Mathematics Textbook", uploader: "Sarah Johnson", category: "textbooks", downloads: 523, uploadDate: "2024-01-15", status: "approved" },
    { id: 2, title: "Physics Lab Notes", uploader: "Mike Chen", category: "notes", downloads: 342, uploadDate: "2024-01-12", status: "approved" },
    { id: 3, title: "CS Algorithms Presentation", uploader: "Alex Rivera", category: "presentations", downloads: 267, uploadDate: "2024-01-10", status: "pending" },
    { id: 4, title: "Web Development Project", uploader: "Emma Davis", category: "projects", downloads: 189, uploadDate: "2024-01-08", status: "approved" },
    { id: 5, title: "Biology Study Guide", uploader: "David Wilson", category: "notes", downloads: 456, uploadDate: "2024-01-05", status: "rejected" }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Edu Market</span>
              <Badge className="ml-3 bg-red-100 text-red-800">Admin Panel</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Back to Site</Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the Edu Market platform</p>
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
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-gray-600">student@university.edu</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">2 min ago</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Resource uploaded</p>
                        <p className="text-sm text-gray-600">Chemistry Lab Manual</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">15 min ago</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Download milestone</p>
                        <p className="text-sm text-gray-600">10,000th download reached</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">1 hour ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Server Status</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database Performance</span>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Storage Usage</span>
                      <Badge className="bg-yellow-100 text-yellow-800">78% Full</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pending Moderation</span>
                      <Badge className="bg-orange-100 text-orange-800">23 Items</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Uploads</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.uploads}</TableCell>
                        <TableCell>{user.downloads}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Shield className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>Moderate and manage all uploaded resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.uploader}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.downloads}</TableCell>
                        <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(resource.status)}>
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" title="View">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" title="Approve" className="text-green-600">
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" title="Reject" className="text-red-600">
                              <XCircle className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" title="Delete" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Textbooks</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-16"></div>
                        </div>
                        <span className="text-sm">2,450</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Notes</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full w-24"></div>
                        </div>
                        <span className="text-sm">3,200</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Presentations</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full w-12"></div>
                        </div>
                        <span className="text-sm">1,890</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Projects</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full w-8"></div>
                        </div>
                        <span className="text-sm">980</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Users</span>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+245</p>
                        <p className="text-sm text-gray-600">12% increase</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Resource Uploads</span>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">+523</p>
                        <p className="text-sm text-gray-600">8% increase</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Downloads</span>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">+12,450</p>
                        <p className="text-sm text-gray-600">15% increase</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
