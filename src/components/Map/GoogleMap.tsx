'use client'

import { useCallback, useState, useEffect } from 'react'
import { GoogleMap } from '@react-google-maps/api'
import type { MapProps } from './types'

const defaultCenter = {
  lat: 51.2277,
  lng: 6.7735
};

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
};

/**
 * Google Maps 컴포넌트
 * 지도를 표시하고 마커를 관리합니다.
 */
export default function GoogleMapComponent({ 
  center = defaultCenter, 
  markers = [], 
  onMarkerClick,
  zoom = 13
}: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [advancedMarkers, setAdvancedMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (map) {
      // 기존 마커들 제거
      advancedMarkers.forEach(marker => marker.setMap(null));
      
      // 새로운 마커 생성
      const newMarkers = markers.map(({ id, position, data }) => {
        const title = data?.hsNr ? `${data.strasse} ${data.hsNr}` : data?.strasse;
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          title,
        });

        marker.addListener('click', () => onMarkerClick?.(id));
        return marker;
      });

      setAdvancedMarkers(newMarkers);
    }
  }, [map, markers, onMarkerClick]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    advancedMarkers.forEach(marker => marker.setMap(null));
    setAdvancedMarkers([]);
    setMap(null);
  }, [advancedMarkers]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    />
  );
} 