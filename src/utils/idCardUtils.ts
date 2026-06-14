import { User, Project, IDCard } from "@/contexts/AppContext";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { toJpeg, toPng } from "html-to-image";
import { generateIDCardHTML } from "./idCardTemplate";

const waitForElementRender = (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (element.offsetHeight > 0 && element.offsetWidth > 0) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Fallback timeout
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 1000);
  });
};

export const exportSinglePDF = async (
  card: IDCard,
  users: User[],
  projects: Project[],
  onSuccess: (userName: string) => void,
  onError: (message: string) => void,
) => {
  const user = users.find((u) => u.id === card.userId);
  const project = projects.find((p) => p.id === card.projectId);

  if (!user) {
    onError("User not found.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [210, 297],
  });

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "-10000px";
  container.style.width = "793px";
  container.style.height = "559px";
  container.style.backgroundColor = "#ffffff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.border = "1px solid transparent";
  container.style.overflow = "visible";

  const cardElement = document.createElement("div");
  cardElement.style.width = "100%";
  cardElement.style.height = "100%";
  cardElement.style.backgroundColor = "#ffffff";
  cardElement.style.position = "relative";
  cardElement.innerHTML = generateIDCardHTML(user, project, card.status);

  container.appendChild(cardElement);
  document.body.appendChild(container);

  try {
    await waitForElementRender(cardElement);
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("Element dimensions:", {
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight,
      scrollWidth: cardElement.scrollWidth,
      scrollHeight: cardElement.scrollHeight,
    });

    let dataUrl: string;

    try {
      dataUrl = await toPng(cardElement, {
        width: 793,
        height: 559,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
        skipAutoScale: true,
        filter: (node) => {
          return true;
        },
      });
    } catch (pngError) {
      console.warn("PNG capture failed, trying JPEG:", pngError);
      // Fallback to JPEG
      dataUrl = await toJpeg(cardElement, {
        quality: 1.0,
        width: 793,
        height: 559,
        backgroundColor: "#ffffff",
        pixelRatio: 1,
        cacheBust: true,
        skipAutoScale: true,
      });
    }

    if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) {
      throw new Error("Generated image is empty or invalid");
    }

    document.body.removeChild(container);

    doc.addImage(
      dataUrl,
      dataUrl.includes("data:image/png") ? "PNG" : "JPEG",
      0,
      74.5,
      210,
      148,
    );
    doc.save(`${user.name.replace(/\s+/g, "_")}_ID_Card.pdf`);

    onSuccess(user.name);
  } catch (error) {
    console.error("Error rendering card:", error);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    onError(`Error generating PDF: ${error.message}`);
  }
};

export const exportSinglePDFDebug = async (
  card: IDCard,
  users: User[],
  projects: Project[],
  onSuccess: (userName: string) => void,
  onError: (message: string) => void,
) => {
  const user = users.find((u) => u.id === card.userId);
  const project = projects.find((p) => p.id === card.projectId);

  if (!user) {
    onError("User not found.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [210, 297],
  });

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "50px";
  container.style.left = "50px";
  container.style.width = "793px";
  container.style.height = "559px";
  container.style.backgroundColor = "#ffffff";
  container.style.border = "2px solid red";
  container.style.zIndex = "9999";
  container.style.transform = "scale(0.3)";
  container.style.transformOrigin = "top left";

  const cardElement = document.createElement("div");
  cardElement.style.width = "100%";
  cardElement.style.height = "100%";
  cardElement.style.backgroundColor = "#ffffff";
  cardElement.innerHTML = generateIDCardHTML(user, project, card.status);

  container.appendChild(cardElement);
  document.body.appendChild(container);

  try {
    // Wait and let user see the element
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const dataUrl = await toPng(container, {
      width: 793,
      height: 559,
      backgroundColor: "#ffffff",
      pixelRatio: 1,
    });

    document.body.removeChild(container);

    doc.addImage(dataUrl, "PNG", 0, 74.5, 210, 148);
    doc.save(`${user.name.replace(/\s+/g, "_")}_ID_Card_Debug.pdf`);

    onSuccess(user.name);
  } catch (error) {
    console.error("Error rendering card:", error);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    onError(`Error generating PDF: ${error.message}`);
  }
};

