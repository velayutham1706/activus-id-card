import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useIdCardOperations } from "@/hooks/useIdCardOperations";
import CardTabs from "@/components/id-card/CardTabs";
import CardPreviewDialog from "@/components/id-card/CardPreviewDialog";
import NewCardForm from "@/components/id-card/NewCardForm";

interface IDGenerationProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const IDGeneration = ({ isCollapsed, setIsCollapsed }: IDGenerationProps) => {
  const { users, projects, idCards } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("pending");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const {
    canUpdateStatus,
    canDownloadCard,
    canDeleteCard,
    handleGenerateId,
    handleExportPDF,
    handleExportExcel,
    handleUpdateStatus,
    handleDeleteCard,
    exportLoading,
  } = useIdCardOperations();

  const filteredIdCards = idCards
    .filter((card) => {
      const user = users.find((u) => u.id === card.userId);
      const project = projects.find((p) => p.id === card.projectId);

      const matchesSearch =
        user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.toLowerCase().includes(searchTerm.toLowerCase());

      return card.status === tab && matchesSearch;
    })
    .map((card) => {
      const user = users.find((u) => u.id === card.userId);
      const project = projects.find((p) => p.id === card.projectId);
      return {
        ...card,
        user,
        project,
      };
    });

  const handleDownloadSingleCard = (cardId: string) => {
    setSelectedCards([cardId]);
    handleExportPDF([cardId]);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto ${isCollapsed ? "ml-[60px]" : "ml-64"} transition-all duration-300`}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">ID Card Generation</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExportExcel(selectedCards)}
                  disabled={exportLoading}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button
                  onClick={() => handleExportPDF(selectedCards)}
                  className="bg-[#337688]"
                  disabled={exportLoading || selectedCards.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {exportLoading ? "Exporting..." : "Export PDF"}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ID Card Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardTabs
                  tab={tab}
                  setTab={setTab}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filteredIdCards={filteredIdCards}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                  cardListProps={{
                    users,
                    projects,
                    onPreviewClick: (user) => {
                      setPreviewUser(user);
                      setShowPreviewDialog(true);
                    },
                    onUpdateStatus: handleUpdateStatus,
                    onDownloadCard: handleDownloadSingleCard,
                    onDeleteCard: handleDeleteCard,
                    canUpdateStatus,
                    canDownloadCard,
                    canDeleteCard,
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate New ID Card</CardTitle>
              </CardHeader>
              <CardContent>
                <NewCardForm
                  users={users}
                  projects={projects}
                  selectedUser={previewUser}
                  setSelectedUser={setPreviewUser}
                  selectedProjectId={selectedProjectId}
                  setSelectedProjectId={setSelectedProjectId}
                  onGenerateCard={handleGenerateId}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <CardPreviewDialog
          showPreviewDialog={showPreviewDialog}
          setShowPreviewDialog={setShowPreviewDialog}
          previewUser={previewUser}
          project={projects.find((p) => p.id === selectedProjectId)}
        />
      </div>
    </AuthGuard>
  );
};

export default IDGeneration;
