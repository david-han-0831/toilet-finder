'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToiletData } from '@/types/toilet';
import { formatDistance, calculateWalkingTime } from '@/utils/distance';

interface DetailContentProps {
  id: string;
}

interface TransportMode {
  id: 'walking' | 'transit' | 'driving';
  label: string;
  icon: JSX.Element;
}

const transportModes: TransportMode[] = [
  {
    id: 'walking',
    label: '도보',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 14.5l-3 3m0 0l-3-3m3 3V9m0 0l3-3m-3 3l-3-3" />
        <circle cx="12" cy="5" r="1" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: 'transit',
    label: '대중교통',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'driving',
    label: '자동차',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z" />
      </svg>
    ),
  },
];

// 뒤셀도르프 중심부 좌표
const DUSSELDORF_CENTER = {
  lat: 51.2277,
  lng: 6.7735
};

export default function DetailContent({ id }: DetailContentProps) {
  const router = useRouter();
  const [toilet, setToilet] = useState<ToiletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<TransportMode['id']>('walking');
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(DUSSELDORF_CENTER);

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 실제 위치가 독일 근처인 경우에만 현재 위치 사용
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (lat > 47 && lat < 55 && lng > 5 && lng < 15) {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error);
          // 에러 시 뒤셀도르프 중심부를 기본값으로 사용
          setCurrentLocation(DUSSELDORF_CENTER);
        }
      );
    }
  }, []);

  useEffect(() => {
    async function loadToiletData() {
      try {
        const response = await fetch('/data/dus-toilet.csv');
        const csvText = await response.text();
        
        const Papa = (await import('papaparse')).default;
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const toiletData = results.data[Number(id)];
            if (toiletData) {
              setToilet({
                id,
                latitude: toiletData.LATITUDE,
                longitude: toiletData.LONGITUDE,
                strasse: toiletData.STRASSE,
                hsNr: toiletData.HsNr,
                plz: toiletData.PLZ,
                ort: toiletData.ORT,
                anmerkung: toiletData.ANMERKUNG,
              });
            }
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error('Failed to load toilet data:', error);
        setIsLoading(false);
      }
    }

    loadToiletData();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleNavigation = () => {
    if (toilet) {
      // Google Maps 길찾기 URL 형식 수정
      const baseUrl = 'https://www.google.com/maps/dir/?api=1&';
      const params = new URLSearchParams({
        origin: `${currentLocation.lat},${currentLocation.lng}`,
        destination: `${toilet.latitude},${toilet.longitude}`,
        travelmode: selectedMode,  // walking, transit, driving
      });

      const url = baseUrl + params.toString();
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!toilet) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-xl font-bold text-neutral-900 mb-4">
            화장실을 찾을 수 없습니다
          </h1>
          <button
            onClick={handleBack}
            className="text-primary hover:text-primary-dark"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-neutral-100 rounded-full"
              aria-label="뒤로 가기"
            >
              <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-neutral-900">화장실 정보</h1>
          </div>
        </div>
      </header>

      {/* 상세 정보 */}
      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 지도 미리보기 */}
          <div className="h-48 bg-neutral-100 relative">
            <iframe
              className="w-full h-full border-0"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${toilet.latitude},${toilet.longitude}&zoom=17`}
              allowFullScreen
            />
          </div>

          <div className="p-4">
            {/* 주소 정보 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                {toilet.strasse} {toilet.hsNr}
              </h2>
              <p className="text-neutral-700">
                {toilet.plz} {toilet.ort}
              </p>
            </div>

            {/* 시설 정보 */}
            {toilet.anmerkung && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">시설 정보</h3>
                <p className="text-neutral-700 bg-neutral-50 p-3 rounded-md">
                  {toilet.anmerkung}
                </p>
              </div>
            )}

            {/* 길찾기 옵션 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">이동 수단</h3>
              <div className="flex gap-2">
                {transportModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex-1 py-2 px-3 rounded-lg border ${
                      selectedMode === mode.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    } flex items-center justify-center gap-2 transition-colors`}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 길찾기 버튼 */}
            <button
              onClick={handleNavigation}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              길찾기
            </button>
          </div>
        </div>
      </div>

      {/* 현재 위치 정보 표시 (테스트용) */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-2">현재 위치 (테스트용)</h3>
          <p className="text-sm text-neutral-500">
            위도: {currentLocation.lat.toFixed(6)}<br />
            경도: {currentLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
} 