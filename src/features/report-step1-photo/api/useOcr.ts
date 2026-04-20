import { useMutation, useQuery } from '@tanstack/react-query'
import { getPresignedUrl, requestOcr, getOcrStatus } from '@/shared/api/report'

export const ocrKeys = {
  all: ['ocr'] as const,
  status: (jobId: string) => [...ocrKeys.all, 'status', jobId] as const,
}

export function useUploadPresigned() {
  return useMutation({
    mutationFn: (body: { fileType: string; purpose: string }) => getPresignedUrl(body),
  })
}

export function useOcrProduct() {
  return useMutation({
    mutationFn: (body: { r2Key: string }) => requestOcr(body),
  })
}

export function useOcrStatus(jobId: string | null) {
  return useQuery({
    queryKey: ocrKeys.status(jobId ?? ''),
    queryFn: () => getOcrStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'completed' || status === 'failed') return false
      return 2000
    },
  })
}
