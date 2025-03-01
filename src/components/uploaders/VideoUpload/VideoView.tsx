import React from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { XIcon } from "lucide-react";
import UploadButton from "./UploadButton";
import { useUploadedVideo } from "./useUploadedVideo";

const VideoView = ({ video, setVideo }) => {
  const { uploaderWidth: width, uploaderHeight: height } = useUploadedVideo();
  return (
    <Card style={{ width }} className="w-full space-y-2 p-4">
      <video controls className="w-full rounded-lg">
        <source src={video} type="video/mp4" />
      </video>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={() => setVideo(null)}
          className="bg-red-500 p-4 text-white hover:bg-red-600"
        >
          <XIcon />
        </Button>
        <UploadButton video={video} setVideo={setVideo} />
      </div>
    </Card>
  );
};

export default VideoView;
