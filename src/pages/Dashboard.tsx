
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  organization: string;
  region: string;
  status: 'active' | 'inactive' | 'paused';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: '1', 
      name: 'Project Alpha', 
      organization: 'Acme Inc', 
      region: 'us-east-1',
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Database Beta', 
      organization: 'Acme Inc', 
      region: 'eu-west-1',
      status: 'active'
    },
    { 
      id: '3', 
      name: 'Auth Service', 
      organization: 'Personal', 
      region: 'ap-southeast-1',
      status: 'paused'
    }
  ]);

  useEffect(() => {
    // Check if we have an access token
    const accessToken = localStorage.getItem('supabase_access_token');
    
    if (!accessToken) {
      // Redirect to home if not authenticated
      navigate('/');
      return;
    }
    
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
    
    // Redirect to home
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-supabase to-supabase/80"></div>
            <h1 className="text-xl font-semibold">SupaIntegrate Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-supabase/30 border-t-supabase rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Your Supabase Projects</h2>
              <Button className="bg-supabase hover:bg-supabase/90 text-white">
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {project.status}
                      </div>
                    </div>
                    <CardDescription>{project.organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Region: {project.region}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new project card */}
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex items-center justify-center h-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Add New Project</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
