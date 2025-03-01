function App() {
  return (
    <>
      <h1>Uploaders</h1>

      <ImageCrop
        url={`${BASE_URL}${endPoint.sendBannerImage}`}
        cropperWidth="100%"
        uploaderWidth="100%"
        uploaderHeight="200px"
        cropperHeight="300px"
        aspect={aspectRatio}
        onUploadResponse={(response) => {
          setBannerImages([response.data]);
        }}
      />
      <ImageList imageUrls={bannerImages} setImageUrls={setBannerImages} />
    </>
  );
}

export default App;
