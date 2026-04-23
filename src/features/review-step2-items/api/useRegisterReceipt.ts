import { useMutation } from '@tanstack/react-query'
import { registerReceipt } from '@/shared/api/receipt'
import type { RegisterReceiptBody, RegisterReceiptResponse } from '@/shared/api/receipt'

export function useRegisterReceipt() {
  return useMutation<RegisterReceiptResponse, Error, RegisterReceiptBody>({
    mutationFn: (body) => registerReceipt(body),
  })
}
