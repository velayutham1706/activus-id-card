
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Plus, User as UserIcon, Users, Calendar, Check, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, Project, User } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";

interface ProjectDetailsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const ProjectDetails = ({ isCollapsed, setIsCollapsed }: ProjectDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, users, updateProject, currentUser } = useAppContext();

  // Check if user has permission to edit
  const canEdit = currentUser?.role === 'admin' || 
                 currentUser?.role === 'creator' || 
                 currentUser?.role === 'reviewer' || 
                 currentUser?.role === 'approver';

  const project = projects.find((p) => p.id === id);
  
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [location, setLocation] = useState(project?.location || "");
  const [status, setStatus] = useState<"draft" | "review" | "approved" | "completed">(
    project?.status || "draft"
  );
  const [creatorId, setCreatorId] = useState(project?.creatorId || "");
  const [reviewerId, setReviewerId] = useState(project?.reviewerId || "");
  const [approverId, setApproverId] = useState(project?.approverId || "");

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex relative">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main 
          className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
            isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
          }`}
        >
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Project not found</h2>
            <p className="text-gray-500 mb-4">The project you are looking for does not exist.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this project.",
        variant: "destructive"
      });
      return;
    }
    
    updateProject(project.id, {
      name,
      description,
      location,
      status,
      creatorId,
      reviewerId,
      approverId,
    });

    toast({
      title: "Project Updated",
      description: "The project has been updated successfully.",
    });
  };

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800",
    review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  const getParticipants = () => {
    return users.filter(user => project.participants.includes(user.id));
  };

  const getNonParticipants = () => {
    return users.filter(user => !project.participants.includes(user.id));
  };

  const handleAddParticipant = (userId: string) => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to modify project participants.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedParticipants = [...project.participants, userId];
    updateProject(project.id, { participants: updatedParticipants });
    toast({
      title: "Participant Added",
      description: "The user has been added to the project.",
    });
  };

  const handleRemoveParticipant = (userId: string) => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to modify project participants.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedParticipants = project.participants.filter(id => id !== userId);
    updateProject(project.id, { participants: updatedParticipants });
    toast({
      title: "Participant Removed",
      description: "The user has been removed from the project.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
          isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/projects')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center mt-1">
                <Badge className={statusColors[status]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
                <span className="text-gray-500 ml-2">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {canEdit && (
            <Button onClick={handleSave} className="sm:self-end">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  {canEdit ? (
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  ) : (
                    <div className="px-3 py-2 border rounded-md bg-gray-50">{name}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {canEdit ? (
                    <Textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  ) : (
                    <div className="px-3 py-2 border rounded-md bg-gray-50 min-h-[100px]">{description}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {canEdit ? (
                    <Input
                      id="location"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  ) : (
                    <div className="px-3 py-2 border rounded-md bg-gray-50">{location}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Participants</h3>
                  
                  {getParticipants().length > 0 ? (
                    <div className="space-y-2">
                      {getParticipants().map(user => (
                        <div 
                          key={user.id} 
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                            </div>
                          </div>
                          {canEdit && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveParticipant(user.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No participants added yet
                    </div>
                  )}

                  {canEdit && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Add Participants</h3>
                      
                      {getNonParticipants().length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {getNonParticipants().map(user => (
                            <div 
                              key={user.id} 
                              className="flex justify-between items-center p-3 border rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <UserIcon className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddParticipant(user.id)}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          All users are already participants
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    {canEdit ? (
                      <select
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value as "draft" | "review" | "approved" | "completed")}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="draft">Draft</option>
                        <option value="review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 border rounded-md bg-gray-50 capitalize">
                        {status}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Project Roles</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="creator">Creator</Label>
                        {canEdit ? (
                          <select
                            id="creator"
                            value={creatorId}
                            onChange={e => setCreatorId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select Creator</option>
                            {users
                              .filter(user => user.role === "creator" || user.role === "admin")
                              .map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2 border rounded-md bg-gray-50">
                            {creatorId ? users.find(user => user.id === creatorId)?.name || "Not Assigned" : "Not Assigned"}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reviewer">Reviewer</Label>
                        {canEdit ? (
                          <select
                            id="reviewer"
                            value={reviewerId}
                            onChange={e => setReviewerId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select Reviewer</option>
                            {users
                              .filter(user => user.role === "reviewer" || user.role === "admin")
                              .map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2 border rounded-md bg-gray-50">
                            {reviewerId ? users.find(user => user.id === reviewerId)?.name || "Not Assigned" : "Not Assigned"}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="approver">Approver</Label>
                        {canEdit ? (
                          <select
                            id="approver"
                            value={approverId}
                            onChange={e => setApproverId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select Approver</option>
                            {users
                              .filter(user => user.role === "approver" || user.role === "admin")
                              .map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <div className="px-3 py-2 border rounded-md bg-gray-50">
                            {approverId ? users.find(user => user.id === approverId)?.name || "Not Assigned" : "Not Assigned"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Participants</p>
                      <p className="text-xl font-semibold">{project.participants.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Status</p>
                      <p className="text-xl font-semibold capitalize">{project.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="text-xl font-semibold">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
