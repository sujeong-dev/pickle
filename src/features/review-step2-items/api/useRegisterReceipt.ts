import { useMutation } from '@tanstack/react-query'
import { createReceipt } from '@/shared/api/receipt'
import type { CreateReceiptBody, CreateReceiptResponse } from '@/shared/api/receipt'

export function useRegisterReceipt() {
  return useMutation<CreateReceiptResponse, Error, CreateReceiptBody>({
    mutationFn: (body) => createReceipt(body),
  })
}
