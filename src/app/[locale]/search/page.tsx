'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useToiletData } from '@/hooks/useToiletData';
import type { ToiletMarker } from '@/types/toilet';
import SearchMap from '@/app/[locale]/search/SearchMap';
import { formatDistance } from '@/utils/distance';
import Header from '@/components/Header';

// 뒤셀도르프 중심부 좌표
const DUSSELDORF_CENTER = {
  lat: 51.2277,
  lng: 6.7735
};

export default function SearchPage() {
  const router = useRouter();
  const t = useTranslations();
  const [currentLocation] = useState<google.maps.LatLngLiteral>(DUSSELDORF_CENTER);
  const { toilets } = useToiletData({ currentLocation });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToiletMarker[]>([]);
  const locale = useLocale();

  const handleBack = () => {
    router.back();
  };

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

  const handleToiletClick = (id: string) => {
    router.push(`/${locale}/detail/${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        onBack={handleBack}
        title={t('search.title')}
      />

      {/* 검색바 */}
      <div className="max-w-2xl mx-auto px-4 pt-20">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-2.5 bg-white rounded-full border border-neutral-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* 검색 결과 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-neutral-700">{t('common.loading')}</div>
          </div>
        ) : searchQuery ? (
          searchResults.length > 0 ? (
            <>
              {/* 검색 결과 지도 */}
              <div className="mt-4 mb-4">
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
              <p className="text-neutral-700">{t('search.noResults')}</p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-700">{t('search.enterKeyword')}</p>
          </div>
        )}
      </div>
    </div>
  );
} 