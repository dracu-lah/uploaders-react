import { useState, useRef } from "react";
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

type ValidationOptions = {
  /** Allowed mime types (e.g. ['image/jpeg', 'image/png']) */
  allowedTypes?: string[];
  /** Minimum width of the image in pixels */
  minWidth?: number;
  /** Minimum height of the image in pixels */
  maxWidth?: number;
  /** Maximum width of the image in pixels */
  minHeight?: number;
  /** Maximum height of the image in pixels */
  maxHeight?: number;
};

type ImageCropProps = {
  /** Function to handle the upload of the cropped image */
  uploadFunction?: (file: File) => Promise<unknown>;
  /** Maximum allowed file size in MB */
  uploadLimit?: number;
  /** Aspect ratio for cropping (width/height) */
  aspect?: number;
  /** Width of the cropper component */
  cropperWidth?: string;
  /** Height of the cropper component */
  cropperHeight?: string;
  /** Width of the uploader component */
  uploaderWidth?: string;
  /** Height of the uploader component */
  uploaderHeight?: string;
  /** Callback when upload completes, returns the response from uploadFunction */
  onUploadResponse?: (response: unknown) => void;
  /** Callback when the image is cropped, returns the cropped image data URL */
  onCropComplete?: (croppedImageDataURL: string | null) => void;
  /** Custom validation options for the uploaded image */
  validationOptions?: ValidationOptions;
  /** Custom error handler function */
  onError?: (errorMessage: string) => void;
  /** Option to disable cropping */
  disableCrop?: boolean;
};

/**
 * Crops an image based on specified area
 *
 * @param image - The source image as a data URL
 * @param croppedAreaPixels - The area to crop
 * @returns A Promise that resolves to the cropped image data URL or null
 */
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

/**
 * Converts a data URL to a File object
 *
 * @param dataURL - The data URL to convert
 * @param imageName - Name for the resulting file (default: "Image")
 * @returns A File object or null if conversion fails
 */
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

/**
 * Validates an image file against provided validation options
 *
 * @param file - The file to validate
 * @param options - Validation options
 * @param onError - Error handler function
 * @returns Boolean indicating if file passes validation
 */
const validateImage = (
  file: File,
  options?: ValidationOptions,
  onError?: (message: string) => void,
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!options) {
      resolve(true);
      return;
    }

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      if (!options.allowedTypes.includes(file.type)) {
        const errorMsg = `File type not allowed. Allowed types: ${options.allowedTypes.join(", ")}`;
        if (onError) onError(errorMsg);
        else console.error(errorMsg);
        resolve(false);
        return;
      }
    }

    // Check dimensions if any dimension constraints exist
    if (
      options.minWidth ||
      options.maxWidth ||
      options.minHeight ||
      options.maxHeight
    ) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (options.minWidth && width < options.minWidth) {
          const errorMsg = `Image width too small. Minimum: ${options.minWidth}px`;
          if (onError) onError(errorMsg);
          else console.error(errorMsg);
          resolve(false);
          return;
        }

        if (options.maxWidth && width > options.maxWidth) {
          const errorMsg = `Image width too large. Maximum: ${options.maxWidth}px`;
          if (onError) onError(errorMsg);
          else console.error(errorMsg);
          resolve(false);
          return;
        }

        if (options.minHeight && height < options.minHeight) {
          const errorMsg = `Image height too small. Minimum: ${options.minHeight}px`;
          if (onError) onError(errorMsg);
          else console.error(errorMsg);
          resolve(false);
          return;
        }

        if (options.maxHeight && height > options.maxHeight) {
          const errorMsg = `Image height too large. Maximum: ${options.maxHeight}px`;
          if (onError) onError(errorMsg);
          else console.error(errorMsg);
          resolve(false);
          return;
        }

        resolve(true);
      };

      img.onerror = () => {
        const errorMsg = "Failed to load image for validation";
        if (onError) onError(errorMsg);
        else console.error(errorMsg);
        resolve(false);
      };

      img.src = URL.createObjectURL(file);
    } else {
      resolve(true);
    }
  });
};

// Component definitions
const DropZone = ({
  onDrop,
  uploadLimit,
  validationOptions,
  onError,
}: {
  onDrop: (dataUrl: string) => void;
  uploadLimit: number;
  validationOptions?: ValidationOptions;
  onError?: (message: string) => void;
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > uploadLimit) {
      const errorMsg = `File exceeds the upload limit of ${uploadLimit}MB`;
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
      return;
    }

    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please upload a valid image file";
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
      return;
    }

    // Validate image if validation options provided
    if (validationOptions) {
      const isValid = await validateImage(file, validationOptions, onError);
      if (!isValid) return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        onDrop(reader.result);
      }
    };
    reader.onerror = () => {
      const errorMsg = "Failed to read the image file";
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
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
  validationOptions,
  onError,
}: {
  onImageSelected: (dataUrl: string) => void;
  uploaderWidth: string;
  uploaderHeight: string;
  uploadLimit: number;
  validationOptions?: ValidationOptions;
  onError?: (message: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > uploadLimit) {
      const errorMsg = `File exceeds the upload limit of ${uploadLimit}MB`;
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
      return;
    }

    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please upload a valid image file";
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
      return;
    }

    // Validate image if validation options provided
    if (validationOptions) {
      const isValid = await validateImage(file, validationOptions, onError);
      if (!isValid) return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        onImageSelected(reader.result);
      }
    };
    reader.onerror = () => {
      const errorMsg = "Failed to read the image file";
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
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
      <DropZone
        onDrop={onImageSelected}
        uploadLimit={uploadLimit}
        validationOptions={validationOptions}
        onError={onError}
      />
    </div>
  );
};

