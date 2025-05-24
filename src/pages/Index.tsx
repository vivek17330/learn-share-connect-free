
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Presentation, FolderOpen, Upload, Search, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      icon: Book,
      title: "Textbooks",
      description: "Academic textbooks and reference materials",
      count: "2,450+ resources"
    },
    {
      icon: FileText,
      title: "Notes",
      description: "Study notes and course materials",
      count: "5,230+ resources"
    },
    {
      icon: Presentation,
      title: "Presentations",
      description: "PowerPoint slides and lecture presentations",
      count: "1,890+ resources"
    },
    {
      icon: FolderOpen,
      title: "Projects",
      description: "Project files and assignments",
      count: "980+ resources"
    }
  ];

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Upload your academic resources in seconds with our simple interface"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need with advanced search and filtering"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of students sharing knowledge freely"
    },
    {
      icon: Shield,
      title: "100% Free",
      description: "All resources are completely free - no hidden costs or subscriptions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">Edu Market</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/browse" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Resources
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/browse" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Browse Resources
              </Link>
              <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 text-blue-600 font-medium">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Ultimate
            <span className="text-blue-600"> Educational Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Share and access textbooks, study notes, presentations, and project files completely free. 
            Join the largest community of students helping students succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                Start Sharing Today
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse Market
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Educational Resources Marketplace</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover thousands of academic resources shared by students worldwide. From textbooks to project files, find exactly what you need for your studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link to="/browse" key={index}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <category.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm font-medium text-blue-600">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Edu Market?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The most trusted educational marketplace built by students, for students. Share knowledge and succeed together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Resources Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Educational Revolution</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start sharing your academic resources today and become part of the largest free educational marketplace.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Book className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">Edu Market</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The world's largest free educational marketplace where students share textbooks, notes, presentations, and projects to help each other succeed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/browse" className="hover:text-white">Browse Resources</Link></li>
                <li><Link to="/upload" className="hover:text-white">Upload Files</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Edu Market. All rights reserved. The ultimate educational marketplace for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
