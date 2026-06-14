import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

interface UserDashboardProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const UserDashboard = ({ isCollapsed, setIsCollapsed }: UserDashboardProps) => {
  const { currentUser, projects, idCards } = useAppContext();

  if (!currentUser) {
    return null;
  }

  // Get user's projects
  const userProjects = projects.filter((project) =>
    project.participants.includes(currentUser.id),
  );

  // Get user's ID cards
  const userIdCards = idCards.filter((card) => card.userId === currentUser.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "review":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Under Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
        );
      case "generated":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Generated
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "review":
        return <Badge className="bg-blue-100 text-blue-800">Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800">Completed</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex relative">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main
          className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
            }`}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userProjects.length}</p>
                <p className="text-gray-500 text-sm">
                  Projects you're participating in
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ID Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userIdCards.length}</p>
                <p className="text-gray-500 text-sm">
                  ID cards linked to your account
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Generated Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {
                    userIdCards.filter((card) => card.status === "generated")
                      .length
                  }
                </p>
                <p className="text-gray-500 text-sm">ID cards ready for use</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {userProjects.length > 0 ? (
                  <div className="space-y-4">
                    {userProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {project.description || "No description"}
                            </p>
                          </div>
                          {getProjectStatusBadge(project.status)}
                        </div>
                        {project.location && (
                          <p className="text-xs text-gray-500 mt-2">
                            Location: {project.location}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    You are not participating in any projects yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your ID Cards</CardTitle>
              </CardHeader>
              <CardContent>
                {userIdCards.length > 0 ? (
                  <div className="space-y-4">
                    {userIdCards.map((card) => {
                      const project = projects.find(
                        (p) => p.id === card.projectId,
                      );
                      return (
                        <div
                          key={card.id}
                          className="p-4 border rounded-md hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {project ? project.name : "Unknown Project"}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Created:{" "}
                                {new Date(card.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(card.status)}
                          </div>

                          <div className="mt-3 pt-3 border-t text-sm">
                            <div className="flex space-x-4">
                              {card.reviewedAt && (
                                <div>
                                  <p className="text-gray-500">Reviewed</p>
                                  <p>
                                    {new Date(
                                      card.reviewedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {card.approvedAt && (
                                <div>
                                  <p className="text-gray-500">Approved</p>
                                  <p>
                                    {new Date(
                                      card.approvedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {card.generatedAt && (
                                <div>
                                  <p className="text-gray-500">Generated</p>
                                  <p>
                                    {new Date(
                                      card.generatedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No ID cards have been generated for you yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default UserDashboard;
