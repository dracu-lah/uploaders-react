import { createContext, useContext } from "react";

// Create a context to manage the uploaded video data URL
const UploadedVideoContext = createContext();

// Custom hook to access the uploaded video data URL from other components
export const useUploadedVideo = () => useContext(UploadedVideoContext);

export default UploadedVideoContext;
