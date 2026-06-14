import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext, IDCard } from "@/contexts/AppContext";
import {
  exportSinglePDF,
  exportCardsAsZip,
  exportAllUsersToExcel,
  exportSelectedCardsToExcel,
  sendEmailNotification,
} from "@/utils/idCardUtils";

export const useIdCardOperations = () => {
  const { toast } = useToast();
  const {
    users,
    projects,
    idCards,
    addIdCard,
    updateIdCard,
    deleteIdCard,
    currentUser,
  } = useAppContext();
  const [exportLoading, setExportLoading] = useState(false);

  const canUpdateStatus = (currentStatus: string): boolean => {
    if (!currentUser) return false;

    if (currentUser.role === "admin") return true;

    switch (currentStatus) {
      case "pending":
        return ["reviewer", "approver", "admin"].includes(currentUser.role);
      case "review":
        return ["approver", "admin"].includes(currentUser.role);
      case "approved":
        return ["creator", "admin"].includes(currentUser.role);
      default:
        return false;
    }
  };

  const canDownloadCard = (status: string): boolean => {
    if (!currentUser) return false;

    if (currentUser.role === "admin") return true;

    return status === "generated";
  };

  const canDeleteCard = (status: string): boolean => {
    if (!currentUser) return false;

    if (currentUser.role === "admin") return true;

    if (status === "generated") return false;

    return ["reviewer", "approver", "creator"].includes(currentUser.role);
  };

  const handleGenerateId = (userId: string, projectId: string) => {
    const existingCard = idCards.find(
      (card) => card.userId === userId && card.projectId === projectId,
    );

    if (existingCard) {
      toast({
        title: "ID Card Already Exists",
        description: "An ID card for this user in this project already exists.",
        variant: "destructive",
      });
      return;
    }

    if (!projectId) {
      toast({
        title: "Project Required",
        description: "Please select a project first.",
        variant: "destructive",
      });
      return;
    }

    addIdCard({
      userId,
      projectId,
      status: "pending",
    });

    toast({
      title: "ID Card Request Created",
      description: "The ID card has been sent for review.",
    });
  };

  const handleExportPDF = async (selectedCards: string[]) => {
    if (selectedCards.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select at least one ID card to export.",
        variant: "destructive",
      });
      return;
    }

    setExportLoading(true);

    try {
      const exportCards = idCards.filter((card) =>
        selectedCards.includes(card.id),
      );

      if (exportCards.length === 1) {
        await exportSinglePDF(
          exportCards[0],
          users,
          projects,
          (userName) => {
            toast({
              title: "Export Complete",
              description: `Successfully exported ID card for ${userName} as PDF.`,
            });
          },
          (errorMsg) => {
            toast({
              title: "Export Failed",
              description: errorMsg,
              variant: "destructive",
            });
          },
        );
      } else {
        await exportCardsAsZip(
          exportCards,
          users,
          projects,
          (count) => {
            toast({
              title: "Export Complete",
              description: `Successfully exported ${count} ID cards as ZIP.`,
            });
          },
          (errorMsg) => {
            toast({
              title: "Export Failed",
              description: errorMsg,
              variant: "destructive",
            });
          },
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error during the export process.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportExcel = (selectedCards: string[]) => {
    if (selectedCards.length === 0) {
      exportAllUsersToExcel(users, (count) => {
        toast({
          title: "Export Complete",
          description: `Successfully exported data for all ${count} users as Excel.`,
        });
      });
    } else {
      exportSelectedCardsToExcel(
        idCards,
        selectedCards,
        users,
        projects,
        (count) => {
          toast({
            title: "Export Complete",
            description: `Successfully exported ${count} ID cards as Excel.`,
          });
        },
      );
    }
  };

  const handleUpdateStatus = (
    id: string,
    status: "pending" | "review" | "approved" | "generated",
  ) => {
    if (!canUpdateStatus(status)) {
      toast({
        title: "Permission Denied",
        description: `You don't have permission to ${status === "pending" ? "review" : status === "review" ? "approve" : "generate"} ID cards.`,
        variant: "destructive",
      });
      return;
    }

    const statusMap: Record<string, string> = {
      pending: "review",
      review: "approved",
      approved: "generated",
    };

    const fieldMap: Record<string, string> = {
      review: "reviewedAt",
      approved: "approvedAt",
      generated: "generatedAt",
    };

    const updatedStatus =
      status === "generated" ? "generated" : statusMap[status];

    const updateData: any = {
      status: updatedStatus,
    };

    if (fieldMap[updatedStatus]) {
      updateData[fieldMap[updatedStatus]] = new Date().toISOString();
    }

    updateIdCard(id, updateData);

    if (updatedStatus === "generated") {
      const card = idCards.find((c) => c.id === id);
      const user = users.find((u) => u.id === card?.userId);
      if (user && user.email) {
        sendEmailNotification(
          user.email,
          "Your ID Card has been generated",
          `Dear ${user.name},\n\nYour ID card has been generated and is now available. You can download it from your profile.\n\nBest regards,\nThe Admin Team`,
        );
      }
    }

    toast({
      title: "Status Updated",
      description: `ID card status updated to ${updatedStatus}`,
    });
  };

  const handleDeleteCard = (id: string) => {
    if (!canDeleteCard(idCards.find((card) => card.id === id)?.status || "")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete this ID card.",
        variant: "destructive",
      });
      return;
    }

    deleteIdCard(id);
    toast({
      title: "ID Card Deleted",
      description: "The ID card has been deleted successfully.",
    });
  };

  return {
    canUpdateStatus,
    canDownloadCard,
    canDeleteCard,
    handleGenerateId,
    handleExportPDF,
    handleExportExcel,
    handleUpdateStatus,
    handleDeleteCard,
    exportLoading,
    setExportLoading,
  };
};
