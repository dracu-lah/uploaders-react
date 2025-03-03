import { Area } from "react-easy-crop";
import { ValidationOptions } from "./types";

/**
 * Converts a data URL to a File object
 *
 * @param dataURL - The data URL to convert
 * @param imageName - Name for the resulting file (default: "Image")
 * @returns A File object or null if conversion fails
 */
export const dataUrlToImageFile = (
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
export const validateImage = (
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

/**
 * Crops an image based on specified area
 *
 * @param image - The source image as a data URL
 * @param croppedAreaPixels - The area to crop
 * @returns A Promise that resolves to the cropped image data URL or null
 */
export const cropImage = async (
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
