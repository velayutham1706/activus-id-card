import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Project } from "@/contexts/AppContext";
import { generateIDCardHTML } from "@/utils/idCardTemplate";

interface CardPreviewDialogProps {
  showPreviewDialog: boolean;
  setShowPreviewDialog: (show: boolean) => void;
  previewUser: User | null;
  project?: Project;
}

const CardPreviewDialog: React.FC<CardPreviewDialogProps> = ({
  showPreviewDialog,
  setShowPreviewDialog,
  previewUser,
  project,
}) => {
  return (
    <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle>ID Card Preview</DialogTitle>
          <DialogDescription>
            Preview how the ID card will look for the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto p-4">
          {previewUser && (
            <div
              className="scale-100 origin-top-left md:scale-[0.9] lg:scale-100 mx-auto"
              dangerouslySetInnerHTML={{
                __html: generateIDCardHTML(previewUser, project),
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardPreviewDialog;
