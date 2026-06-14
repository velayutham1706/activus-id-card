import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useAppContext, User, Role } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import AuthGuard from "@/components/AuthGuard";

interface UsersProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface UserFormValues {
  name: string;
  role: string;
  email: string;
  password: string;
}

interface RoleUpdateFormValues {
  role: string;
}

const Users = ({ isCollapsed, setIsCollapsed }: UsersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, addUser, deleteUser, updateUser, currentUser, projects } =
    useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const form = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const roleForm = useForm<RoleUpdateFormValues>({
    defaultValues: {
      role: "",
    },
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (data: UserFormValues) => {
    addUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as Role,
      projectIds: [],
    });

    toast({
      title: "Success",
      description: "User created successfully",
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    }
  };

  const handleOpenRoleDialog = (user: User) => {
    setUserToUpdateRole(user);
    roleForm.setValue("role", user.role);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = (data: RoleUpdateFormValues) => {
    if (userToUpdateRole) {
      updateUser(userToUpdateRole.id, {
        role: data.role as Role,
      });

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      setUserToUpdateRole(null);
      setIsRoleDialogOpen(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "creator":
        return "bg-blue-100 text-blue-800";
      case "reviewer":
        return "bg-amber-100 text-amber-800";
      case "approver":
        return "bg-green-100 text-green-800";
      case "user":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canManageRole = (user: User) => {
    return currentUser?.role === "admin" && user.id !== currentUser.id;
  };

  const getUserProjects = (user: User) => {
    return projects.filter(
      (p) =>
        p.participants.includes(user.id) ||
        p.creatorId === user.id ||
        p.reviewerId === user.id ||
        p.approverId === user.id,
    );
  };

  return (
    <AuthGuard allowedRoles={["admin", "creator", "reviewer", "approver"]}>
      <div className="min-h-screen bg-gray-50 flex relative">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main
          className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
            isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
          }`}
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Users</h1>
              <p className="text-gray-600 mt-1">Manage users and their roles</p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="sm:self-end bg-[#337688]"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="creator">Creator</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="approver">Approver</option>
                  <option value="user">Users</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {filteredUsers.length > 0 ? (
            <div className="grid gap-4">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Role</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Projects
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => {
                      const userProjects = getUserProjects(user);

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-2">
                                {user.name.charAt(0)}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{userProjects.length}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/users/${user.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>

                              {canManageRole(user) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenRoleDialog(user)}
                                >
                                  <UserPlus className="h-4 w-4" />
                                  <span className="sr-only">Change Role</span>
                                </Button>
                              )}

                              {user.id !== currentUser?.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setUserToDelete(user)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || roleFilter !== "all"
                  ? "Try changing your search or filter"
                  : "Get started by adding your first user"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </Card>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user with the appropriate role.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddUser)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="creator">Creator</SelectItem>
                            <SelectItem value="reviewer">Reviewer</SelectItem>
                            <SelectItem value="approver">Approver</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change User Role</DialogTitle>
                <DialogDescription>
                  Update the role for {userToUpdateRole?.name}
                </DialogDescription>
              </DialogHeader>
              <Form {...roleForm}>
                <form
                  onSubmit={roleForm.handleSubmit(handleUpdateRole)}
                  className="space-y-4"
                >
                  <FormField
                    control={roleForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="creator">Creator</SelectItem>
                            <SelectItem value="reviewer">Reviewer</SelectItem>
                            <SelectItem value="approver">Approver</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Update Role</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!userToDelete}
            onOpenChange={(open) => !open && setUserToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{userToDelete?.name}"? This
                  action cannot be undone and will remove this user from all
                  projects.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUserToDelete(null)}>
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
    </AuthGuard>
  );
};

export default Users;
