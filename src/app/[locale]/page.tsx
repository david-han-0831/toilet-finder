'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import MapWrapper from '@/components/Map/MapWrapper';
import { useToiletData } from '@/hooks/useToiletData';
import Header from '@/components/Header';

// 뒤셀도르프 중심부 좌표
const DUSSELDORF_CENTER = {
  lat: 51.2277,
  lng: 6.7735
};

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale();
  const [currentLocation] = useState<google.maps.LatLngLiteral>(DUSSELDORF_CENTER);
  const { toilets } = useToiletData({ currentLocation });

  const handleSearch = () => {
    router.push(`/${locale}/search`);
  };

  return (
    <main className="flex flex-col min-h-screen bg-neutral-50">
      <Header showSearch onSearch={handleSearch} />

      {/* 지도 영역 */}
      <div className="flex-1 mt-[60px]" style={{ height: 'calc(100vh - 60px)' }}>
        <MapWrapper
          center={currentLocation}
          markers={toilets}
          onMarkerClick={(id) => router.push(`/${locale}/detail/${id}`)}
          containerClassName="absolute inset-0"
        />
      </div>
    </main>
  );
} 