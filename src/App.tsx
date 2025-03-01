import VideoUpload from "./components/uploaders/VideoUpload";

function App() {
  return (
    <>
      <h1>Uploaders</h1>

      <VideoUpload
        api={UploadBannerVideoAPI}
        aspect={83 / 45}
        cropperWidth="100%"
        uploaderWidth="100%"
        uploaderHeight="200px"
        cropperHeight="300px"
        onUploadResponse={(response) => {
          console.log("response", response);
        }}
      />
    </>
  );
}

export default App;
