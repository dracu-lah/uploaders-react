// PDFView.jsx
import React from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { XIcon } from "lucide-react";
import UploadButton from "./UploadButton";
import { useUploadedPDF } from "./useUploadedPDF";

const PDFView = ({ pdf, setPDF }) => {
  const { uploaderWidth: width } = useUploadedPDF();

  return (
    <Card style={{ width }} className="w-full space-y-2 p-4">
      <iframe
        src={pdf}
        className="w-full rounded-lg"
        style={{ height: "500px" }}
        title="PDF Preview"
      />
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={() => setPDF(null)}
          className="bg-red-500 p-4 text-white hover:bg-red-600"
        >
          <XIcon />
        </Button>
        <UploadButton pdf={pdf} setPDF={setPDF} />
      </div>
    </Card>
  );
};

export default PDFView;
