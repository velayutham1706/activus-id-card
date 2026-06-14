import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Project } from "@/contexts/AppContext";

interface ProjectsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Projects = ({ isCollapsed, setIsCollapsed }: ProjectsProps) => {
  const navigate = useNavigate();
  const { projects, deleteProject, users, currentUser } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
          isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
        }`}
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your construction projects
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

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const creator = users.find(
                (user) => user.id === project.creatorId,
              );
              const reviewer = users.find(
                (user) => user.id === project.reviewerId,
              );
              const approver = users.find(
                (user) => user.id === project.approverId,
              );

              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-6 pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="text-sm space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Participants:</span>
                        <span className="font-medium">
                          {project.participants.length}
                        </span>
                      </div>
                      {project.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium">
                            {project.location}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm space-y-1 mb-4">
                      {creator && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Creator:</span>
                          <span className="font-medium">{creator.name}</span>
                        </div>
                      )}
                      {reviewer && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reviewer:</span>
                          <span className="font-medium">{reviewer.name}</span>
                        </div>
                      )}
                      {approver && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Approver:</span>
                          <span className="font-medium">{approver.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>

                      {(currentUser?.role === "admin" ||
                        currentUser?.id === project.creatorId) && (
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/projects/${project.id}?edit=true`)
                            }
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>

                          {currentUser?.role === "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProjectToDelete(project)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try changing your search or filter"
                : "Get started by creating your first project"}
            </p>
            {(currentUser?.role === "admin" ||
              currentUser?.role === "creator") && (
              <Button
                onClick={() => navigate("/projects/create")}
                className="bg-[#337688]"
              >
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            )}
          </Card>
        )}

        <Dialog
          open={!!projectToDelete}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{projectToDelete?.name}"? This
                action cannot be undone and will also delete all ID cards
                associated with this project.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Projects;