const UploadButton = ({
  imageDataURL,
  uploadFunction,
  onUploadResponse,
  onClearImage,
  onError,
}: {
  imageDataURL: string | null;
  uploadFunction?: (file: File) => Promise<unknown>;
  onUploadResponse?: (response: unknown) => void;
  onClearImage: () => void;
  onError?: (message: string) => void;
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!imageDataURL || !uploadFunction) return;

    const file = dataUrlToImageFile(imageDataURL);
    if (!file) {
      const errorMsg = "Failed to prepare image for upload";
      if (onError) onError(errorMsg);
      else console.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      const response = await uploadFunction(file);
      setSuccess(true);

      if (onUploadResponse) {
        onUploadResponse(response);
      }

      // Auto-clear after success
      setTimeout(onClearImage, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setError(true);

      if (onError) {
        onError(`Upload failed: ${errorMsg}`);
      } else {
        console.error("Upload failed:", errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!imageDataURL) return null;

  return (
    <button
      className={`absolute z-20 flex justify-center items-center right-3 bottom-3 border-none w-12 h-12 text-white rounded-xl ${
        error ? "bg-red-600" : success ? "bg-green-600" : "bg-gray-800"
      }`}
      disabled={loading}
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
  imageDataURL,
  uploadFunction,
  onUploadResponse,
  onError,
}: {
  onClearImage: () => void;
  imageDataURL: string | null;
  uploadFunction?: (file: File) => Promise<unknown>;
  onUploadResponse?: (response: unknown) => void;
  onError?: (message: string) => void;
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
        imageDataURL={imageDataURL}
        uploadFunction={uploadFunction}
        onUploadResponse={onUploadResponse}
        onClearImage={onClearImage}
        onError={onError}
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

/**
 * ImageCrop - A React component for uploading, cropping, and submitting images
 *
 * @component
 */
const ImageCrop = ({
  uploadFunction,
  uploadLimit = 4,
  aspect = 1,
  cropperWidth = "50vw",
  cropperHeight = "50vw",
  uploaderWidth = "50vw",
  uploaderHeight = "50vw",
  onUploadResponse,
  onCropComplete,
  validationOptions,
  onError,
  disableCrop = false,
}: ImageCropProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImageDataURL, setCroppedImageDataURL] = useState<string | null>(
    null,
  );
  const [currentCroppedArea, setCurrentCroppedArea] = useState<Area | null>(
    null,
  );
  const [currentCroppedAreaPixels, setCurrentCroppedAreaPixels] =
    useState<Area | null>(null);

  // Handle image selection with direct upload option if crop is disabled
  const handleImageSelected = (dataUrl: string) => {
    setImage(dataUrl);

    // If crop is disabled, use the original image directly
    if (disableCrop) {
      setCroppedImageDataURL(dataUrl);
      if (onCropComplete) {
        onCropComplete(dataUrl);
      }
    }
  };

  // Handle crop complete
  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    // Store current crop data
    setCurrentCroppedArea(croppedArea);
    setCurrentCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle crop button click - direct approach instead of useEffect
  const handleApplyCrop = async () => {
    if (!image || !currentCroppedAreaPixels) return;

    try {
      const croppedImage = await cropImage(image, currentCroppedAreaPixels);
      setCroppedImageDataURL(croppedImage);

      // Notify parent component about the cropped image
      if (onCropComplete && croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      if (onError) {
        onError(`Error cropping image: ${errorMsg}`);
      } else {
        console.error("Error cropping image:", errorMsg);
      }
    }
  };

  // Reset all state when image is cleared
  const handleClearImage = () => {
    setImage(null);
    setCroppedImageDataURL(null);
    setCurrentCroppedArea(null);
    setCurrentCroppedAreaPixels(null);

    if (onCropComplete) {
      onCropComplete(null);
    }
  };

  return (
    <div className="relative transition-all duration-1000">
      {!image && (
        <ImageUploader
          onImageSelected={handleImageSelected}
          uploaderWidth={uploaderWidth}
          uploaderHeight={uploaderHeight}
          uploadLimit={uploadLimit}
          validationOptions={validationOptions}
          onError={onError}
        />
      )}
      {image && (
        <div>
          <ImageControls
            onClearImage={handleClearImage}
            imageDataURL={disableCrop ? image : croppedImageDataURL}
            uploadFunction={uploadFunction}
            onUploadResponse={onUploadResponse}
            onError={onError}
          />

          {!disableCrop && (
            <>
              <ImageCropper
                image={image}
                aspect={aspect}
                cropperWidth={cropperWidth}
                cropperHeight={cropperHeight}
                onCropComplete={handleCropComplete}
              />

              {/* Apply crop button */}
              {!croppedImageDataURL && (
                <button
                  onClick={handleApplyCrop}
                  disabled={!currentCroppedAreaPixels}
                  className="absolute z-20 bottom-3 left-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Apply Crop
                </button>
              )}

              {/* Preview of cropped image */}
              {croppedImageDataURL && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
                  style={{ width: cropperWidth, height: cropperHeight }}
                >
                  <img
                    src={croppedImageDataURL}
                    alt="Cropped preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={() => setCroppedImageDataURL(null)}
                    className="absolute top-3 right-3 px-2 py-1 bg-yellow-600 text-white rounded-lg"
                  ></button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Public API
export default ImageCrop;

// Export utility functions
export { dataUrlToImageFile, cropImage, validateImage };
export type { Area, Point, ValidationOptions };
