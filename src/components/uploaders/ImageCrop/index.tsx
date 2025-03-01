import { useEffect, useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { Image, Upload, X, Check, AlertCircle, Loader } from "lucide-react";

// Types
type Point = {
  x: number;
  y: number;
};

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ImageCropProps = {
  uploadFunction?: (file: File) => Promise<unknown>;
  uploadLimit?: number;
  aspect?: number;
  cropperWidth?: string;
  cropperHeight?: string;
  uploaderWidth?: string;
  uploaderHeight?: string;
  onUploadResponse?: (response: unknown) => void;
};

// Utility functions
const cropImage = async (
  image: string,
  croppedAreaPixels: Area,
): Promise<string | null> => {
  if (!image || !croppedAreaPixels) return null;

  return new Promise<string | null>((resolve) => {
    const canvas = document.createElement("canvas");
    const imageElement = document.createElement("img");
    imageElement.src = image;

    imageElement.onload = () => {
      const scaleX = imageElement.naturalWidth / imageElement.width;
      const scaleY = imageElement.naturalHeight / imageElement.height;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      // Determine MIME type from the input data URL
      const mimeType =
        image.match(/data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
      resolve(canvas.toDataURL(mimeType));
    };
  });
};

const dataUrlToImageFile = (
  dataURL: string,
  imageName: string = "Image",
): File | null => {
  if (!dataURL) return null;

  // Convert base64 to Blob
  const byteCharacters = atob(dataURL.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const mimeType =
    dataURL.match(/data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
  const extension = mimeType.split("/")[1];
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], `${imageName}.${extension}`, { type: mimeType });
};

// Component definitions
const DropZone = ({
  onDrop,
  uploadLimit,
}: {
  onDrop: (dataUrl: string) => void;
  uploadLimit: number;
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > uploadLimit) {
      console.error(`File exceeds the upload limit of ${uploadLimit}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        onDrop(reader.result);
      }
    };
    reader.readAsDataURL(file);
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

const ImageUploader = ({
  onImageSelected,
  uploaderWidth,
  uploaderHeight,
  uploadLimit,
}: {
  onImageSelected: (dataUrl: string) => void;
  uploaderWidth: string;
  uploaderHeight: string;
  uploadLimit: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > uploadLimit) {
      console.error(`File exceeds the upload limit of ${uploadLimit}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      className="overflow-hidden bg-gray-100 rounded-xl flex justify-center items-center cursor-pointer"
      style={{ width: uploaderWidth, height: uploaderHeight }}
      onClick={openFileDialog}
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <DropZone onDrop={onImageSelected} uploadLimit={uploadLimit} />
    </div>
  );
};

const UploadButton = ({
  croppedImageDataURL,
  uploadFunction,
  onUploadResponse,
  onClearImage,
}: {
  croppedImageDataURL: string | null;
  uploadFunction?: (file: File) => Promise<unknown>;
  onUploadResponse?: (response: unknown) => void;
  onClearImage: () => void;
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (croppedImageDataURL) {
      const imageFile = dataUrlToImageFile(croppedImageDataURL);
      setFile(imageFile);
      setDisabled(!imageFile);
    } else {
      setFile(null);
      setDisabled(true);
    }
  }, [croppedImageDataURL]);

  useEffect(() => {
    if (success) {
      setTimeout(onClearImage, 2000);
    }
  }, [success, onClearImage]);

  const handleUpload = async () => {
    if (!file || !uploadFunction) return;

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      const response = await uploadFunction(file);
      setSuccess(true);

      if (onUploadResponse) {
        onUploadResponse(response);
      }
    } catch (error) {
      console.error(
        "Upload failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!croppedImageDataURL) return null;

  return (
    <button
      className={`absolute z-20 flex justify-center items-center right-3 bottom-3 border-none w-12 h-12 text-white rounded-xl ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${error ? "bg-red-600" : success ? "bg-green-600" : "bg-gray-800"}`}
      disabled={disabled || loading}
      onClick={handleUpload}
      title="Upload Image"
    >
      {!error && !loading && !success && <Upload size={24} />}
      {success && <Check size={24} />}
      {loading && <Loader size={24} className="animate-spin" />}
      {error && <AlertCircle size={24} />}
    </button>
  );
};

const ImageControls = ({
  onClearImage,
  croppedImageDataURL,
  uploadFunction,
  onUploadResponse,
}: {
  onClearImage: () => void;
  croppedImageDataURL: string | null;
  uploadFunction?: (file: File) => Promise<unknown>;
  onUploadResponse?: (response: unknown) => void;
}) => {
  return (
    <div>
      <button
        onClick={onClearImage}
        className="absolute z-20 rounded-full cursor-pointer border-none w-8 h-8 text-white bg-red-600 -left-2 -top-2 font-bold flex items-center justify-center"
      >
        <X size={16} />
      </button>
      <UploadButton
        croppedImageDataURL={croppedImageDataURL}
        uploadFunction={uploadFunction}
        onUploadResponse={onUploadResponse}
        onClearImage={onClearImage}
      />
    </div>
  );
};

const ImageCropper = ({
  image,
  aspect,
  cropperWidth,
  cropperHeight,
  onCropComplete,
}: {
  image: string;
  aspect: number;
  cropperWidth: string;
  cropperHeight: string;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div
      className="relative rounded-xl overflow-hidden box-border"
      style={{ height: cropperHeight, width: cropperWidth }}
    >
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
  );
};

// Main component
const ImageCrop = ({
  uploadFunction,
  uploadLimit = 4,
  aspect = 1,
  cropperWidth = "50vw",
  cropperHeight = "50vw",
  uploaderWidth = "50vw",
  uploaderHeight = "50vw",
  onUploadResponse,
}: ImageCropProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImageDataURL, setCroppedImageDataURL] = useState<string | null>(
    null,
  );

  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    if (!image) return;

    try {
      const croppedImage = await cropImage(image, croppedAreaPixels);
      setCroppedImageDataURL(croppedImage);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // Reset cropped image when source image is cleared
  useEffect(() => {
    if (image === null) setCroppedImageDataURL(null);
  }, [image]);

  return (
    <div className="relative transition-all duration-1000">
      {!image && (
        <ImageUploader
          onImageSelected={setImage}
          uploaderWidth={uploaderWidth}
          uploaderHeight={uploaderHeight}
          uploadLimit={uploadLimit}
        />
      )}
      {image && (
        <div>
          <ImageControls
            onClearImage={() => setImage(null)}
            croppedImageDataURL={croppedImageDataURL}
            uploadFunction={uploadFunction}
            onUploadResponse={onUploadResponse}
          />
          <ImageCropper
            image={image}
            aspect={aspect}
            cropperWidth={cropperWidth}
            cropperHeight={cropperHeight}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
    </div>
  );
};

// Public API
export default ImageCrop;
