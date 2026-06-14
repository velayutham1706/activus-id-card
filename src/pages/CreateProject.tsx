import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";

interface CreateProjectProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const CreateProject = ({ isCollapsed, setIsCollapsed }: CreateProjectProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, addProject, currentUser } = useAppContext();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [creatorId, setCreatorId] = useState(
    currentUser?.role === "creator" ? currentUser.id : "",
  );
  const [reviewerId, setReviewerId] = useState("");
  const [approverId, setApproverId] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on role and search term
  const getFilteredUsers = (role: string) => {
    return users
      .filter(
        (user) =>
          user.role === role &&
          user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((user) => {
        if (role === "creator")
          return user.id !== reviewerId && user.id !== approverId;
        if (role === "reviewer")
          return user.id !== creatorId && user.id !== approverId;
        if (role === "approver")
          return user.id !== creatorId && user.id !== reviewerId;
        return true;
      });
  };

  const filteredCreators = getFilteredUsers("creator");
  const filteredReviewers = getFilteredUsers("reviewer");
  const filteredApprovers = getFilteredUsers("approver");

  // Filter regular users (not creator, reviewer, approver or admin)
  const filteredParticipants = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !participants.includes(user.id) &&
      user.id !== creatorId &&
      user.id !== reviewerId &&
      user.id !== approverId,
  );

  const handleAddParticipant = (userId: string) => {
    if (!participants.includes(userId)) {
      setParticipants([...participants, userId]);
    }
  };

  const handleRemoveParticipant = (userId: string) => {
    setParticipants(participants.filter((id) => id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    if (!creatorId && currentUser?.role === "admin") {
      toast({
        title: "Error",
        description: "Creator is required",
        variant: "destructive",
      });
      return;
    }

    if (!reviewerId) {
      toast({
        title: "Error",
        description: "Reviewer is required",
        variant: "destructive",
      });
      return;
    }

    if (!approverId) {
      toast({
        title: "Error",
        description: "Approver is required",
        variant: "destructive",
      });
      return;
    }

    const finalCreatorId =
      creatorId || (currentUser?.role === "creator" ? currentUser.id : "");

    // Create new project
    addProject({
      name: projectName,
      description: projectDescription,
      location: projectLocation,
      creatorId: finalCreatorId,
      reviewerId,
      approverId,
      participants,
      status: "draft",
    });

    toast({
      title: "Success",
      description: "Project created successfully",
    });

    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
          isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Project</h1>
          <p className="text-gray-600 mt-1">
            Set up a new construction project for ID card generation
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name *</Label>
                      <Input
                        id="name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Enter project description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        placeholder="Enter project location"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentUser?.role === "admin" && (
                    <div className="space-y-2">
                      <Label htmlFor="creator">Creator *</Label>
                      <Select value={creatorId} onValueChange={setCreatorId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select creator" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCreators.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reviewer">Reviewer *</Label>
                    <Select value={reviewerId} onValueChange={setReviewerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredReviewers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approver">Approver *</Label>
                    <Select value={approverId} onValueChange={setApproverId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredApprovers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Users</Label>
                    <Input
                      id="search"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="h-[200px] overflow-y-auto border rounded-md">
                    {filteredParticipants.length > 0 ? (
                      <ul className="divide-y">
                        {filteredParticipants.map((user) => (
                          <li
                            key={user.id}
                            className="p-2 hover:bg-gray-50 flex justify-between items-center"
                          >
                            <span>{user.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddParticipant(user.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Add</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No matching users found
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Selected Participants ({participants.length})</Label>
                    <div className="mt-2 border rounded-md">
                      {participants.length > 0 ? (
                        <ul className="divide-y">
                          {participants.map((id) => {
                            const user = users.find((u) => u.id === id);
                            return (
                              <li
                                key={id}
                                className="p-2 flex justify-between items-center"
                              >
                                <span>{user?.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveParticipant(id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No participants selected
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/projects")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#337688]">
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProject;
