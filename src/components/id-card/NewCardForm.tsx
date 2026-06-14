import React from "react";
import { Button } from "@/components/ui/button";
import { User, Project } from "@/contexts/AppContext";

interface NewCardFormProps {
  users: User[];
  projects: Project[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  selectedProjectId: string;
  setSelectedProjectId: (projectId: string) => void;
  onGenerateCard: (userId: string, projectId: string) => void;
}

const NewCardForm: React.FC<NewCardFormProps> = ({
  users,
  projects,
  selectedUser,
  setSelectedUser,
  selectedProjectId,
  setSelectedProjectId,
  onGenerateCard,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select User</label>
        <select
          className="w-full rounded-md border p-2"
          onChange={(e) =>
            setSelectedUser(users.find((u) => u.id === e.target.value) || null)
          }
        >
          <option value="">Select a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Select Project</label>
        <select
          className="w-full rounded-md border p-2"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <Button
          className="w-full bg-[#337688]"
          disabled={!selectedUser || !selectedProjectId}
          onClick={() =>
            selectedUser && onGenerateCard(selectedUser.id, selectedProjectId)
          }
        >
          Generate ID Card
        </Button>
      </div>
    </div>
  );
};

export default NewCardForm;
