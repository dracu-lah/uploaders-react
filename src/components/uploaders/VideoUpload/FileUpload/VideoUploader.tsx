import { useRef } from "react";
import DropZone from "./DropZone";
import { toast } from "sonner"; // Import toast for error messages
import { useUploadedVideo } from "../useUploadedVideo";

const VideoUploader = ({ onVideoSelected }) => {
  const {
    uploaderWidth: width,
    uploaderHeight: height,
    uploadLimit,
  } = useUploadedVideo(); // Include upload limit
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > uploadLimit) {
        toast.error(`File exceeds the upload limit of ${uploadLimit}MB`);
        return;
      }
      if (file.type === "video/mp4") {
        const reader = new FileReader();
        reader.onload = () => {
          onVideoSelected(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid MP4 video file.");
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
        accept="video/mp4"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <DropZone onDrop={onVideoSelected} />
    </div>
  );
};

export default VideoUploader;
