/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import { useEffect, useRef, useCallback } from "react";
import type { SelectedLocation } from "../model/useSetBoundary";

declare global {
  interface Window {
    naver: any;
  }
}

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
// const BOUNDARY_RADIUS_M = 1000;
const FALLBACK_CENTER = { lat: 37.5665, lng: 126.978 }; // 서울시청

// naver.maps.Service가 준비될 때까지 재시도 (geocoder 서브모듈 로딩 지연 대응)
// isCancelled() 가 true 를 반환하면 재시도/콜백 모두 중단
function reverseGeocodeWithRetry(
  lat: number,
  lng: number,
  onResult: (loc: SelectedLocation) => void,
  retries = 15,
  isCancelled?: () => boolean,
) {
  if (isCancelled?.()) return;
  const { naver } = window;
  if (!naver?.maps?.Service) {
    if (retries > 0) setTimeout(() => reverseGeocodeWithRetry(lat, lng, onResult, retries - 1, isCancelled), 200);
    return;
  }
  naver.maps.Service.reverseGeocode(
    { coords: new naver.maps.LatLng(lat, lng) },
    (status: any, response: any) => {
      if (isCancelled?.()) return;
      if (status !== naver.maps.Service.Status.OK) return;
      const items: any[] = response.v2?.results ?? [];
      if (items.length === 0) return;
      const region = items[0].region;
      const sido = region?.area1?.name ?? "";
      const sigungu = region?.area2?.name ?? "";
      const city = sido.replace(/(특별시|광역시|특별자치시|도)$/, "");
      const dong = region?.area3?.name ?? "";
      const address = [city, sigungu, dong].filter(Boolean).join(" ");
      onResult({ lat, lng, address, dongName: dong || sigungu, sido, sigungu });
    },
  );
}

interface NaverMapProps {
  onLocationChange: (location: SelectedLocation) => void;
}

export function NaverMap({ onLocationChange }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  // const circleRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => { onLocationChangeRef.current = onLocationChange; }, [onLocationChange]);

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    reverseGeocodeWithRetry(lat, lng, onLocationChangeRef.current);
  }, []);

  const placeMarker = useCallback((lat: number, lng: number) => {
    const { naver } = window;
    if (!naver?.maps || !mapInstanceRef.current) return;
    const position = new naver.maps.LatLng(lat, lng);
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new naver.maps.Marker({
        map: mapInstanceRef.current,
        position,
        icon: {
          content: `<div style="display:flex;flex-direction:column;align-items:center">
            <svg width="38" height="44" viewBox="0 0 38 44" fill="none">
              <path d="M19 0C8.507 0 0 8.507 0 19c0 13.255 19 25 19 25S38 32.255 38 19C38 8.507 29.493 0 19 0Z" fill="#2D8A5A"/>
              <circle cx="19" cy="19" r="7" fill="white"/>
            </svg>
            <div style="width:8px;height:6px;border-radius:9999px;background:rgba(45,138,90,0.3);margin-top:-4px"></div>
          </div>`,
          anchor: new naver.maps.Point(19, 44),
        },
      });
    }
  }, []);

  // const syncCircle = useCallback((map: any, show: boolean) => { ... }, []);

  const applyLocation = useCallback((lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
    placeMarker(lat, lng);
    reverseGeocode(lat, lng);
  }, [placeMarker, reverseGeocode]);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.naver?.maps) return;
    if (mapInstanceRef.current) return;

    const { naver } = window;
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng),
      zoom: 15,
      logoControl: false,
      mapDataControl: false,
      scaleControl: false,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    naver.maps.Event.addListener(map, "idle", () => {
      const c = map.getCenter();
      reverseGeocode(c.lat(), c.lng());
    });

    naver.maps.Event.addListener(map, "center_changed", () => {
      if (markerRef.current) {
        markerRef.current.setPosition(map.getCenter());
      }
    });

    // fallback 위치에 마커 + 주소 세팅 — GPS가 성공하면 취소됨
    placeMarker(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng);
    let fallbackCancelled = false;
    reverseGeocodeWithRetry(
      FALLBACK_CENTER.lat, FALLBACK_CENTER.lng,
      onLocationChangeRef.current,
      15,
      () => fallbackCancelled,
    );

    // GPS 성공 시 fallback 취소 후 실제 위치로 교체
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        fallbackCancelled = true;
        applyLocation(coords.latitude, coords.longitude);
      },
      () => { /* 실패 시 fallback 유지 */ },
      { enableHighAccuracy: true, maximumAge: Infinity },
    );
  }, [reverseGeocode, applyLocation, placeMarker]);

  // Script 이미 로드된 경우 onLoad가 안 뜨므로 즉시 initMap
  useEffect(() => {
    if (window.naver?.maps) initMap();
  }, [initMap]);

  function handleCurrentLocation() {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => applyLocation(coords.latitude, coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }

  return (
    <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-primary-50">
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={initMap}
      />

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} suppressHydrationWarning />

      {/* 현재 위치 버튼 */}
      <button
        type="button"
        onClick={handleCurrentLocation}
        className="absolute bottom-4 right-4 flex items-center justify-center size-11.5 bg-white border border-gray-300 rounded-full shadow-sm"
        aria-label="현재 위치로 이동"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="3.5" stroke="#9E9E9E" strokeWidth="1.5" />
          <line x1="10" y1="1" x2="10" y2="5" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="15" x2="10" y2="19" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="10" x2="5" y2="10" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="10" x2="19" y2="10" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
