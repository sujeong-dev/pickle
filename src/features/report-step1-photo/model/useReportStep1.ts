import { useState } from "react";
import type { OcrResult } from "@/shared/api/report";

export function useReportStep1() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  const resetOcr = () => {
    setJobId(null);
    setOcrResult(null);
    setFileUrl(null);
  };

  const removePhoto = () => {
    setPhoto(null);
    resetOcr();
  };

  return {
    photo,
    setPhoto,
    fileUrl,
    setFileUrl,
    jobId,
    setJobId,
    ocrResult,
    setOcrResult,
    removePhoto,
  };
}
