import ImageCrop from "./components/uploaders/ImageCrop";
function App() {
  return (
    <div className="p-12">
      <h1 className="text-2xl mb-8 underline">Uploaders</h1>

      <ImageCrop
        url={``}
        cropperWidth="100%"
        uploaderWidth="100%"
        uploaderHeight="200px"
        cropperHeight="300px"
        aspect={1 / 1}
        onUploadResponse={(response) => {
          console.log("response", response);
        }}
      />
    </div>
  );
}

export default App;
