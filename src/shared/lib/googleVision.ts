export async function recognizeReceiptText(imageBase64: string): Promise<string> {
  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{ image: { content: imageBase64 }, features: [{ type: 'TEXT_DETECTION' }] }],
      }),
    }
  )
  const data = await res.json()
  return data.responses?.[0]?.fullTextAnnotation?.text ?? ''
}
