// FileUpload/PDFUploader.jsx
import { useRef } from "react";
import DropZone from "./DropZone";
import { useUploadedPDF } from "../useUploadedPDF";
import { toast } from "sonner"; // Import toast for error messages

const PDFUploader = ({ onPDFSelected }) => {
  const {
    uploaderWidth: width,
    uploaderHeight: height,
    uploadLimit,
  } = useUploadedPDF(); // Include uploadLimit
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > uploadLimit) {
        toast.error(`File exceeds the upload limit of ${uploadLimit}MB`);
        return;
      }
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = () => {
          onPDFSelected(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid PDF file.");
      }
    }
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <div
      style={{
        overflow: "hidden",
        background: "#EEEDEB",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        width,
        height,
      }}
      onClick={openFileDialog}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <DropZone onDrop={onPDFSelected} />
    </div>
  );
};

export default PDFUploader;
