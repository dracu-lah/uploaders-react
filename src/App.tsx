import ImageCrop from "./components/uploaders/ImageCrop";
function App() {
  return (
    <>
      <h1>Uploaders</h1>

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
    </>
  );
}

export default App;
