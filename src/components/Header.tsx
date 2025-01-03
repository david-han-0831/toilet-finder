'use client';

import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
  showSearch?: boolean;
  onSearch?: () => void;
}

export default function Header({ onBack, title, showSearch, onSearch }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center">
          {/* 왼쪽: 뒤로가기 또는 로고 */}
          <div className="w-[200px]">
            {onBack ? (
              <button
                onClick={onBack}
                className="p-2 hover:bg-neutral-100 rounded-full"
                aria-label={t('common.back')}
              >
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <h1 className="text-xl font-bold text-primary">{t('common.appName')}</h1>
            )}
          </div>

          {/* 중앙: 제목 또는 검색 */}
          <div className="flex-1 flex justify-center">
            {showSearch ? (
              <div className="w-full max-w-xl">
                <button 
                  onClick={onSearch}
                  className="w-full px-4 py-2.5 text-left text-neutral-700 bg-neutral-100 rounded-full border border-neutral-200 hover:border-neutral-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('home.search.placeholder')}
                </button>
              </div>
            ) : (
              <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
            )}
          </div>

          {/* 오른쪽: 언어 선택 */}
          <div className="w-[200px] flex justify-end">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
} 