"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReceiptOcrStatus, type OcrReceiptResult } from "@/shared/api";

const POLL_INTERVAL = 1500;
const TIMEOUT_MS = 60_000;

type Outcome =
  | { kind: "pending" }
  | { kind: "completed"; result: OcrReceiptResult }
  | { kind: "failed"; reason: string }
  | { kind: "timeout" };

export function useReceiptOcr(jobId: string | null): Outcome {
  const [isTimeout, setIsTimeout] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const { data } = useQuery({
    queryKey: ["ocr", "receipt", jobId],
    queryFn: () => getReceiptOcrStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      if (
        startedAtRef.current !== null &&
        Date.now() - startedAtRef.current > TIMEOUT_MS
      ) {
        return false;
      }
      return POLL_INTERVAL;
    },
  });

  useEffect(() => {
    if (!jobId) {
      startedAtRef.current = null;
      return;
    }
    // 새 jobId가 시작되면 이전 timeout 플래그 리셋 (정당한 reset on new key 패턴)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTimeout(false);
    startedAtRef.current = Date.now();
    const timer = setTimeout(() => setIsTimeout(true), TIMEOUT_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [jobId]);

  return useMemo<Outcome>(() => {
    if (!jobId) return { kind: "pending" };
    if (data?.status === "completed" && data.result) {
      return { kind: "completed", result: data.result };
    }
    if (data?.status === "failed") {
      return { kind: "failed", reason: data.failedReason ?? "OCR 실패" };
    }
    if (isTimeout) return { kind: "timeout" };
    return { kind: "pending" };
  }, [jobId, data, isTimeout]);
}
