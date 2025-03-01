import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import CroppedImageContext from "./useCroppedImage";
import { cropImage } from "./cropImage";
import Cropper from "react-easy-crop";
import { useCroppedImage } from "./useCroppedImage";
import UploadImageButton from "./UploadImageButton";
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
