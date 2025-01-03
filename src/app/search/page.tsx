'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToiletData } from '@/hooks/useToiletData';
import type { ToiletMarker } from '@/types/toilet';
import SearchMap from './SearchMap';
import { formatDistance } from '@/utils/distance';

// 뒤셀도르프 중심부 좌표
const DUSSELDORF_CENTER = {
  lat: 51.2277,
  lng: 6.7735
};

export default function SearchPage() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(DUSSELDORF_CENTER);
  const { toilets, isLoading } = useToiletData({ currentLocation });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToiletMarker[]>([]);

  useEffect(() => {
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
        }
      );
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredToilets = toilets.filter((toilet) => (
      toilet.data.strasse.toLowerCase().includes(searchTerm) ||
      toilet.data.plz.toString().includes(searchTerm) ||
      toilet.data.ort.toLowerCase().includes(searchTerm) ||
      (toilet.data.anmerkung && toilet.data.anmerkung.toLowerCase().includes(searchTerm))
    ));

    setSearchResults(filteredToilets);
  };

  const handleBack = () => {
    router.back();
  };

  const handleToiletClick = (id: string) => {
    router.push(`/detail/${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
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
            <div className="flex-1">
              <input
                type="text"
                placeholder="도로명, 우편번호, 도시명으로 검색"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-100 rounded-full border border-neutral-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 검색 결과 */}
      <div className="max-w-2xl mx-auto px-4 pt-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-neutral-700">데이터를 불러오는 중...</div>
          </div>
        ) : searchQuery ? (
          searchResults.length > 0 ? (
            <>
              {/* 검색 결과 지도 */}
              <div className="mb-4">
                <SearchMap
                  results={searchResults}
                  onMarkerClick={handleToiletClick}
                />
              </div>
              
              {/* 검색 결과 리스트 */}
              <div className="space-y-4">
                {searchResults.map((toilet) => (
                  <button
                    key={toilet.id}
                    onClick={() => handleToiletClick(toilet.id)}
                    className="w-full bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow text-left"
                  >
                    <h3 className="font-bold text-neutral-900">
                      {toilet.data.strasse} {toilet.data.hsNr}
                    </h3>
                    <p className="text-sm text-neutral-700">
                      {toilet.data.plz} {toilet.data.ort}
                    </p>
                    {toilet.data.distance && (
                      <p className="text-sm text-primary mt-1">
                        {formatDistance(toilet.data.distance)} • {toilet.data.walkingTime}
                      </p>
                    )}
                    {toilet.data.anmerkung && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {toilet.data.anmerkung}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-700">검색 결과가 없습니다</p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-700">검색어를 입력해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
} 