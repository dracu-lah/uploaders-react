import { LoaderIcon, UploadIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useUploadedVideo } from "./useUploadedVideo";

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const UploadButton = ({ video, setVideo }) => {
  const { url, onUploadResponse } = useUploadedVideo();
  const mutation = useMutation({
    mutationFn: url,
    onSuccess: (data) => {
      toast.success("Uploaded Video!");
      setVideo(null);
      if (onUploadResponse) {
        onUploadResponse(data);
      }
    },
    onError: ({ response }) => {
      toast.error("Error Uploading the video");
    },
  });

  const handleUpload = () => {
    const mimeType = video.split(";")[0].split(":")[1]; // Extract the mime type
    const blob = base64ToBlob(video, mimeType);
    const formData = new FormData();
    formData.append("VideoFile", blob, "video.mp4"); // Append blob with a filename
    mutation.mutate(formData);
  };

  return (
    <Button
      title="Upload Video"
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
