"use client";

import { useEffect } from "react";

export function CookieUpdater({ locale }: { locale: string }) {
  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // expires in 1 year
  }, [locale]);

  return null;
}
