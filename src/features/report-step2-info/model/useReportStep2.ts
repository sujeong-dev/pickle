import { useState } from "react";

export function useReportStep2() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [representativeIdx, setRepresentativeIdx] = useState(0);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [review, setReview] = useState("");

  const addPhoto = (file: File) => {
    setPhotos((prev) => (prev.length < 5 ? [...prev, file] : prev));
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (representativeIdx >= next.length) {
        setRepresentativeIdx(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  return {
    photos,
    representativeIdx,
    productCode,
    productName,
    discountPrice,
    originalPrice,
    review,
    addPhoto,
    removePhoto,
    setRepresentativeIdx,
    setProductCode,
    setProductName,
    setDiscountPrice,
    setOriginalPrice,
    setReview,
  };
}
