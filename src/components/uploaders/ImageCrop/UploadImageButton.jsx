import { useEffect, useState } from "react";
import { UploadImageAPI } from "./api";
import { ErrorIcon, LoaderIcon, SuccessIcon, UploadIcon } from "./icons";
import { dataUrlToImageFile } from "./dataUrlToImageFile";
import { useCroppedImage } from "./useCroppedImage";

const UploadImageButton = ({ onClearImage }) => {
  const { croppedImageDataURL, api, onUploadResponse } = useCroppedImage();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError(false);
      setSuccess(false);
      const response = await UploadImageAPI(api, file);
      setSuccess(true);
      if (onUploadResponse) {
        onUploadResponse(response);
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (croppedImageDataURL) {
      const data = dataUrlToImageFile({
        croppedImageDataURL,
        imageName: "Image",
      });
      setFile(data);
      setDisabled(false);
    } else {
      setFile(null);
      setDisabled(true);
    }
  }, [croppedImageDataURL]);

  useEffect(() => {
    if (success) {
      setTimeout(onClearImage, 2000);
    }
  }, [success]);

  if (croppedImageDataURL === null) return;
  return (
    <button
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        right: 10,
        bottom: 10,
        position: "absolute",
        zIndex: 20,
        border: "none",
        width: "42px",
        height: "42px",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: backgroundColor(error, success),
        borderRadius: "12px",
      }}
      disabled={disabled || loading}
      onClick={handleUpload}
      title="Upload Image"
    >
      {!error && !loading && !success && <UploadIcon />}
      {success && <SuccessIcon />}
      {loading && <LoaderIcon />}
      {error && <ErrorIcon />}
    </button>
  );
};

export default UploadImageButton;

const backgroundColor = (error, success) => {
  if (error) {
    return "#C40C0C";
  } else if (success) {
    return "#40A578";
  } else {
    return "#31363F";
  }
};
