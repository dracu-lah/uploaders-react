import { Image } from "lucide-react";
import { useCroppedImage } from "./useCroppedImage";
import { toast } from "sonner";

const DropZone = ({ onDrop }) => {
  const { aspect, uploadLimit } = useCroppedImage(); // uploadLimit is in MB

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > uploadLimit) {
        toast.error(`File exceeds the upload limit of ${uploadLimit}MB`);
        return;
      }
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          onDrop(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid image file.");
      }
    }
  };

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-300 bg-background p-3 dark:border-gray-600"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Size Limit Display */}
      <div className="absolute left-2 top-2 rounded-md border px-2 py-1 font-mono text-xs">
        Limit: {uploadLimit}MB
      </div>

      <Image className="opacity-40" size={64} strokeWidth={1.5} />
      <p className="select-none text-center font-mono text-2xl font-bold opacity-40">
        Drag & Drop Image or&nbsp;
        <span className="underline">Browse</span>
      </p>
    </div>
  );
};

export default DropZone;
