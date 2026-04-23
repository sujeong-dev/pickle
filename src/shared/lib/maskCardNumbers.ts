import type { WordAnnotation, BoundingVertex } from './googleVision';

type Rect = { x: number; y: number; width: number; height: number };

// 4자리 숫자 그룹, **** 또는 XXXX 형태
const CARD_GROUP_RE = /^[\d\*xX]{4}$/;

// 민감한 번호로 판단할 키워드 (회원 번호, 카드 번호 등)
const SENSITIVE_LABEL_RE = /번호/;

function getBoundingRect(vertices: BoundingVertex[]): Rect {
  const xs = vertices.map((v) => v.x ?? 0);
  const ys = vertices.map((v) => v.y ?? 0);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

function mergeRects(rects: Rect[]): Rect {
  const xs = rects.flatMap((r) => [r.x, r.x + r.width]);
  const ys = rects.flatMap((r) => [r.y, r.y + r.height]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

function minY(vertices: BoundingVertex[]): number {
  return Math.min(...vertices.map((v) => v.y ?? 0));
}

// 두 단어가 같은 줄에 있는지 Y 좌표 기준으로 판단
function isSameLine(a: BoundingVertex[], b: BoundingVertex[], threshold = 20): boolean {
  return Math.abs(minY(a) - minY(b)) < threshold;
}

export function findCardNumberRegions(wordAnnotations: WordAnnotation[]): Rect[] {
  const regions: Rect[] = [];

  for (let i = 0; i < wordAnnotations.length; i++) {
    const word = wordAnnotations[i];
    const text = word.text;

    // "회원" 토큰 발견 시 → 같은 줄에서 "번호" 포함 토큰을 찾고, 그 뒤 숫자를 마스킹
    if (text === '회원') {
      let memberLabelIdx = -1;
      for (let j = i + 1; j < wordAnnotations.length; j++) {
        if (!isSameLine(word.vertices, wordAnnotations[j].vertices)) break;
        if (SENSITIVE_LABEL_RE.test(wordAnnotations[j].text)) {
          memberLabelIdx = j;
          break;
        }
      }
      if (memberLabelIdx !== -1) {
        for (let j = memberLabelIdx + 1; j < wordAnnotations.length; j++) {
          const next = wordAnnotations[j];
          if (!isSameLine(word.vertices, next.vertices)) break;
          if (/^\d{6,}$/.test(next.text)) {
            regions.push(getBoundingRect(next.vertices));
            break;
          }
        }
      }
      continue;
    }

    // 16자리 연속 숫자 (카드번호가 붙어서 인식된 경우)
    if (/^\d{16}$/.test(text)) {
      regions.push(getBoundingRect(word.vertices));
      continue;
    }

    // 4개 연속 4자리 그룹이 같은 줄에 있는 경우 (카드번호: 1234 5678 9012 3456)
    if (CARD_GROUP_RE.test(text) && i + 3 < wordAnnotations.length) {
      const group = [
        wordAnnotations[i],
        wordAnnotations[i + 1],
        wordAnnotations[i + 2],
        wordAnnotations[i + 3],
      ];
      const allMatch = group.every((w) => CARD_GROUP_RE.test(w.text));
      const sameLine = isSameLine(word.vertices, wordAnnotations[i + 3].vertices);

      if (allMatch && sameLine) {
        regions.push(mergeRects(group.map((w) => getBoundingRect(w.vertices))));
        i += 3;
      }
    }
  }

  return regions;
}

export function maskCardNumbers(imageFile: File, wordAnnotations: WordAnnotation[]): Promise<Blob> {
  const regions = findCardNumberRegions(wordAnnotations);

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      ctx.fillStyle = '#000000';
      const PADDING = 6;
      for (const r of regions) {
        ctx.fillRect(r.x - PADDING, r.y - PADDING, r.width + PADDING * 2, r.height + PADDING * 2);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        imageFile.type || 'image/jpeg',
        0.95,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image load failed'));
    };

    img.src = objectUrl;
  });
}
