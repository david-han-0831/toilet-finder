'use client'

import { useLoadScript } from '@react-google-maps/api';
import GoogleMapComponent from './GoogleMap';
import type { MapProps } from './types';

const libraries: ("places" | "marker")[] = ["places", "marker"];

export default function MapWrapper({ containerClassName, ...props }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  if (loadError) {
    return <div>지도를 불러오는데 실패했습니다.</div>;
  }

  if (!isLoaded) {
    return <div>지도를 불러오는 중...</div>;
  }

  return (
    <div className={containerClassName || "w-full h-full relative"}>
      <GoogleMapComponent {...props} />
    </div>
  );
} 