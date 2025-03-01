import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import CroppedImageContext from "./useCroppedImage";
import { cropImage } from "./cropImage";
import Cropper from "react-easy-crop";
import { useCroppedImage } from "./useCroppedImage";

import { UploadImageAPI } from "./api";
import { ErrorIcon, LoaderIcon, SuccessIcon, UploadIcon } from "./icons";
import { dataUrlToImageFile } from "./dataUrlToImageFile";

const ImageCrop = ({
  api,
  uploadLimit = 4,
  aspect = 4 / 4,
  cropperWidth = "50vw",
  cropperHeight = "50vw",
  uploaderWidth = "50vw",
  uploaderHeight = "50vw",
  onUploadResponse,
}) => {
  const [image, setImage] = useState(null);
  const [croppedImageDataURL, setCroppedImageDataURL] = useState(null);
  const onCropComplete = (_, croppedAreaPixels) => {
    const croppedImage = cropImage(image, croppedAreaPixels);
    setCroppedImageDataURL(croppedImage);
  };

  useEffect(() => {
    if (image === null) setCroppedImageDataURL(null);
  }, [image]);

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

  const backgroundColor = (error, success) => {
    if (error) {
      return "#C40C0C";
    } else if (success) {
      return "#40A578";
    } else {
      return "#31363F";
    }
  };
  const ImageControls = ({ onClearImage }) => {
    return (
      <div>
        <button
          onClick={onClearImage}
          style={{
            borderRadius: "100%",
            position: "absolute",
            cursor: "pointer",
            zIndex: 20,
            border: "none",
            width: "32px",
            height: "32px",
            color: "white",
            backgroundColor: "#C40C0C",
            left: "-10px",
            top: "-10px",
            fontWeight: "bold",
          }}
        >
          X
        </button>
        <UploadImageButton onClearImage={onClearImage} />
      </div>
    );
  };

  const ImageCropper = ({ image, onCropComplete }) => {
    const {
      aspect,
      cropperWidth: width,
      cropperHeight: height,
    } = useCroppedImage();
    const [crop, setCrop] = useState({ x: 0, y: 0 });

    return (
      <div
        style={{
          position: "relative",
          height,
          width,
          borderRadius: "12px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </div>
    );
  };
  return (
    <CroppedImageContext.Provider
      value={{
        croppedImageDataURL,
        api,
        aspect,
        cropperWidth,
        cropperHeight,
        uploaderWidth,
        uploaderHeight,
        onUploadResponse,
        uploadLimit,
      }}
    >
      <div style={{ position: "relative", transition: "10s" }}>
        {!image && <ImageUploader onImageSelected={setImage} />}
        {image && (
          <div>
            <ImageControls onClearImage={() => setImage(null)} />
            <ImageCropper image={image} onCropComplete={onCropComplete} />
          </div>
        )}
      </div>
    </CroppedImageContext.Provider>
  );
};

export default ImageCrop;
