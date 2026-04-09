/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import { useEffect, useRef, useCallback } from "react";
import type { SelectedLocation } from "../model/useSetBoundary";

// Naver Maps JS SDK is loaded dynamically; no @types package exists.
declare global {
  interface Window {
    naver: any;
  }
}

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const BOUNDARY_RADIUS_M = 1000;
const FALLBACK_CENTER = { lat: 37.5665, lng: 126.978 }; // 서울시청

interface NaverMapProps {
  onLocationChange: (location: SelectedLocation) => void;
  showBoundary: boolean;
}

export function NaverMap({ onLocationChange, showBoundary }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const geoWatchRef = useRef<number | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const showBoundaryRef = useRef(showBoundary);
  useEffect(() => { onLocationChangeRef.current = onLocationChange; }, [onLocationChange]);
  useEffect(() => { showBoundaryRef.current = showBoundary; }, [showBoundary]);

  // GPS watch 언마운트 시 정리
  useEffect(() => {
    const watchRef = geoWatchRef;
    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation?.clearWatch(watchRef.current);
      }
    };
  }, []);

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    const { naver } = window;
    if (!naver?.maps?.Service) return;

    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(lat, lng),
        orders: [naver.maps.Service.OrderType.ADDR],
      },
      (status: any, response: any) => {
        if (status !== naver.maps.Service.Status.OK) return;

        const items: any[] = response.v2?.results ?? [];
        if (items.length === 0) return;

        const region = items[0].region;
        const city = (region?.area1?.name ?? "");
        // const city = (region?.area1?.name ?? '').replace(
        //   /(특별시|광역시|특별자치시|도)$/,
        //   '',
        // );
        const gu = region?.area2?.name ?? "";
        const dong = region?.area3?.name ?? "";
        const address = [city, gu, dong].filter(Boolean).join(" ");

        onLocationChangeRef.current({ lat, lng, address, dongName: dong || gu });
      },
    );
  }, []);

  const syncCircle = useCallback((map: any, show: boolean) => {
    const { naver } = window;
    if (!naver?.maps) return;

    if (show) {
      if (!circleRef.current) {
        circleRef.current = new naver.maps.Circle({
          map,
          center: map.getCenter(),
          radius: BOUNDARY_RADIUS_M,
          fillColor: "#2D8A5A",
          fillOpacity: 0.1,
          strokeColor: "#2D8A5A",
          strokeOpacity: 0.2,
          strokeWeight: 1,
        });
      } else {
        circleRef.current.setMap(map);
      }
    } else {
      circleRef.current?.setMap(null);
    }
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.naver?.maps) return;
    if (mapInstanceRef.current) return;

    const { naver } = window;

    // 1. 즉시 fallback 위치로 지도 렌더링
    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng),
      zoom: 15,
      logoControl: false,
      mapDataControl: false,
      scaleControl: false,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // 2. 현재 위치로 이동 — timeout: Infinity로 위치 확보될 때까지 대기
    if (navigator.geolocation) {
      geoWatchRef.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          if (geoWatchRef.current !== null) {
            navigator.geolocation.clearWatch(geoWatchRef.current);
            geoWatchRef.current = null;
          }
          map.setCenter(new naver.maps.LatLng(coords.latitude, coords.longitude));
        },
        (err) => {
          // PERMISSION_DENIED만 watch 해제, TIMEOUT/UNAVAILABLE은 계속 재시도
          if (err.code === err.PERMISSION_DENIED && geoWatchRef.current !== null) {
            navigator.geolocation.clearWatch(geoWatchRef.current);
            geoWatchRef.current = null;
          }
        },
        { enableHighAccuracy: false, timeout: Infinity, maximumAge: 30000 },
      );
    }

    naver.maps.Event.addListener(map, "idle", () => {
      const c = map.getCenter();
      reverseGeocode(c.lat(), c.lng());
    });

    naver.maps.Event.addListener(map, "center_changed", () => {
      circleRef.current?.setCenter(map.getCenter());
    });

    syncCircle(map, showBoundaryRef.current);
  }, [reverseGeocode, syncCircle]);

  // showBoundary 변경 시 원 표시/숨김
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    syncCircle(mapInstanceRef.current, showBoundary);
  }, [showBoundary, syncCircle]);

  function handleCurrentLocation() {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const center = new window.naver.maps.LatLng(coords.latitude, coords.longitude);
        mapInstanceRef.current.setCenter(center);
      },
      () => { /* 오류 시 무시 */ },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  }

  return (
    <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-primary-50">
      {/* SDK 로드 완료 시 initMap 호출 — geocoder submodule 포함 */}
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={initMap}
      />

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} suppressHydrationWarning />

      {/* 고정 중심 핀 */}
      {/* <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center" style={{ marginTop: "-22px" }}>
          <svg width="38" height="44" viewBox="0 0 38 44" fill="none">
            <path
              d="M19 0C8.507 0 0 8.507 0 19c0 13.255 19 25 19 25S38 32.255 38 19C38 8.507 29.493 0 19 0Z"
              fill="#2D8A5A"
            />
            <circle cx="19" cy="19" r="7" fill="white" />
          </svg>
          <div className="w-2 h-1.5 rounded-full bg-primary-500/30 -mt-1" />
        </div>
      </div> */}

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
