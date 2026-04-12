import { useState } from "react";

export function useReportStep1() {
  const [photo, setPhoto] = useState<File | null>(null);
  return { photo, setPhoto };
}
