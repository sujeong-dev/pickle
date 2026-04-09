"use client";

import { useState } from "react";

export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;  // e.g. "서울 서초구 양재동"
  dongName: string; // e.g. "양재동"
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
