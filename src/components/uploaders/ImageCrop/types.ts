export type Point = {
  x: number;
  y: number;
};

export type ImageCropProps = {
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

export type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ValidationOptions = {
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
