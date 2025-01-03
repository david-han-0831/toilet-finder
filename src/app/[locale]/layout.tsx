import { Geist } from "next/font/google";
import { unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <html suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Europe/Berlin"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Metadata
export const metadata = {
  title: 'ToiletFinder',
  description: 'Find public toilets in Düsseldorf',
}; 