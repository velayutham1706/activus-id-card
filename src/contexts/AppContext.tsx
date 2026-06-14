import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "admin" | "creator" | "reviewer" | "approver" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  dob?: string;
  inductionDate?: string;
  validTill?: string;
  healthCheckupDate?: string;
  uidNo?: string;
  idNo?: string;
  contractor?: string;
  photo?: string;
  safetyViolation?: "green" | "yellow" | "red" | null;
  safetyIncharge?: string;
  hrExecutive?: string;
  role: Role;
  projectIds: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: string;
  creatorId?: string;
  reviewerId?: string;
  approverId?: string;
  participants: string[]; // User IDs
  status: "draft" | "review" | "approved" | "completed";
}

export interface IDCard {
  id: string;
  userId: string;
  projectId: string;
  projectName: string;
  status: "pending" | "review" | "approved" | "generated";
  createdAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  generatedAt?: string;
}

interface AppContextType {
  users: User[];
  projects: Project[];
  idCards: IDCard[];
  currentUser: User | null;
  isAuthenticated: boolean;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addIdCard: (idCard: Omit<IDCard, "id" | "createdAt">) => void;
  updateIdCard: (id: string, idCard: Partial<IDCard>) => void;
  deleteIdCard: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, "id" | "projectIds">) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            id: "1",
            name: "Admin User",
            email: "admin@activus.com",
            password: "password123",
            role: "admin",
            projectIds: [],
            uidNo: "UID001",
            idNo: "ID001",
            contractor: "Activus Industrial Design & Build LLP",
            bloodGroup: "",
            emergencyContact: "9876543210",
            dob: "",
            inductionDate: "",
            validTill: "",
            healthCheckupDate: "",
            address: "",
            photo: "",
            safetyViolation: null,
            safetyIncharge: "",
            hrExecutive: "",
          },
        ];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [idCards, setIdCards] = useState<IDCard[]>(() => {
    const savedIdCards = localStorage.getItem("idCards");
    return savedIdCards ? JSON.parse(savedIdCards) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("currentUser");
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("idCards", JSON.stringify(idCards));
  }, [idCards]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const generateRandomId = () => {
    const prefix = "ID";
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `${prefix}${randomNum}`;
  };

  const addUser = (user: Omit<User, "id">) => {
    const existingIds = users.map((u) => u.idNo);
    let newIdNo;
    do {
      newIdNo = generateRandomId();
    } while (existingIds.includes(newIdNo));

    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      projectIds: [],
      idNo: newIdNo,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updatedFields: Partial<User>) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...updatedFields } : user,
    );
    setUsers(updatedUsers);

    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...updatedFields });
    }
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    setProjects(
      projects.map((project) => ({
        ...project,
        participants: project.participants.filter((userId) => userId !== id),
      })),
    );
  };

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updatedFields } : project,
      ),
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    setIdCards(idCards.filter((card) => card.projectId !== id));
  };

  const addIdCard = (idCard: Omit<IDCard, "id" | "createdAt">) => {
    const newIdCard = {
      ...idCard,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setIdCards([...idCards, newIdCard]);
  };

  const updateIdCard = (id: string, updatedFields: Partial<IDCard>) => {
    setIdCards(
      idCards.map((card) =>
        card.id === id ? { ...card, ...updatedFields } : card,
      ),
    );
  };

  const deleteIdCard = (id: string) => {
    setIdCards(idCards.filter((card) => card.id !== id));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login function called with:", email, password);
    console.log("Available users:", users);

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    console.log("Found user:", user);

    if (user) {
      setCurrentUser(user);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (
    userData: Omit<User, "id" | "projectIds">,
  ): Promise<boolean> => {
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
    );

    if (existingUser) {
      return false;
    }

    const existingIds = users.map((u) => u.idNo);
    let newIdNo;
    do {
      newIdNo = generateRandomId();
    } while (existingIds.includes(newIdNo));

    const newUser = {
      ...userData,
      id: crypto.randomUUID(),
      projectIds: [],
      idNo: newIdNo,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const value = {
    users,
    projects,
    idCards,
    currentUser,
    isAuthenticated,
    addUser,
    updateUser,
    deleteUser,
    addProject,
    updateProject,
    deleteProject,
    addIdCard,
    updateIdCard,
    deleteIdCard,
    setCurrentUser,
    login,
    logout,
    register,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
