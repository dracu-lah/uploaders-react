# @dracu/uploaders

A versatile collection of uploaders and media handling components for React applications.

[![npm version](https://img.shields.io/npm/v/@dracu/uploaders.svg)](https://www.npmjs.com/package/@dracu/uploaders)
[![license](https://img.shields.io/npm/l/@dracu/uploaders.svg)](https://github.com/yourusername/uploaders/blob/main/LICENSE)

## Features

- 🖼️ Image upload with drag-and-drop support
- ✂️ Image cropping with customizable aspect ratio
- 🚀 Built-in validation options
- 🎨 Fully customizable dimensions
- 🌙 Dark mode compatible
- 📤 Upload function integration

## Installation

```bash
npm install @dracu/uploaders
```

or

```bash
yarn add @dracu/uploaders
```

## Dependencies

This package requires the following dependencies:

```json
"peerDependencies": {
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0",
  "react-easy-crop": "^5.0.0",
  "lucide-react": "^0.263.0"
}
```

If you don't have these dependencies installed, you'll need to install them:

```bash
npm install react-easy-crop lucide-react
```

## Quick Start

```jsx
import { ImageCrop } from "@dracu/uploaders";

function App() {
  const handleCropComplete = (croppedImageDataURL) => {
    console.log("Cropped image:", croppedImageDataURL);
    // Do something with the cropped image
  };

  const handleUploadResponse = (response) => {
    console.log("Upload response:", response);
    // Handle the upload response
  };

  const uploadFunction = async (file) => {
    // Example upload function
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://your-upload-endpoint.com/upload", {
      method: "POST",
      body: formData,
    });

    return response.json();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Upload Example</h1>

      <ImageCrop
        uploadFunction={uploadFunction}
        onCropComplete={handleCropComplete}
        onUploadResponse={handleUploadResponse}
        uploadLimit={5}
        aspect={16 / 9}
      />
    </div>
  );
}

export default App;
```

## Components

### ImageCrop

The main component for image uploading and cropping.

#### Props

| Prop                | Type                                            | Default     | Description                                 |
| ------------------- | ----------------------------------------------- | ----------- | ------------------------------------------- |
| `uploadFunction`    | `(file: File) => Promise<unknown>`              | `undefined` | Function to handle the image upload         |
| `uploadLimit`       | `number`                                        | `4`         | Maximum file size in MB                     |
| `aspect`            | `number`                                        | `1`         | Aspect ratio for the cropper (width/height) |
| `cropperWidth`      | `string`                                        | `"50vw"`    | Width of the cropper container              |
| `cropperHeight`     | `string`                                        | `"50vw"`    | Height of the cropper container             |
| `uploaderWidth`     | `string`                                        | `"50vw"`    | Width of the uploader container             |
| `uploaderHeight`    | `string`                                        | `"50vw"`    | Height of the uploader container            |
| `onUploadResponse`  | `(response: unknown) => void`                   | `undefined` | Callback when upload completes              |
| `onCropComplete`    | `(croppedImageDataURL: string \| null) => void` | `undefined` | Callback when crop is applied               |
| `validationOptions` | `ValidationOptions`                             | `undefined` | Options for image validation                |
| `onError`           | `(message: string) => void`                     | `undefined` | Error handling callback                     |
| `disableCrop`       | `boolean`                                       | `false`     | Disable cropping functionality              |

#### ValidationOptions

You can provide validation options to ensure uploaded images meet specific requirements:

```typescript
interface ValidationOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  acceptedFormats?: string[];
}
```

## Styling

The component uses Tailwind CSS classes for styling. If you're using Tailwind CSS in your project, the component will use your custom theme. If not, you'll need to include the base Tailwind CSS styles.

## Icons

The component uses [Lucide React](https://lucide.dev/) for icons. Make sure you have it installed:

```bash
npm install lucide-react
```

## Advanced Usage

### Custom Validation

```jsx
<ImageCrop
  validationOptions={{
    minWidth: 800,
    minHeight: 600,
    acceptedFormats: ["image/jpeg", "image/png"],
  }}
  onError={(errorMessage) => {
    toast.error(errorMessage); // Using your preferred toast library
  }}
  // other props...
/>
```

### Disabling Crop Functionality

```jsx
<ImageCrop
  disableCrop={true}
  // Use it as a simple image uploader
  // other props...
/>
```

### Custom Dimensions

```jsx
<ImageCrop
  cropperWidth="400px"
  cropperHeight="300px"
  uploaderWidth="400px"
  uploaderHeight="300px"
  // other props...
/>
```

### Custom Aspect Ratio

```jsx
<ImageCrop
  aspect={4 / 3} // 4:3 aspect ratio
  // other props...
/>
```

## Handling Uploads

The `uploadFunction` prop should be a function that takes a `File` object and returns a Promise. This function is responsible for sending the file to your server or storage service.

```jsx
const uploadToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://your-api.com/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
};

<ImageCrop uploadFunction={uploadToServer} />;
```

## Upcoming Features

- More upload components for different file types
- Video uploading and trimming
- File progress uploaders
- Multiple file upload support
- And more!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
