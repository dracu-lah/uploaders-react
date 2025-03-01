import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import ImageCropper from "./ImageCropper";
import ImageControls from "./ImageControls";
import CroppedImageContext from "./useCroppedImage";
import { cropImage } from "./cropImage";

const ImageCrop = ({
  url,
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
  return (
    <CroppedImageContext.Provider
      value={{
        croppedImageDataURL,
        url,
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
