'use client'

import { useEffect, useState } from 'react';
import MapWrapper from '@/components/Map/MapWrapper';
import type { ToiletMarker } from '@/types/toilet';

interface SearchMapProps {
  results: ToiletMarker[];
  onMarkerClick: (id: string) => void;
}

export default function SearchMap({ results, onMarkerClick }: SearchMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | undefined>(undefined);

  useEffect(() => {
    if (results.length > 0) {
      // 검색 결과의 중심점을 계산
      const lat = results.reduce((sum, marker) => sum + marker.position.lat, 0) / results.length;
      const lng = results.reduce((sum, marker) => sum + marker.position.lng, 0) / results.length;
      setCenter({ lat, lng });
    }
  }, [results]);

  return (
    <div className="h-[300px] rounded-lg overflow-hidden">
      <MapWrapper
        center={center}
        markers={results}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
} 