import { useMutation, useQuery } from '@tanstack/react-query'
import { getPresignedUrl, requestOcr, getOcrStatus } from '@/shared/api/report'
import type { PresignedUrlBody } from '@/shared/api/report'

export const ocrKeys = {
  all: ['ocr'] as const,
  status: (jobId: string) => [...ocrKeys.all, 'status', jobId] as const,
}

export function useUploadPresigned() {
  return useMutation({
    mutationFn: (body: PresignedUrlBody) => getPresignedUrl(body),
  })
}

export function useOcrProduct() {
  return useMutation({
    mutationFn: (imageFile: File) => requestOcr(imageFile),
  })
}

export function useOcrStatus(jobId: string | null) {
  return useQuery({
    queryKey: ocrKeys.status(jobId ?? ''),
    queryFn: () => getOcrStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'done' || status === 'failed') return false
      return 2000
    },
  })
}
