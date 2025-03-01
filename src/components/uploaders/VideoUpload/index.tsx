import { useEffect, useState } from "react";
import VideoUploader from "./FileUpload/VideoUploader";
import VideoView from "./VideoView";
import UploadedVideoContext from "./useUploadedVideo";

const VideoUpload = ({
  api,
  aspect = 4 / 4,
  uploadLimit = 25,
  cropperWidth = "50vw",
  cropperHeight = "50vw",
  uploaderWidth = "50vw",
  uploaderHeight = "50vw",

  onUploadResponse,
}) => {
  const [video, setVideo] = useState(null);
  return (
    <UploadedVideoContext.Provider
      value={{
        api,
        aspect,
        cropperWidth,
        cropperHeight,
        uploadLimit,
        uploaderWidth,
        uploaderHeight,
        onUploadResponse,
      }}
    >
      <div style={{ transition: "10s" }}>
        {!video && <VideoUploader onVideoSelected={setVideo} />}
        {video && (
          <div>
            <VideoView video={video} setVideo={setVideo} />
          </div>
        )}
      </div>
    </UploadedVideoContext.Provider>
  );
};

export default VideoUpload;
