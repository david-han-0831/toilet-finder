import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 지원하는 언어 목록을 타입으로 정의
export type Locale = 'de' | 'ko' | 'en';

// 지원하는 언어와 기본 언어 설정
export const locales: Locale[] = ['de', 'ko', 'en'];
export const defaultLocale: Locale = 'de';

export default getRequestConfig(async ({locale}) => {
  // 지원하지 않는 locale인 경우 404
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Berlin',
    now: new Date(),
  };
}); 