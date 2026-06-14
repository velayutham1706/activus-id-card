import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  IdCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";

interface DashboardProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Dashboard = ({ isCollapsed, setIsCollapsed }: DashboardProps) => {
  const navigate = useNavigate();
  const { projects, users, idCards, currentUser } = useAppContext();

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: <Briefcase className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      adminOnly: true,
    },
    {
      title: "ID Cards Generated",
      value: idCards.filter((card) => card.status === "generated").length,
      icon: <IdCard className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Pending Approval",
      value: idCards.filter((card) => card.status === "review").length,
      icon: <AlertCircle className="h-5 w-5" />,
      color: "bg-red-100 text-red-800",
    },
  ];

  const recentProjects = projects
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
          }`}
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to Activus ID Card Generation System
            </p>
          </div>
          {(currentUser?.role === "admin" ||
            currentUser?.role === "creator") && (
              <Button
                onClick={() => navigate("/projects/create")}
                className="sm:self-end bg-[#337688]"
              >
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats
            .filter((stat) => !stat.adminOnly || currentUser?.role === "admin")
            .map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b p-6">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/projects")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            {recentProjects.length > 0 ? (
              <div className="divide-y">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          {project.participants.length} Participants
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                          ${project.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : project.status === "review"
                                ? "bg-amber-100 text-amber-800"
                                : project.status === "draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No projects yet</p>
                {(currentUser?.role === "admin" ||
                  currentUser?.role === "creator") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/projects/create")}
                      className="mt-2"
                    >
                      Create Project
                    </Button>
                  )}
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b p-6">
              <div className="flex items-center justify-between">
                <CardTitle>ID Card Status</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/id-generation")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Generated</span>
                  </div>
                  <span className="font-medium">
                    {
                      idCards.filter((card) => card.status === "generated")
                        .length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Pending Review</span>
                  </div>
                  <span className="font-medium">
                    {idCards.filter((card) => card.status === "review").length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Pending Approval</span>
                  </div>
                  <span className="font-medium">
                    {
                      idCards.filter((card) => card.status === "approved")
                        .length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Total</span>
                  </div>
                  <span className="font-medium">{idCards.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
