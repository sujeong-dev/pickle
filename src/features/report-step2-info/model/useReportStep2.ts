import { useState } from "react";

export function useReportStep2() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoR2Keys, setPhotoR2Keys] = useState<string[]>([]);
  const [representativeIdx, setRepresentativeIdx] = useState(0);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productCode, setProductCode] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");

  const addPhoto = (file: File, r2Key: string) => {
    setPhotos((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, file];
    });
    setPhotoR2Keys((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, r2Key];
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (representativeIdx >= next.length) {
        setRepresentativeIdx(Math.max(0, next.length - 1));
      }
      return next;
    });
    setPhotoR2Keys((prev) => prev.filter((_, i) => i !== idx));
  };

  return {
    photos,
    photoR2Keys,
    representativeIdx,
    productName,
    price,
    productCode,
    originalPrice,
    description,
    addPhoto,
    removePhoto,
    setRepresentativeIdx,
    setProductName,
    setPrice,
    setProductCode,
    setOriginalPrice,
    setDescription,
  };
}
