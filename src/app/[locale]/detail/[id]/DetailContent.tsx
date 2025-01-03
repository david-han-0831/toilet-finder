'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ToiletData } from '@/types/toilet';
import Header from '@/components/Header';
import MapWrapper from '@/components/Map/MapWrapper';

interface DetailContentProps {
  id: string;
}

export default function DetailContent({ id }: DetailContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [toilet, setToilet] = useState<ToiletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'walking' | 'transit' | 'driving'>('walking');

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
                한국어: toiletData.한국어,
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
    router.push(`/${locale}`);
  };

  const handleNavigation = () => {
    if (toilet) {
      const baseUrl = 'https://www.google.com/maps/dir/?api=1&';
      const params = new URLSearchParams({
        destination: `${toilet.latitude},${toilet.longitude}`,
        travelmode: selectedMode,
      });

      window.open(baseUrl + params.toString(), '_blank');
    }
  };

  if (isLoading || !toilet) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header onBack={handleBack} title={t('detail.title')} />
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="h-8 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="h-[200px] bg-neutral-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onBack={handleBack} title={t('detail.title')} />
      <div className="max-w-2xl mx-auto px-4 pt-20">
        {/* 화장실 이름 및 주소 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            {toilet.strasse} {toilet.hsNr}
          </h2>
          <p className="text-neutral-700">
            {toilet.plz} {toilet.ort}
          </p>
        </div>

        {/* 참고사항 */}
        {(toilet.anmerkung || toilet.한국어) && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-bold text-neutral-900 mb-2">
              {t('detail.note')}
            </h3>
            <p className="text-neutral-700">
              {locale === 'ko' && toilet.한국어 ? toilet.한국어 : toilet.anmerkung}
            </p>
          </div>
        )}

        {/* 작은 지도 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="h-[160px] w-full rounded-lg overflow-hidden">
            <MapWrapper
              center={{ lat: toilet.latitude, lng: toilet.longitude }}
              markers={[{
                id: toilet.id,
                position: { lat: toilet.latitude, lng: toilet.longitude },
                data: toilet
              }]}
              zoom={16}
              containerClassName="w-full h-full"
            />
          </div>
        </div>

        {/* 이동 수단 선택 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-bold text-neutral-900 mb-3">
            {t('detail.transport.title')}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['walking', 'transit', 'driving'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  selectedMode === mode
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {t(`detail.transport.${mode}`)}
              </button>
            ))}
          </div>
        </div>

        {/* 길찾기 버튼 */}
        <button
          onClick={handleNavigation}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors mb-8"
        >
          {t('detail.navigation')}
        </button>
      </div>
    </div>
  );
} 