import ImageCrop from "./components/uploaders/ImageCrop";
function App() {
  // Define your upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("ImageFile", file);

    const response = await fetch("your-upload-url", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  };
  return (
    <div className="p-12">
      <h1 className="text-2xl mb-8 underline">Uploaders</h1>

      <ImageCrop
        cropperWidth="100%"
        uploaderWidth="100%"
        uploaderHeight="200px"
        cropperHeight="300px"
        aspect={1 / 1}
        uploadLimit={5}
        uploadFunction={uploadImage}
        onUploadResponse={(response) => {
          console.log("response", response);
        }}
      />
    </div>
  );
}

export default App;
