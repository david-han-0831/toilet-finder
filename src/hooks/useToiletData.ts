'use client'

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { ToiletData, ToiletMarker } from '@/types/toilet';
import { calculateDistance, calculateWalkingTime } from '@/utils/distance';

interface UseToiletDataOptions {
  currentLocation?: google.maps.LatLngLiteral;
}

export function useToiletData({ currentLocation }: UseToiletDataOptions = {}) {
  const [toilets, setToilets] = useState<ToiletMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/dus-toilet.csv');
        const csvText = await response.text();
        
        Papa.parse<any>(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const markers: ToiletMarker[] = results.data
              .filter((row: any) => row.LATITUDE && row.LONGITUDE)
              .map((row: any, index: number) => {
                const toiletData: ToiletData = {
                  id: index.toString(),
                  latitude: row.LATITUDE,
                  longitude: row.LONGITUDE,
                  strasse: row.STRASSE || '',
                  hsNr: row.HsNr || '',
                  plz: row.PLZ || '',
                  ort: row.ORT || '',
                  anmerkung: row.ANMERKUNG || '',
                };

                // 현재 위치가 있으면 거리 계산
                if (currentLocation) {
                  const distance = calculateDistance(
                    currentLocation.lat,
                    currentLocation.lng,
                    toiletData.latitude,
                    toiletData.longitude
                  );
                  toiletData.distance = distance;
                  toiletData.walkingTime = calculateWalkingTime(distance);
                }

                return {
                  id: toiletData.id,
                  position: {
                    lat: toiletData.latitude,
                    lng: toiletData.longitude,
                  },
                  data: toiletData,
                };
              });

            // 현재 위치가 있으면 거리순으로 정렬
            if (currentLocation) {
              markers.sort((a, b) => (a.data.distance || 0) - (b.data.distance || 0));
            }

            setToilets(markers);
            setIsLoading(false);
          },
          error: (error) => {
            setError(error.message);
            setIsLoading(false);
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentLocation]);

  return { toilets, isLoading, error };
} 