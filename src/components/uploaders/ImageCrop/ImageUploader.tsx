import { useRef } from "react";
import { useCroppedImage } from "./useCroppedImage";

import { Image } from "lucide-react";

const ImageUploader = ({ onImageSelected }) => {
  const {
    uploaderWidth: width,
    uploaderHeight: height,
    uploadLimit,
  } = useCroppedImage(); // uploadLimit in MB
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > uploadLimit) {
        console.error(`File exceeds the upload limit of ${uploadLimit}MB`);
        return;
      }
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelected(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Please upload a valid image file.");
      }
    }
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  const DropZone = ({ onDrop }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
        if (fileSizeInMB > uploadLimit) {
          console.error(`File exceeds the upload limit of ${uploadLimit}MB`);
          return;
        }
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            onDrop(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          console.error("Please upload a valid image file.");
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
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <DropZone onDrop={onImageSelected} />
    </div>
  );
};

export default ImageUploader;
