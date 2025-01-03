'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from 'next-intl';

const languages = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
];

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    // 현재 URL에서 경로만 추출
    const path = window.location.pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${path}`);
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
} 