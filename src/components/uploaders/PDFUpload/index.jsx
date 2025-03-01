// PDFUpload.jsx
import { useState } from "react";
import PDFUploader from "./FileUpload/PDFUploader";
import PDFView from "./PDFView";
import UploadedPDFContext from "./useUploadedPDF";

const PDFUpload = ({
  url,
  uploaderWidth = "50vw",
  uploadLimit = 4,
  uploaderHeight = "50vw",
  onUploadResponse,
}) => {
  const [pdf, setPDF] = useState(null);
  return (
    <UploadedPDFContext.Provider
      value={{
        url,
        uploaderWidth,
        uploaderHeight,
        uploadLimit,
        onUploadResponse,
      }}
    >
      <div style={{ transition: "10s" }}>
        {!pdf && <PDFUploader onPDFSelected={setPDF} />}
        {pdf && (
          <div>
            <PDFView pdf={pdf} setPDF={setPDF} />
          </div>
        )}
      </div>
    </UploadedPDFContext.Provider>
  );
};

export default PDFUpload;
