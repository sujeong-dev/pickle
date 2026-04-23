export type BoundingVertex = { x: number; y: number };

export type WordAnnotation = {
  text: string;
  vertices: BoundingVertex[];
};

export type VisionResult = {
  fullText: string;
  wordAnnotations: WordAnnotation[];
};

async function callVisionApi(imageBase64: string) {
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
  return res.json()
}

export async function recognizeReceiptText(imageBase64: string): Promise<string> {
  const data = await callVisionApi(imageBase64)
  return data.responses?.[0]?.fullTextAnnotation?.text ?? ''
}

export async function recognizeReceiptWithAnnotations(imageBase64: string): Promise<VisionResult> {
  const data = await callVisionApi(imageBase64)
  const annotations: Array<{ description: string; boundingPoly?: { vertices: BoundingVertex[] } }> =
    data.responses?.[0]?.textAnnotations ?? []

  // index 0 is the full text block; 1+ are individual word tokens
  const fullText = annotations[0]?.description ?? ''
  const wordAnnotations: WordAnnotation[] = annotations.slice(1).map((a) => ({
    text: a.description,
    vertices: a.boundingPoly?.vertices ?? [],
  }))

  return { fullText, wordAnnotations }
}
