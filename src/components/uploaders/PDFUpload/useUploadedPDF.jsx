// useUploadedPDF.js
import { createContext, useContext } from "react";

const UploadedPDFContext = createContext();

export const useUploadedPDF = () => useContext(UploadedPDFContext);
export default UploadedPDFContext;
