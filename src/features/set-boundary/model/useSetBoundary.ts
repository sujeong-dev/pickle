"use client";

import { useState } from "react";

export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;  // e.g. "서울 서초구 양재동"
  dongName: string; // e.g. "양재동"
  sido: string;     // e.g. "서울특별시" (Naver area1.name)
  sigungu: string;  // e.g. "서초구" (Naver area2.name)
}

export function useSetBoundary() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  function clearLocation() {
    setSelectedLocation(null);
  }

  return {
    selectedLocation,
    setSelectedLocation,
    clearLocation,
    isSelected: selectedLocation !== null,
  };
}
