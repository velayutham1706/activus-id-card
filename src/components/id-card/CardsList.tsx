import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  Download,
  Archive,
  Clock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { User, Project, IDCard } from "@/contexts/AppContext";

interface CardsListProps {
  cards: IDCard[];
  users: User[];
  projects: Project[];
  selectedCards: string[];
  setSelectedCards: (selectedCards: string[]) => void;
  onPreviewClick: (user: User) => void;
  onUpdateStatus: (
    id: string,
    status: "pending" | "review" | "approved" | "generated",
  ) => void;
  onDownloadCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  canUpdateStatus: (status: string) => boolean;
  canDownloadCard: (status: string) => boolean;
  canDeleteCard: (status: string) => boolean;
}

const CardsList: React.FC<CardsListProps> = ({
  cards,
  users,
  projects,
  selectedCards,
  setSelectedCards,
  onPreviewClick,
  onUpdateStatus,
  onDownloadCard,
  onDeleteCard,
  canUpdateStatus,
  canDownloadCard,
  canDeleteCard,
}) => {
  if (cards.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-4">
          No ID card requests found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {cards.map((card) => {
        const user = users.find((u) => u.id === card.userId);
        const project = projects.find((p) => p.id === card.projectId);

        if (!user || !project) return null;

        return (
          <TableRow key={card.id}>
            <TableCell>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedCards.includes(card.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCards([...selectedCards, card.id]);
                  } else {
                    setSelectedCards(
                      selectedCards.filter((id) => id !== card.id),
                    );
                  }
                }}
              />
            </TableCell>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>
              {new Date(card.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : card.status === "review"
                      ? "bg-blue-100 text-blue-800"
                      : card.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                  }`}
              >
                {card.status === "pending" && (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {card.status === "review" && (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
                {card.status === "approved" && (
                  <Check className="w-3 h-3 mr-1" />
                )}
                {card.status === "generated" && (
                  <Archive className="w-3 h-3 mr-1" />
                )}
                {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPreviewClick(user)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {card.status !== "generated" &&
                  canUpdateStatus(card.status) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onUpdateStatus(card.id, card.status as any)
                      }
                    >
                      {card.status === "pending" && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                      {card.status === "review" && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      {card.status === "approved" && (
                        <Archive className="w-4 h-4 text-purple-600" />
                      )}
                    </Button>
                  )}

                {card.status === "generated" &&
                  canDownloadCard(card.status) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownloadCard(card.id)}
                    >
                      <Download className="w-4 h-4 text-purple-600" />
                    </Button>
                  )}

                {canDeleteCard(card.status) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCard(card.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default CardsList;