// Export multiple ID cards as a zip file
export const exportCardsAsZip = async (
  exportCards: IDCard[],
  users: User[],
  projects: Project[],
  onSuccess: (count: number) => void,
  onError: (message: string) => void,
) => {
  const zip = new JSZip();
  const pdfFolder = zip.folder("id-cards");

  for (let i = 0; i < exportCards.length; i++) {
    const card = exportCards[i];
    const user = users.find((u) => u.id === card.userId);
    const project = projects.find((p) => p.id === card.projectId);

    if (!user) continue;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [210, 297],
    });

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "-10000px";
    container.style.width = "793px";
    container.style.height = "559px";
    container.style.backgroundColor = "#ffffff";

    const cardElement = document.createElement("div");
    cardElement.style.width = "100%";
    cardElement.style.height = "100%";
    cardElement.style.backgroundColor = "#ffffff";
    cardElement.innerHTML = generateIDCardHTML(user, project, card.status);

    container.appendChild(cardElement);
    document.body.appendChild(container);

    try {
      await waitForElementRender(cardElement);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const dataUrl = await toPng(cardElement, {
        width: 793,
        height: 559,
        backgroundColor: "#ffffff",
        pixelRatio: 1,
      });

      document.body.removeChild(container);

      doc.addImage(dataUrl, "PNG", 0, 74.5, 210, 148);

      if (pdfFolder) {
        const pdfOutput = doc.output("arraybuffer");
        pdfFolder.file(
          `${user.name.replace(/\s+/g, "_")}_ID_Card.pdf`,
          pdfOutput,
        );
      }
    } catch (error) {
      console.error("Error rendering card:", error);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  }

  try {
    const zipContent = await zip.generateAsync({ type: "blob" });
    saveAs(zipContent, "id-cards.zip");
    onSuccess(exportCards.length);
  } catch (error) {
    console.error("Error creating zip:", error);
    onError("Failed to create zip file");
  }
};

// Rest of the functions remain the same...
export const exportAllUsersToExcel = (
  users: User[],
  onSuccess: (count: number) => void,
) => {
  const workbook = XLSX.utils.book_new();
  const data = users.map((user) => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    "UID No": user.uidNo || "",
    "ID No": user.idNo || "",
    "Contractor Name & Address": user.contractor || "",
    "Blood Group": user.bloodGroup || "",
    "Emergency Contact": user.emergencyContact || "",
    "Date of Induction": user.inductionDate || "",
    "Valid Till": user.validTill || "",
    "Date of Birth": user.dob || "",
    "Health Checkup Date": user.healthCheckupDate || "",
    "Safety Violation": user.safetyViolation || "",
    "Safety Incharge": user.safetyIncharge || "",
    "HR Executive": user.hrExecutive || "",
    Address: user.address || "",
    Projects: user.projectIds.length,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Users");
  XLSX.writeFile(workbook, "all-users-data.xlsx");
  onSuccess(users.length);
};

export const exportSelectedCardsToExcel = (
  idCards: IDCard[],
  selectedCardIds: string[],
  users: User[],
  projects: Project[],
  onSuccess: (count: number) => void,
) => {
  const exportCards = idCards.filter((card) =>
    selectedCardIds.includes(card.id),
  );
  const workbook = XLSX.utils.book_new();

  const data = exportCards
    .map((card) => {
      const user = users.find((u) => u.id === card.userId);
      const project = projects.find((p) => p.id === card.projectId);
      if (!user) return null;

      return {
        Name: user.name,
        "UID No": user.uidNo || "",
        "ID No": user.idNo || "",
        "Contractor Name & Address": user.contractor || "",
        "Blood Group": user.bloodGroup || "",
        "Emergency Contact": user.emergencyContact || "",
        "Date of Induction": user.inductionDate || "",
        "Valid Till": user.validTill || "",
        "Date of Birth": user.dob || "",
        "Health Checkup Date": user.healthCheckupDate || "",
        "Safety Violation": user.safetyViolation || "",
        "Safety Incharge": user.safetyIncharge || "",
        "HR Executive": user.hrExecutive || "",
        Project: project?.name || "",
        Status: card.status,
        "Created At": new Date(card.createdAt).toLocaleDateString(),
        "Reviewed At": card.reviewedAt
          ? new Date(card.reviewedAt).toLocaleDateString()
          : "",
        "Approved At": card.approvedAt
          ? new Date(card.approvedAt).toLocaleDateString()
          : "",
        "Generated At": card.generatedAt
          ? new Date(card.generatedAt).toLocaleDateString()
          : "",
      };
    })
    .filter(Boolean);

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "ID Cards");
  XLSX.writeFile(workbook, "id-cards.xlsx");
  onSuccess(exportCards.length);
};

export const sendEmailNotification = async (
  email: string,
  subject: string,
  message: string,
) => {
  // yet to add email services, for now just keeping it
  console.log("Email notification:", { email, subject, message });
};
