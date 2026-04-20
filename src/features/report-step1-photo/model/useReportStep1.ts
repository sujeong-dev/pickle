import { useState } from "react";
import type { OcrResult } from "@/shared/api/report";

export function useReportStep1() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [r2Key, setR2Key] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  const resetOcr = () => {
    setJobId(null);
    setOcrResult(null);
    setR2Key(null);
  };

  const removePhoto = () => {
    setPhoto(null);
    resetOcr();
  };

  return {
    photo,
    setPhoto,
    r2Key,
    setR2Key,
    jobId,
    setJobId,
    ocrResult,
    setOcrResult,
    removePhoto,
  };
}
