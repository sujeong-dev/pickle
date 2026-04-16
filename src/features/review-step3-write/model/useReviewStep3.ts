import { useState } from "react";

type ItemReview = {
  photos: File[];
  representativeIdx: number;
  rating: number;
  comment: string;
};

function makeDefault(): ItemReview {
  return { photos: [], representativeIdx: 0, rating: 3, comment: "" };
}

export function useReviewStep3(itemCount: number) {
  const [lastItemCount, setLastItemCount] = useState(itemCount);
  const [reviews, setReviews] = useState<ItemReview[]>(() =>
    Array.from({ length: itemCount }, makeDefault),
  );

  // itemCount가 바뀌면 render 중에 바로 재초기화 (useEffect 없이)
  if (lastItemCount !== itemCount) {
    setLastItemCount(itemCount);
    setReviews(Array.from({ length: itemCount }, makeDefault));
  }

  const setRating = (itemIdx: number, rating: number) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === itemIdx ? { ...r, rating } : r)),
    );
  };

  const setComment = (itemIdx: number, comment: string) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === itemIdx ? { ...r, comment } : r)),
    );
  };

  const addPhoto = (itemIdx: number, file: File) => {
    setReviews((prev) =>
      prev.map((r, i) =>
        i === itemIdx && r.photos.length < 5
          ? { ...r, photos: [...r.photos, file] }
          : r,
      ),
    );
  };

  const removePhoto = (itemIdx: number, photoIdx: number) => {
    setReviews((prev) =>
      prev.map((r, i) => {
        if (i !== itemIdx) return r;
        const photos = r.photos.filter((_, j) => j !== photoIdx);
        const representativeIdx = r.representativeIdx >= photos.length
          ? Math.max(0, photos.length - 1)
          : r.representativeIdx;
        return { ...r, photos, representativeIdx };
      }),
    );
  };

  const setRepresentative = (itemIdx: number, photoIdx: number) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === itemIdx ? { ...r, representativeIdx: photoIdx } : r)),
    );
  };

  return { reviews, setRating, setComment, addPhoto, removePhoto, setRepresentative };
}
