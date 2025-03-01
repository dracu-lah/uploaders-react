// FileUpload/UploadButton.jsx
import { LoaderIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useUploadedPDF } from "./useUploadedPDF";
import { Button } from "@/components/ui/button";

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const UploadButton = ({ pdf, setPDF }) => {
  const { url, onUploadResponse } = useUploadedPDF();

  const mutation = useMutation({
    mutationFn: url,
    onSuccess: (data) => {
      toast.success("Uploaded PDF!");
      setPDF(null);
      if (onUploadResponse) {
        onUploadResponse(data);
      }
    },
    onError: ({ response }) => {
      toast.error("Error Uploading the PDF");
    },
  });

  const handleUpload = () => {
    const mimeType = "application/pdf";
    const blob = base64ToBlob(pdf, mimeType);
    const formData = new FormData();
    formData.append("File", blob, "document.pdf");
    mutation.mutate(formData);
  };

  return (
    <Button
      title="Upload PDF"
      type="button"
      onClick={handleUpload}
      className="bg-gray-500 p-4 text-white hover:bg-gray-600"
    >
      {mutation.isPending ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <UploadIcon />
      )}
    </Button>
  );
};

export default UploadButton;
