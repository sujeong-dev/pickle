export type ParsedItem = { name: string; price: number; quantity: number }

export type ParsedReceipt = {
  branch: string
  totalAmount: number
  itemCount: number
  purchasedAt: string
  items: ParsedItem[]
}

export function parseCostcoReceipt(text: string): ParsedReceipt {
  const branch = text.match(/([가-힣]{1,6}점)/)?.[1] ?? ''

  const totalMatch =
    text.match(/합\s*계\s*[^\d]*([\d,]+)/) ??
    text.match(/소\s*계\s*[^\d]*([\d,]+)/)
  const totalAmount = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : 0

  const dateMatch = text.match(/(\d{4})[/.\-](\d{2})[/.\-](\d{2})/)
  const purchasedAt = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
    : ''

  const items = parseItems(text)

  return { branch, totalAmount, itemCount: items.length, purchasedAt, items }
}

function parseItems(text: string): ParsedItem[] {
  const lines = text.split('\n')
  const items: ParsedItem[] = []

  for (const line of lines) {
    // "상품명 수량 * 단가 합계 T" 패턴
    const multiMatch = line.match(/^(.+?)\s+(\d+)\s*\*\s*([\d,]+)\s+([\d,]+)\s+T/)
    if (multiMatch) {
      items.push({
        name: multiMatch[1].trim(),
        price: Number(multiMatch[3].replace(/,/g, '')),
        quantity: Number(multiMatch[2]),
      })
      continue
    }
    // "상품명 가격 T" 패턴
    const singleMatch = line.match(/^(.+?)\s+([\d,]+)\s+T$/)
    if (singleMatch) {
      items.push({
        name: singleMatch[1].trim(),
        price: Number(singleMatch[2].replace(/,/g, '')),
        quantity: 1,
      })
    }
  }

  return items
}
