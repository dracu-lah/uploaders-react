import { useRef } from "react";
import DropZone from "./DropZone";
import { useCroppedImage } from "./useCroppedImage";
import { toast } from "sonner"; // Import the toast function

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
        toast.error(`File exceeds the upload limit of ${uploadLimit}MB`);
        return;
      }
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelected(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid image file.");
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
