import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@wrksz/themes/next';
import { ThemeHotkey } from '@/components/theme-hotkey';
import { CookieUpdater } from '@/components/cookie-updater';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '@/styles/globals.css';

const baseUrl = "https://example.com";

type Props = { children: React.ReactNode; params: Promise<{locale: string}>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("meta.site-name"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
    robots: { index: true, follow: true },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: t("meta.site-name"),
      description: t("meta.description"),
      url: baseUrl,
      siteName: t("meta.site-name"),
      locale,
      type: "website",
      images: [{ url: t("meta.openGraph.image"), width: 1200, height: 630 }],
    },
    twitter: {
      card: t("meta.twitter.card") as "summary_large_image",
      site: t("meta.twitter.profile"),
      title: t("meta.site-name"),
      description: t("meta.description"),
      images: [t("meta.openGraph.image")],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    other: {
      "color-scheme": "light dark",
      "googlebot": "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
    },
  };
}
 
export default async function RootLayout({children, params}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <CookieUpdater locale={locale} />
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange themeColor={{ light: "#ffffff", dark: "#0a0a0a" }}>
              <ThemeHotkey />
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
